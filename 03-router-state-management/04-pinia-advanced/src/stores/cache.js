import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Cache Store with TTL (Time To Live)
 *
 * Provides a centralized caching mechanism with automatic expiration
 */
export const useCacheStore = defineStore('cache', () => {
  // Use Map for better performance with frequent lookups
  const cache = ref(new Map())

  /**
   * Set a value in the cache with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
   */
  function set(key, value, ttl = 5 * 60 * 1000) {
    cache.value.set(key, {
      value,
      expires: Date.now() + ttl
    })
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if expired/not found
   */
  function get(key) {
    const item = cache.value.get(key)

    if (!item) return null

    // Check if expired
    if (Date.now() > item.expires) {
      cache.value.delete(key)
      return null
    }

    return item.value
  }

  /**
   * Check if a key exists in cache and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  function has(key) {
    return get(key) !== null
  }

  /**
   * Delete a specific key from cache
   * @param {string} key - Cache key
   */
  function remove(key) {
    cache.value.delete(key)
  }

  /**
   * Clear all cached items
   */
  function clear() {
    cache.value.clear()
  }

  /**
   * Remove all expired items from cache
   */
  function clearExpired() {
    const now = Date.now()
    for (const [key, item] of cache.value.entries()) {
      if (now > item.expires) {
        cache.value.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  function getStats() {
    const now = Date.now()
    let validCount = 0
    let expiredCount = 0

    for (const [, item] of cache.value.entries()) {
      if (now > item.expires) {
        expiredCount++
      } else {
        validCount++
      }
    }

    return {
      total: cache.value.size,
      valid: validCount,
      expired: expiredCount
    }
  }

  // Auto-cleanup expired items every minute
  const cleanupInterval = setInterval(clearExpired, 60 * 1000)

  // Cleanup on store destruction
  function $dispose() {
    clearInterval(cleanupInterval)
  }

  return {
    set,
    get,
    has,
    remove,
    clear,
    clearExpired,
    getStats,
    $dispose
  }
})
