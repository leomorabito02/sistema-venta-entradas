package cache

import (
	"context"
	"strings"
	"sync"
	"time"
)

// CacheService defines the high-concurrency caching interface for read-heavy operations.
type CacheService interface {
	Get(ctx context.Context, key string) (interface{}, bool)
	Set(ctx context.Context, key string, value interface{}, ttl time.Duration)
	Delete(ctx context.Context, key string)
	InvalidatePrefix(ctx context.Context, prefix string)
}

type cacheItem struct {
	value     interface{}
	expiresAt time.Time
}

type memoryCache struct {
	mu    sync.RWMutex
	items map[string]cacheItem
}

// NewMemoryCache instantiates a thread-safe, in-memory TTL cache with automatic background cleanup.
func NewMemoryCache() CacheService {
	c := &memoryCache{
		items: make(map[string]cacheItem),
	}

	go func() {
		ticker := time.NewTicker(30 * time.Second)
		for range ticker.C {
			c.mu.Lock()
			now := time.Now()
			for k, item := range c.items {
				if now.After(item.expiresAt) {
					delete(c.items, k)
				}
			}
			c.mu.Unlock()
		}
	}()

	return c
}

func (c *memoryCache) Get(ctx context.Context, key string) (interface{}, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, found := c.items[key]
	if !found {
		return nil, false
	}
	if time.Now().After(item.expiresAt) {
		return nil, false
	}
	return item.value, true
}

func (c *memoryCache) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.items[key] = cacheItem{
		value:     value,
		expiresAt: time.Now().Add(ttl),
	}
}

func (c *memoryCache) Delete(ctx context.Context, key string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.items, key)
}

func (c *memoryCache) InvalidatePrefix(ctx context.Context, prefix string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	for k := range c.items {
		if strings.HasPrefix(k, prefix) {
			delete(c.items, k)
		}
	}
}
