<template>
  <div class="preferences-panel">
    <h3>Preferences</h3>

    <div class="preference-group">
      <label class="preference-label">Theme</label>
      <div class="preference-buttons">
        <button
          @click="preferencesStore.setTheme('light')"
          :class="{ active: theme === 'light' }"
          class="preference-btn"
        >
          ☀️ Light
        </button>
        <button
          @click="preferencesStore.setTheme('dark')"
          :class="{ active: theme === 'dark' }"
          class="preference-btn"
        >
          🌙 Dark
        </button>
      </div>
    </div>

    <div class="preference-group">
      <label class="preference-label">Items Per Page</label>
      <div class="preference-buttons">
        <button
          v-for="count in [10, 25, 50]"
          :key="count"
          @click="preferencesStore.setItemsPerPage(count)"
          :class="{ active: itemsPerPage === count }"
          class="preference-btn"
        >
          {{ count }}
        </button>
      </div>
    </div>

    <div class="preference-group">
      <label class="preference-label">Default View</label>
      <div class="preference-buttons">
        <button
          @click="preferencesStore.setDefaultView('list')"
          :class="{ active: defaultView === 'list' }"
          class="preference-btn"
        >
          📋 List
        </button>
        <button
          @click="preferencesStore.setDefaultView('grid')"
          :class="{ active: defaultView === 'grid' }"
          class="preference-btn"
        >
          ⊞ Grid
        </button>
      </div>
    </div>

    <div class="preference-group">
      <button @click="preferencesStore.resetPreferences()" class="reset-btn">
        Reset to Defaults
      </button>
    </div>

    <div class="preference-info">
      <p>Preferences are automatically saved to localStorage</p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()
const { theme, itemsPerPage, defaultView } = storeToRefs(preferencesStore)
</script>

<style scoped>
.preferences-panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.preferences-panel h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.preference-group {
  margin-bottom: 1.5rem;
}

.preference-group:last-of-type {
  margin-bottom: 1rem;
}

.preference-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.preference-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preference-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.preference-btn:hover {
  border-color: var(--primary-color);
}

.preference-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.reset-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.reset-btn:hover {
  border-color: #ef4444;
  background: #ef4444;
  color: white;
}

.preference-info {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
}

.preference-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>
