// setup_api — Creates test tickets via HTTP API in parallel and writes seed_tokens.json.
//
// Usage:
//
//	BASE_URL=http://localhost:8080 JWT_TOKEN=<token> go run main.go
//	BASE_URL=http://localhost:8080 JWT_TOKEN=<token> go run main.go -count 100 -workers 20
//
// Writes:
//
//	../fixtures/seed_tokens.json
//
// Prints to stdout:
//
//	FOOD_TOKEN_OUTPUT:<token>   (if a CON_COMIDA ticket was validated as ENTRADA)
package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type createTicketReq struct {
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Phone      string `json:"phone"`
	Email      string `json:"email"`
	TicketType string `json:"ticket_type"`
	SaleSource string `json:"sale_source"`
}

type ticketResponse struct {
	PublicToken   string `json:"public_token"`
	FourDigitCode string `json:"four_digit_code"`
	TicketType    string `json:"ticket_type"`
	Status        string `json:"status"`
}

type apiResponse struct {
	Success bool           `json:"success"`
	Message string         `json:"message"`
	Data    ticketResponse `json:"data"`
}

type validateReq struct {
	PublicToken    string `json:"public_token"`
	ValidationType string `json:"validation_type"`
}

type fixture struct {
	PublicToken   string `json:"public_token"`
	FourDigitCode string `json:"four_digit_code"`
	TicketType    string `json:"ticket_type"`
	Status        string `json:"status"`
}

func main() {
	count := flag.Int("count", 50, "Number of tickets to create")
	workers := flag.Int("workers", 10, "Number of concurrent workers")
	outPath := flag.String("out", "../fixtures/seed_tokens.json", "Output path (relative to this file)")
	flag.Parse()

	baseURL := os.Getenv("BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}
	jwtToken := os.Getenv("JWT_TOKEN")
	if jwtToken == "" {
		log.Fatal("JWT_TOKEN environment variable is required")
	}

	client := &http.Client{Timeout: 15 * time.Second}

	// Channel of ticket indices to create.
	jobs := make(chan int, *count)
	for i := 0; i < *count; i++ {
		jobs <- i
	}
	close(jobs)

	var mu sync.Mutex
	var fixtures []fixture

	var wg sync.WaitGroup
	wg.Add(*workers)
	for w := 0; w < *workers; w++ {
		go func() {
			defer wg.Done()
			for i := range jobs {
				ticketType := "SIMPLE"
				if i%3 == 0 {
					ticketType = "CON_COMIDA"
				}
				f, err := createTicket(client, baseURL, jwtToken, i, ticketType)
				if err != nil {
					log.Printf("worker: failed ticket %d: %v", i, err)
					continue
				}
				mu.Lock()
				fixtures = append(fixtures, *f)
				mu.Unlock()
			}
		}()
	}
	wg.Wait()

	if len(fixtures) == 0 {
		log.Fatal("No tickets were created. Check JWT permissions and quota.")
	}
	log.Printf("Created %d tickets", len(fixtures))

	// Validate one CON_COMIDA ticket as ENTRADA to obtain the FOOD_TOKEN.
	var foodToken string
	for i := range fixtures {
		if fixtures[i].TicketType == "CON_COMIDA" && fixtures[i].Status == "VENDIDO" {
			err := validateEntrada(client, baseURL, jwtToken, fixtures[i].PublicToken)
			if err == nil {
				foodToken = fixtures[i].PublicToken
				fixtures[i].Status = "USADO_ENTRADA"
				log.Printf("FOOD_TOKEN obtained: %s", foodToken)
				break
			}
			log.Printf("Could not validate CON_COMIDA ticket as ENTRADA: %v", err)
		}
	}

	// Write seed_tokens.json.
	absOut := *outPath
	if err := os.MkdirAll(filepath.Dir(absOut), 0755); err != nil {
		log.Fatalf("mkdirAll: %v", err)
	}
	f, err := os.Create(absOut)
	if err != nil {
		log.Fatalf("create %s: %v", absOut, err)
	}
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	if err := enc.Encode(fixtures); err != nil {
		f.Close()
		log.Fatalf("json encode: %v", err)
	}
	f.Close()
	log.Printf("Wrote %s", absOut)

	// Print FOOD_TOKEN for the orchestrator to capture.
	if foodToken != "" {
		fmt.Printf("FOOD_TOKEN_OUTPUT:%s\n", foodToken)
	}
}

// createTicket calls POST /api/tickets and returns the created fixture.
func createTicket(client *http.Client, baseURL, jwt string, idx int, ticketType string) (*fixture, error) {
	body, _ := json.Marshal(createTicketReq{
		FirstName:  "LoadTest",
		LastName:   fmt.Sprintf("User%d", idx),
		Phone:      fmt.Sprintf("09%08d", idx),
		Email:      fmt.Sprintf("load.test.%d.%d@test.local", idx, time.Now().UnixMilli()),
		TicketType: ticketType,
		SaleSource: "PUERTA",
	})

	req, err := http.NewRequest(http.MethodPost, baseURL+"/api/tickets", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+jwt)
	req.Header.Set("X-Requested-With", "XMLHttpRequest")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusConflict || resp.StatusCode == http.StatusBadRequest {
		return nil, fmt.Errorf("quota/validation issue: HTTP %d", resp.StatusCode)
	}
	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: HTTP %d", resp.StatusCode)
	}

	var apiResp apiResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode response: %v", err)
	}

	return &fixture{
		PublicToken:   apiResp.Data.PublicToken,
		FourDigitCode: apiResp.Data.FourDigitCode,
		TicketType:    apiResp.Data.TicketType,
		Status:        "VENDIDO",
	}, nil
}

// validateEntrada calls POST /api/tickets/validate with validation_type=ENTRADA.
func validateEntrada(client *http.Client, baseURL, jwt, publicToken string) error {
	body, _ := json.Marshal(validateReq{
		PublicToken:    publicToken,
		ValidationType: "ENTRADA",
	})

	req, err := http.NewRequest(http.MethodPost, baseURL+"/api/tickets/validate", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+jwt)
	req.Header.Set("X-Requested-With", "XMLHttpRequest")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("validate ENTRADA returned HTTP %d", resp.StatusCode)
	}
	return nil
}
