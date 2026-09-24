package database

import (
	"os"
	"testing"
	"time"
)

func TestGetEnvInt(t *testing.T) {
	tests := []struct {
		name       string
		key        string
		envVal     string
		defaultVal int
		expected   int
	}{
		{
			name:       "returns default when env var is missing",
			key:        "TEST_INT_ENV_MISSING",
			envVal:     "",
			defaultVal: 50,
			expected:   50,
		},
		{
			name:       "returns parsed int when env var is valid",
			key:        "TEST_INT_ENV_VALID",
			envVal:     "120",
			defaultVal: 50,
			expected:   120,
		},
		{
			name:       "returns default when env var is non-numeric text",
			key:        "TEST_INT_ENV_INVALID",
			envVal:     "abc",
			defaultVal: 50,
			expected:   50,
		},
		{
			name:       "returns default when env var is negative or zero",
			key:        "TEST_INT_ENV_NEGATIVE",
			envVal:     "-10",
			defaultVal: 50,
			expected:   50,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.envVal != "" {
				os.Setenv(tt.key, tt.envVal)
				defer os.Unsetenv(tt.key)
			} else {
				os.Unsetenv(tt.key)
			}

			res := getEnvInt(tt.key, tt.defaultVal)
			if res != tt.expected {
				t.Errorf("expected %d, got %d", tt.expected, res)
			}
		})
	}
}

func TestGetEnvDuration(t *testing.T) {
	tests := []struct {
		name       string
		key        string
		envVal     string
		defaultVal time.Duration
		expected   time.Duration
	}{
		{
			name:       "returns default when env var is missing",
			key:        "TEST_DUR_ENV_MISSING",
			envVal:     "",
			defaultVal: 5 * time.Minute,
			expected:   5 * time.Minute,
		},
		{
			name:       "returns parsed duration when env var is valid",
			key:        "TEST_DUR_ENV_VALID",
			envVal:     "10m",
			defaultVal: 5 * time.Minute,
			expected:   10 * time.Minute,
		},
		{
			name:       "returns default when env var is invalid format",
			key:        "TEST_DUR_ENV_INVALID",
			envVal:     "invalid_duration",
			defaultVal: 5 * time.Minute,
			expected:   5 * time.Minute,
		},
		{
			name:       "returns default when duration is zero or negative",
			key:        "TEST_DUR_ENV_NEGATIVE",
			envVal:     "-5m",
			defaultVal: 5 * time.Minute,
			expected:   5 * time.Minute,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.envVal != "" {
				os.Setenv(tt.key, tt.envVal)
				defer os.Unsetenv(tt.key)
			} else {
				os.Unsetenv(tt.key)
			}

			res := getEnvDuration(tt.key, tt.defaultVal)
			if res != tt.expected {
				t.Errorf("expected %v, got %v", tt.expected, res)
			}
		})
	}
}

func TestConnectDB_EmptyDSN(t *testing.T) {
	db, err := ConnectDB("")
	if err == nil {
		t.Fatal("expected error for empty DSN, got nil")
	}
	if db != nil {
		t.Fatalf("expected db to be nil on error, got %v", db)
	}
}

func TestConnectDB_InvalidDSN(t *testing.T) {
	db, err := ConnectDB("host=localhost port=54329 dbname=nonexistent connect_timeout=1 sslmode=disable")
	if err == nil {
		t.Fatal("expected error for invalid DSN connection ping, got nil")
	}
	if db != nil {
		_ = db.Close()
	}
}
