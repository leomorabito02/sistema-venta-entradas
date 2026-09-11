# SonarQube Scanner Configuration

## Frontend (Angular)
```bash
# Execute unit tests with code coverage report
pnpm test -- --watch=false --code-coverage

# Run SonarQube Scanner
pnpm dlx sonarqube-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_b045320b242d5514c455c32bc9c9f2d60d03d041 \
  -Dsonar.projectKey=sistema-venta-entradas-frontend \
  -Dsonar.sources=src \
  -Dsonar.tests=src \
  -Dsonar.test.inclusions=src/**/*.spec.ts \
  -Dsonar.exclusions=src/**/*.spec.ts,node_modules/**,.angular/**,dist/** \
  -Dsonar.coverage.exclusions=src/**/*.spec.ts,src/main.ts,src/environments/** \
  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
```

## Backend (Go)
```bash
# Generate coverage profile
go test -coverprofile=coverage.out ./...

# Run SonarQube Scanner
sonar-scanner \
  -Dsonar.projectKey=sistema-ventas-entradas-backend \
  -Dsonar.sources=. \
  -Dsonar.tests=. \
  -Dsonar.test.inclusions=**/*_test.go \
  -Dsonar.exclusions=**/*_test.go \
  -Dsonar.coverage.exclusions=**/*_test.go \
  -Dsonar.go.coverage.reportPaths=coverage.out \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_73620ff9041443df7f2180229f5bdde8200ebefa
```