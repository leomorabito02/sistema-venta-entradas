# Build stage
FROM golang:1.24-alpine AS builder

ENV GOTOOLCHAIN=auto

WORKDIR /app

# Copy dependency definitions
COPY go.mod ./
RUN go mod download

# Copy source code
COPY . .

# Build statically compiled binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/bin/server ./cmd/server

# Final runtime stage
FROM alpine:3.21

RUN apk --no-cache add ca-certificates tzdata && \
    adduser -D -u 10001 appuser

USER appuser

WORKDIR /app

COPY --from=builder /app/bin/server /app/server

EXPOSE 8080

ENTRYPOINT ["/app/server"]
