package security

import (
	"os"
	"testing"
)

func FuzzValidateAccessToken(f *testing.F) {
	// Set the environment variable required by getJWTSecret() so it doesn't panic
	os.Setenv("JWT_SECRET", "super-secret-fuzz-key")
	defer os.Unsetenv("JWT_SECRET")

	// Seed corpus with some typical and atypical inputs
	f.Add("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.signature") // valid base64 but bad sig
	f.Add("invalid_token")
	f.Add("a.b.c")
	f.Add("")

	f.Fuzz(func(t *testing.T, token string) {
		// The goal of this Fuzz test is to ensure that ValidateAccessToken
		// never panics or crashes, regardless of how malformed the input is.
		_, _ = ValidateAccessToken(token)
	})
}
