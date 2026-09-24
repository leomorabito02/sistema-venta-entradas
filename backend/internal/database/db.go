package database

import (
	"database/sql"
	"fmt"
	"os"
	"strconv"
	"time"

	_ "github.com/lib/pq"
)

// getEnvInt retrieves an integer from environment variables or returns defaultVal if missing/invalid.
func getEnvInt(key string, defaultVal int) int {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}
	val, err := strconv.Atoi(valStr)
	if err != nil || val <= 0 {
		return defaultVal
	}
	return val
}

// getEnvDuration retrieves a duration from environment variables or returns defaultVal if missing/invalid.
func getEnvDuration(key string, defaultVal time.Duration) time.Duration {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}
	d, err := time.ParseDuration(valStr)
	if err != nil || d <= 0 {
		return defaultVal
	}
	return d
}

// ConnectDB initializes a PostgreSQL database connection pool.
func ConnectDB(dsn string) (*sql.DB, error) {
	if dsn == "" {
		return nil, fmt.Errorf("database DSN is empty")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	maxOpen := getEnvInt("DB_MAX_OPEN_CONNS", 100)
	maxIdle := getEnvInt("DB_MAX_IDLE_CONNS", 50)
	maxLifetime := getEnvDuration("DB_CONN_MAX_LIFETIME", 5*time.Minute)
	maxIdleTime := getEnvDuration("DB_CONN_MAX_IDLE_TIME", 1*time.Minute)

	db.SetMaxOpenConns(maxOpen)
	db.SetMaxIdleConns(maxIdle)
	db.SetConnMaxLifetime(maxLifetime)
	db.SetConnMaxIdleTime(maxIdleTime)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}
