#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Export Go bin to PATH
export PATH="$PATH:$(go env GOPATH)/bin"

# Ensure we run from the backend root directory
cd "$(dirname "$0")/.."


echo "======================================"

API_PID=""
function cleanup {
  echo "Shutting down resources..."
  if [ -n "$API_PID" ]; then
    kill $API_PID || true
  fi
  docker rm -f security_test_db || true
}
trap cleanup EXIT

echo " 1) SAST: Static Application Security Testing"
echo "======================================"
echo "Installing gosec..."
go install github.com/securego/gosec/v2/cmd/gosec@latest
echo "Running gosec..."
set +e
# Generate the full report (ignoring exit code for this step)
gosec -fmt=json -out=sast_report.json ./... >/dev/null 2>&1

# Run again to print and fail only on HIGH severity
gosec -severity high ./...
SAST_EXIT=$?
set -e
if [ $SAST_EXIT -eq 0 ]; then
  echo "✅ SAST passed."
else
  echo "❌ SAST found HIGH vulnerabilities! Pipeline will be stopped."
  exit 1
fi

echo ""
echo "======================================"
echo " 2) SCA: Software Composition Analysis"
echo "======================================"
echo "Installing govulncheck..."
go install golang.org/x/vuln/cmd/govulncheck@latest
echo "Running govulncheck..."
set +e
govulncheck ./... > sca_report.txt
SCA_EXIT=$?
set -e
if [ $SCA_EXIT -eq 0 ]; then
  echo "✅ SCA passed."
else
  echo "❌ SCA found vulnerabilities. Check sca_report.txt"
fi

echo ""
echo "======================================"
echo " 3) DAST: Dynamic Application Security Testing (OWASP ZAP)"
echo "======================================"

if [ -n "${DAST_TARGET_URL:-}" ]; then
  echo "Using deployed service: $DAST_TARGET_URL"
  ZAP_TARGET="$DAST_TARGET_URL"
else
  echo "No DAST_TARGET_URL set. Starting local environment for manual run..."
  docker run --name security_test_db \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=testdb \
    -p 5432:5432 \
    -d postgres:15-alpine || true

  echo "Waiting for DB to start..."
  sleep 5

  export DATABASE_URL="postgres://postgres:postgres@localhost:5432/testdb?sslmode=disable"
  export JWT_SECRET="Kj8mN2pQr5vXz9LbWc3tYs7uFhAe1DgHiJmMpNq4Ovs=" # gitleaks:allow
  export JWT_ACCESS_EXPIRATION_MINUTES="15"
  export ALLOWED_ORIGINS="http://localhost:4200"
  export INITIAL_ADMIN_EMAIL="admin@sistema.com"
  export FIREBASE_PROJECT_ID="test-project"
  export PORT="8089"

  echo "Running database migrations..."
  go run cmd/migrate/main.go

  echo "Building and starting API server in background..."
  go build -o /tmp/security_test_server cmd/server/main.go
  /tmp/security_test_server &
  API_PID=$!

  echo "Waiting for API to initialize (10s)..."
  sleep 10

  ZAP_TARGET="http://host.docker.internal:8089"
fi

echo "Generating Swagger Documentation (OpenAPI spec)..."
go install github.com/swaggo/swag/cmd/swag@latest
swag init -g cmd/server/main.go -o docs

TEST_JWT=""
if [ -n "$DATABASE_URL" ]; then
  echo "Generating test JWT token..."
  TEST_JWT=$(go run tools/gen_test_jwt/main.go || echo "")
fi

ZAP_OPTS=("-t" "docs/swagger.json" "-f" "openapi" "-O" "$ZAP_TARGET" "-r" "zap_report.html")
if [ -n "$TEST_JWT" ]; then
  echo "JWT generated successfully. Configuring ZAP to use it..."
  ZAP_OPTS+=("-z" "-config replacer.full_list(0).description=auth1 -config replacer.full_list(0).enabled=true -config replacer.full_list(0).matchtype=req_header -config replacer.full_list(0).matchstr=Authorization -config replacer.full_list(0).regex=false -config replacer.full_list(0).replacement=Bearer $TEST_JWT")
fi

echo "Running OWASP ZAP API Scan via Docker (target: $ZAP_TARGET)..."
set +e
docker run --rm \
  --add-host host.docker.internal:host-gateway \
  -v "$(pwd)":/zap/wrk/:rw \
  -t zaproxy/zap-stable \
  zap-api-scan.py "${ZAP_OPTS[@]}"
DAST_EXIT=$?
set -e

if [ $DAST_EXIT -eq 0 ]; then
  echo "✅ DAST passed."
else
  echo "❌ DAST found vulnerabilities. Check zap_report.html"
fi

echo ""
echo "======================================"
echo " Security Testing Summary"
echo "======================================"
FINAL_EXIT=0
if [ $SAST_EXIT -ne 0 ]; then FINAL_EXIT=$SAST_EXIT; fi
if [ $SCA_EXIT -ne 0 ]; then FINAL_EXIT=$SCA_EXIT; fi
if [ $DAST_EXIT -ne 0 ]; then FINAL_EXIT=$DAST_EXIT; fi

if [ $FINAL_EXIT -eq 0 ]; then
  echo "✅ All security tests passed!"
else
  echo "❌ Some security tests failed."
fi

exit $FINAL_EXIT
