<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h1>Login</h1>
        <p class="subtitle">Enter your credentials to access the admin dashboard</p>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              placeholder="Enter username"
              required
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Enter password"
              required
              autocomplete="current-password"
            />
          </div>

          <button
            type="submit"
            class="btn btn-full"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="demo-info">
          <h3>Demo Credentials:</h3>
          <ul>
            <li><strong>Admin:</strong> admin / admin123</li>
            <li><strong>User:</strong> user / user123</li>
          </ul>
        </div>

        <div class="back-link">
          <router-link to="/">← Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/auth'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await authService.login(username.value, password.value)

    // Redirect to intended page or admin dashboard
    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-card h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.btn-full {
  width: 100%;
  margin-top: 1rem;
}

.demo-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.demo-info h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.demo-info ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

.demo-info li {
  margin: 0.5rem 0;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link a {
  color: #667eea;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
