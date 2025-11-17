<template>
  <nav class="navigation">
    <div class="nav-brand">
      <h2>Content Server</h2>
      <span class="badge">Advanced Pinia</span>
    </div>

    <div v-if="isAuthenticated" class="nav-content">
      <div class="nav-stats">
        <div class="stat">
          <span class="stat-label">Nodes:</span>
          <span class="stat-value">{{ nodeCount }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Favorites:</span>
          <span class="stat-value">{{ favoriteCount }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Cache:</span>
          <span class="stat-value">{{ cacheStats.valid }}/{{ cacheStats.total }}</span>
        </div>
      </div>

      <div class="nav-user">
        <span class="user-name">👤 {{ user?.username }}</span>
        <button @click="handleLogout" class="logout-btn">
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useContentServerStore } from '@/stores/contentServer'
import { useFavoritesStore } from '@/stores/favorites'
import { useCacheStore } from '@/stores/cache'

const router = useRouter()
const authStore = useAuthStore()
const contentStore = useContentServerStore()
const favoritesStore = useFavoritesStore()
const cacheStore = useCacheStore()

const { isAuthenticated, user } = storeToRefs(authStore)
const { nodeCount } = storeToRefs(contentStore)
const { favoriteCount } = storeToRefs(favoritesStore)

const cacheStats = computed(() => cacheStore.getStats())

function handleLogout() {
  authStore.logout()
  contentStore.clearCache()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.navigation {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-brand h2 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.badge {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.nav-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.stat-label {
  color: var(--text-muted);
}

.stat-value {
  color: var(--text-primary);
  font-weight: 600;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: var(--text-primary);
  font-weight: 500;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}
</style>
