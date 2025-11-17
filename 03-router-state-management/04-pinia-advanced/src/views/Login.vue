<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>Content Server</h1>
        <p>Advanced Pinia Demo</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter username"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            required
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <div class="hint">
          <p><strong>Demo credentials:</strong></p>
          <p>Username: <code>demo</code></p>
          <p>Password: <code>demo</code></p>
        </div>
      </form>

      <div class="features">
        <h3>This demo showcases:</h3>
        <ul>
          <li>✅ Store composition (multiple stores working together)</li>
          <li>✅ Pinia plugins (persistence & logging)</li>
          <li>✅ Advanced caching with TTL</li>
          <li>✅ Optimistic updates with rollback</li>
          <li>✅ Request deduplication</li>
          <li>✅ Authentication guards</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const { loading, error } = storeToRefs(authStore)

const username = ref('demo')
const password = ref('demo')

async function handleLogin() {
  try {
    await authStore.login(username.value, password.value)

    // Redirect to intended page or home
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    // Error is already set in the store
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 2rem;
}

.login-header p {
  margin: 0;
  color: var(--text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.login-btn {
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #2563eb;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hint {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 6px;
  font-size: 0.85rem;
}

.hint p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
}

.hint code {
  background: var(--card-bg);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-family: monospace;
  color: var(--primary-color);
}

.features {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.features h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.features ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.features li {
  margin: 0.5rem 0;
}
</style>
