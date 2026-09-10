// gen_fixtures generates tests/load/fixtures/seed_tokens.json
// querying public_tokens from the real NeonDB instance.
//
// Usage:
//   DATABASE_URL=<neondb_dsn> go run tests/load/gen_fixtures/main.go
//   DATABASE_URL=<neondb_dsn> go run tests/load/gen_fixtures/main.go -limit 500 -status VENDIDO
package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "github.com/lib/pq"
)

type TicketFixture struct {
	PublicToken   string `json:"public_token"`
	FourDigitCode string `json:"four_digit_code"`
	TicketType    string `json:"ticket_type"`
	Status        string `json:"status"`
}

func main() {
	limit := flag.Int("limit", 300, "Number of tickets to fetch")
	status := flag.String("status", "VENDIDO", "Ticket status filter (VENDIDO, USADO_ENTRADA, etc.)")
	outPath := flag.String("out", "fixtures/seed_tokens.json", "Output file path (relative to gen_fixtures dir)")
	flag.Parse()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("sql.Open: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("db.Ping: %v", err)
	}

	rows, err := db.Query(`
		SELECT public_token, four_digit_code, ticket_type, status
		FROM tickets
		WHERE status = $1
		ORDER BY created_at DESC
		LIMIT $2
	`, *status, *limit)
	if err != nil {
		log.Fatalf("query: %v", err)
	}
	defer rows.Close()

	var fixtures []TicketFixture
	for rows.Next() {
		var f TicketFixture
		if err := rows.Scan(&f.PublicToken, &f.FourDigitCode, &f.TicketType, &f.Status); err != nil {
			log.Fatalf("scan: %v", err)
		}
		fixtures = append(fixtures, f)
	}
	if err := rows.Err(); err != nil {
		log.Fatalf("rows.Err: %v", err)
	}
	_ = rows.Close()

	if len(fixtures) == 0 {
		log.Printf("No tickets found with status=%s, falling back to all available tickets...", *status)
		fallbackRows, err := db.Query(`
			SELECT public_token, four_digit_code, ticket_type, status
			FROM tickets
			ORDER BY created_at DESC
			LIMIT $1
		`, *limit)
		if err == nil {
			for fallbackRows.Next() {
				var f TicketFixture
				if err := fallbackRows.Scan(&f.PublicToken, &f.FourDigitCode, &f.TicketType, &f.Status); err == nil {
					fixtures = append(fixtures, f)
				}
			}
			if err := fallbackRows.Err(); err != nil {
				log.Fatalf("fallbackRows.Err: %v", err)
			}
			_ = fallbackRows.Close()
		}
	}

	if len(fixtures) == 0 {
		log.Fatalf("no tickets found in database, create some tickets first")
	}

	// Resolve output path relative to project root (tests/load/fixtures/)
	absOut := filepath.Join("..", *outPath)
	if err := os.MkdirAll(filepath.Dir(absOut), 0755); err != nil {
		log.Fatalf("mkdirAll: %v", err)
	}

	f, err := os.Create(absOut)
	if err != nil {
		log.Fatalf("create file: %v", err)
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	if err := enc.Encode(fixtures); err != nil {
		log.Fatalf("json encode: %v", err)
	}

	fmt.Printf("✓ Generated %d fixtures → %s\n", len(fixtures), absOut)
}
