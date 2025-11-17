<template>
  <div class="settings-page">
    <h1>Settings</h1>

    <div class="settings-container">
      <div class="settings-section">
        <h2>Appearance</h2>
        <div class="setting-group">
          <label class="setting-label">Theme</label>
          <div class="setting-buttons">
            <button
              @click="preferencesStore.setTheme('light')"
              :class="{ active: theme === 'light' }"
              class="setting-btn"
            >
              ☀️ Light
            </button>
            <button
              @click="preferencesStore.setTheme('dark')"
              :class="{ active: theme === 'dark' }"
              class="setting-btn"
            >
              🌙 Dark
            </button>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">Default View</label>
          <div class="setting-buttons">
            <button
              @click="preferencesStore.setDefaultView('list')"
              :class="{ active: defaultView === 'list' }"
              class="setting-btn"
            >
              📋 List
            </button>
            <button
              @click="preferencesStore.setDefaultView('grid')"
              :class="{ active: defaultView === 'grid' }"
              class="setting-btn"
            >
              ⊞ Grid
            </button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>Display</h2>
        <div class="setting-group">
          <label class="setting-label">Items Per Page</label>
          <div class="setting-buttons">
            <button
              v-for="count in [10, 25, 50, 100]"
              :key="count"
              @click="preferencesStore.setItemsPerPage(count)"
              :class="{ active: itemsPerPage === count }"
              class="setting-btn"
            >
              {{ count }}
            </button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>Cache</h2>
        <div class="setting-group">
          <label class="setting-label">Cache Statistics</label>
          <div class="cache-stats">
            <div class="stat">
              <span>Total Items:</span>
              <strong>{{ cacheStats.total }}</strong>
            </div>
            <div class="stat">
              <span>Valid:</span>
              <strong>{{ cacheStats.valid }}</strong>
            </div>
            <div class="stat">
              <span>Expired:</span>
              <strong>{{ cacheStats.expired }}</strong>
            </div>
          </div>
          <button @click="handleClearCache" class="danger-btn">
            Clear Cache
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h2>Data</h2>
        <div class="setting-group">
          <label class="setting-label">Favorites</label>
          <p class="setting-description">
            You have {{ favoriteCount }} favorite{{ favoriteCount !== 1 ? 's' : '' }}
          </p>
          <button @click="handleClearFavorites" class="danger-btn">
            Clear All Favorites
          </button>
        </div>

        <div class="setting-group">
          <label class="setting-label">Reset All Settings</label>
          <p class="setting-description">
            Reset all preferences to their default values
          </p>
          <button @click="handleResetPreferences" class="danger-btn">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/preferences'
import { useFavoritesStore } from '@/stores/favorites'
import { useContentServerStore } from '@/stores/contentServer'
import { useCacheStore } from '@/stores/cache'
import { useUIStore } from '@/stores/ui'

const preferencesStore = usePreferencesStore()
const favoritesStore = useFavoritesStore()
const contentStore = useContentServerStore()
const cacheStore = useCacheStore()
const uiStore = useUIStore()

const { theme, itemsPerPage, defaultView } = storeToRefs(preferencesStore)
const { favoriteCount } = storeToRefs(favoritesStore)

const cacheStats = computed(() => cacheStore.getStats())

function handleClearCache() {
  if (confirm('Are you sure you want to clear the cache?')) {
    contentStore.clearCache()
    cacheStore.clear()
    uiStore.showNotification('Cache cleared', 'success')
  }
}

function handleClearFavorites() {
  if (confirm('Are you sure you want to clear all favorites?')) {
    favoritesStore.clearFavorites()
    uiStore.showNotification('Favorites cleared', 'success')
  }
}

function handleResetPreferences() {
  if (confirm('Are you sure you want to reset all preferences to defaults?')) {
    preferencesStore.resetPreferences()
    uiStore.showNotification('Preferences reset to defaults', 'success')
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin: 0 0 2rem 0;
  color: var(--text-primary);
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.settings-section h2 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.setting-group {
  margin-bottom: 1.5rem;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
}

.setting-description {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.setting-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.setting-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.setting-btn:hover {
  border-color: var(--primary-color);
}

.setting-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.cache-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 6px;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.stat span {
  color: var(--text-secondary);
}

.stat strong {
  color: var(--primary-color);
}

.danger-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ef4444;
  background: transparent;
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-btn:hover {
  background: #ef4444;
  color: white;
}
</style>
