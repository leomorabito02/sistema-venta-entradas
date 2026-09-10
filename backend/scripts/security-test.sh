#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Export Go bin to PATH
export PATH="$PATH:$(go env GOPATH)/bin"

# Ensure we run from the backend root directory
cd "$(dirname "$0")/.."


echo "======================================"
echo " 1) SAST: Static Application Security Testing"
echo "======================================"
echo "Installing gosec..."
go install github.com/securego/gosec/v2/cmd/gosec@latest
echo "Running gosec..."
set +e
gosec -fmt=json -out=sast_report.json ./...
SAST_EXIT=$?
set -e
if [ $SAST_EXIT -eq 0 ]; then
  echo "✅ SAST passed."
else
  echo "❌ SAST found vulnerabilities. Check sast_report.json"
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

API_PID=""

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

  echo "Starting API server in background..."
  go run cmd/server/main.go &
  API_PID=$!

  echo "Waiting for API to initialize (10s)..."
  sleep 10

  ZAP_TARGET="http://host.docker.internal:8089"
fi

echo "Running OWASP ZAP Baseline Scan via Docker (target: $ZAP_TARGET)..."
set +e
docker run --rm \
  --add-host host.docker.internal:host-gateway \
  -v "$(pwd)":/zap/wrk/:rw \
  -t zaproxy/zap-stable \
  zap-baseline.py -t "$ZAP_TARGET" -r zap_report.html -I
DAST_EXIT=$?
set -e

echo "Shutting down resources..."
if [ -n "$API_PID" ]; then
  kill $API_PID || true
  docker rm -f security_test_db || true
fi

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
