<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">🚫</div>
      <h1>Unauthorized Access</h1>
      <p class="error-message">
        You don't have permission to access this page.
      </p>
      <div v-if="user" class="user-info">
        <p>Current user: <strong>{{ user.name }}</strong></p>
        <p>Role: <strong>{{ user.role }}</strong></p>
        <p class="note">
          This page requires {{ requiredRole || 'admin' }} privileges.
        </p>
      </div>
      <div v-else class="user-info">
        <p class="note">
          Please log in with an account that has the required permissions.
        </p>
      </div>
      <div class="error-actions">
        <router-link to="/" class="btn">
          🏠 Go Home
        </router-link>
        <router-link v-if="!user" to="/login" class="btn">
          🔐 Login
        </router-link>
        <button v-else @click="handleLogout" class="btn btn-secondary">
          Logout & Login as Different User
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()

const user = computed(() => authService.getUser())
const requiredRole = 'admin' // Could be passed from route meta

function handleLogout() {
  authService.logout()
  router.push('/login')
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 2rem;
}

.error-container {
  text-align: center;
  background: white;
  border-radius: 12px;
  padding: 4rem 3rem;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.error-icon {
  font-size: 6rem;
  margin-bottom: 1rem;
}

h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.user-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.user-info p {
  margin: 0.5rem 0;
  color: #666;
}

.user-info strong {
  color: #2c3e50;
}

.note {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  font-style: italic;
  color: #999 !important;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .error-icon {
    font-size: 4rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>
