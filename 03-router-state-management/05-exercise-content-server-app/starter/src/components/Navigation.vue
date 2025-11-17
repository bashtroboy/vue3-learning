<template>
  <nav class="navigation">
    <div class="nav-brand">
      <router-link to="/" class="brand-link">
        <h2>Content Server Explorer</h2>
      </router-link>
    </div>

    <div v-if="isAuthenticated" class="nav-content">
      <div class="nav-links">
        <router-link to="/" class="nav-link" active-class="active">
          Home
        </router-link>
        <router-link to="/search" class="nav-link" active-class="active">
          Search
        </router-link>
        <router-link to="/favorites" class="nav-link" active-class="active">
          Favorites ({{ favoriteCount }})
        </router-link>
        <router-link to="/settings" class="nav-link" active-class="active">
          Settings
        </router-link>
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
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useContentServerStore } from '@/stores/contentServer'
import { useFavoritesStore } from '@/stores/favorites'

const router = useRouter()
const authStore = useAuthStore()
const contentStore = useContentServerStore()
const favoritesStore = useFavoritesStore()

const { isAuthenticated, user } = storeToRefs(authStore)
const { favoriteCount } = storeToRefs(favoritesStore)

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
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.nav-brand h2 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: var(--bg-secondary);
}

.nav-link.active {
  background: var(--primary-color);
  color: white;
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

@media (max-width: 768px) {
  .navigation {
    padding: 1rem;
  }

  .nav-content {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-user {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
