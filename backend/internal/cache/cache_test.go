package cache

import (
	"context"
	"testing"
	"time"
)

func TestMemoryCache(t *testing.T) {
	c := NewMemoryCache()
	ctx := context.Background()

	// 1. Set and Get
	c.Set(ctx, "key1", "val1", 1*time.Second)
	val, ok := c.Get(ctx, "key1")
	if !ok || val.(string) != "val1" {
		t.Fatalf("expected val1, got %v (ok=%v)", val, ok)
	}

	// 2. Expiration
	time.Sleep(1100 * time.Millisecond)
	_, ok = c.Get(ctx, "key1")
	if ok {
		t.Fatalf("expected key1 to be expired")
	}

	// 3. Delete
	c.Set(ctx, "key2", "val2", 5*time.Second)
	c.Delete(ctx, "key2")
	_, ok = c.Get(ctx, "key2")
	if ok {
		t.Fatalf("expected key2 to be deleted")
	}

	// 4. InvalidatePrefix
	c.Set(ctx, "tickets:all", "list1", 5*time.Second)
	c.Set(ctx, "tickets:seller:s1", "list2", 5*time.Second)
	c.Set(ctx, "prices:active", "prices1", 5*time.Second)

	c.InvalidatePrefix(ctx, "tickets:")

	_, ok = c.Get(ctx, "tickets:all")
	if ok {
		t.Fatalf("expected tickets:all to be invalidated")
	}
	_, ok = c.Get(ctx, "tickets:seller:s1")
	if ok {
		t.Fatalf("expected tickets:seller:s1 to be invalidated")
	}
	val, ok = c.Get(ctx, "prices:active")
	if !ok || val.(string) != "prices1" {
		t.Fatalf("expected prices:active to remain valid")
	}
}
