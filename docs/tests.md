# Unit Tests

## Frontend

```bash
cd frontend
pnpm test
```

```bash
cd frontend
pnpm run test:ci
```

## Backend

```bash
cd backend
go test ./...
```

```bash
cd backend
go test -coverprofile=coverage.out ./...
```
