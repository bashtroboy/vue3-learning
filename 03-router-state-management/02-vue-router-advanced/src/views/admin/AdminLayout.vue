<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-content">
        <h1>🎛️ Admin Dashboard</h1>
        <div class="user-info">
          <span class="user-name">{{ user?.name }}</span>
          <span class="user-role badge" :class="`badge-${user?.role}`">
            {{ user?.role }}
          </span>
          <button @click="handleLogout" class="btn btn-small btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="admin-container">
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/admin" class="nav-item" exact-active-class="active">
            📊 Dashboard
          </router-link>
          <router-link to="/admin/users" class="nav-item" active-class="active">
            👥 Users
          </router-link>
          <router-link to="/admin/settings" class="nav-item" active-class="active">
            ⚙️ Settings
          </router-link>
          <router-link to="/admin/reports" class="nav-item" active-class="active">
            📈 Reports
          </router-link>
        </nav>

        <div class="sidebar-footer">
          <router-link to="/" class="btn btn-small btn-secondary btn-full">
            ← Back to Home
          </router-link>
        </div>
      </aside>

      <main class="admin-main">
        <!-- Breadcrumbs -->
        <nav class="breadcrumb" aria-label="breadcrumb">
          <router-link to="/">Home</router-link>
          <span class="separator">/</span>
          <router-link to="/admin">Admin</router-link>
          <span v-if="currentRouteMeta?.breadcrumb" class="separator">/</span>
          <span v-if="currentRouteMeta?.breadcrumb" class="current">
            {{ currentRouteMeta.breadcrumb }}
          </span>
        </nav>

        <!-- Child routes render here -->
        <router-view v-slot="{ Component, route }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../../services/auth'

const route = useRoute()
const router = useRouter()

const user = computed(() => authService.getUser())
const currentRouteMeta = computed(() => route.meta)

function handleLogout() {
  authService.logout()
  router.push('/')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
  color: #2c3e50;
}

.user-role {
  text-transform: uppercase;
  font-size: 0.75rem;
}

.badge-admin {
  background-color: #dc3545;
}

.badge-user {
  background-color: #17a2b8;
}

.badge-moderator {
  background-color: #ffc107;
  color: #333;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  padding: 2rem;
  min-height: calc(100vh - 80px);
}

.admin-sidebar {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.nav-item {
  padding: 0.75rem 1rem;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item:hover {
  background-color: #f8f9fa;
  color: #2c3e50;
}

.nav-item.active {
  background-color: #42b983;
  color: white;
  font-weight: 500;
}

.sidebar-footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.btn-full {
  width: 100%;
}

.admin-main {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: #42b983;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: #999;
}

.current {
  color: #666;
  font-weight: 500;
}

/* Transition styles */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

@media (max-width: 1024px) {
  .admin-container {
    grid-template-columns: 200px 1fr;
  }
}

@media (max-width: 768px) {
  .admin-container {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    position: static;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
