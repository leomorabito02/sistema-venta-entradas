# frontend:
pnpm dlx sonarqube-scanner -Dsonar.scanner.skipJreProvisioning=true -Dsonar.host.url=http://localhost:9000 -Dsonar.token=sqp_b045320b242d5514c455c32bc9c9f2d60d03d041 -Dsonar.projectKey=sistema-venta-entradas-frontend

# backend
go test -coverprofile=coverage.out ./...
sonar-scanner \
  -Dsonar.projectKey=sistema-ventas-entradas-backend \
  -Dsonar.sources=. \
  -Dsonar.tests=. \
  -Dsonar.test.inclusions=**/*_test.go \
  -Dsonar.exclusions=**/*_test.go \
  -Dsonar.go.coverage.reportPaths=coverage.out \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_73620ff9041443df7f2180229f5bdde8200ebefa