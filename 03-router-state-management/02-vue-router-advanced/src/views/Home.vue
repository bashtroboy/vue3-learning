<template>
  <div class="home">
    <nav class="navbar">
      <div class="container">
        <div class="nav-brand">
          <h2>🎛️ Admin Dashboard Demo</h2>
        </div>
        <div class="nav-links">
          <router-link v-if="!isAuthenticated" to="/login" class="btn">
            Login
          </router-link>
          <template v-else>
            <router-link to="/admin" class="btn">
              Admin Dashboard
            </router-link>
            <button @click="handleLogout" class="btn btn-secondary">
              Logout
            </button>
          </template>
        </div>
      </div>
    </nav>

    <main class="container">
      <div class="hero">
        <h1>Vue Router Advanced Demo</h1>
        <p class="subtitle">
          Explore advanced routing features including nested routes, guards, lazy loading, and more
        </p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <h3>🔐 Authentication Guards</h3>
          <p>
            Global and per-route guards protect sensitive routes and redirect
            unauthorized users.
          </p>
        </div>

        <div class="feature-card">
          <h3>🏗️ Nested Routes</h3>
          <p>
            Admin section uses nested routes for complex layouts with shared
            navigation.
          </p>
        </div>

        <div class="feature-card">
          <h3>⚡ Lazy Loading</h3>
          <p>
            Admin components are lazy-loaded for better initial page load
            performance.
          </p>
        </div>

        <div class="feature-card">
          <h3>🎨 Route Transitions</h3>
          <p>
            Smooth fade transitions between routes for better user experience.
          </p>
        </div>

        <div class="feature-card">
          <h3>📋 Route Meta Fields</h3>
          <p>
            Meta fields store authentication, permission, and title
            information.
          </p>
        </div>

        <div class="feature-card">
          <h3>🚫 404 Handling</h3>
          <p>
            Catch-all route handles invalid URLs with a custom 404 page.
          </p>
        </div>
      </div>

      <div class="demo-credentials">
        <h2>Demo Credentials</h2>
        <div class="credentials-grid">
          <div class="credential-card">
            <h4>Admin User</h4>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
            <p class="note">Full access to all admin features</p>
          </div>
          <div class="credential-card">
            <h4>Regular User</h4>
            <p><strong>Username:</strong> user</p>
            <p><strong>Password:</strong> user123</p>
            <p class="note">Limited access (only reports)</p>
          </div>
        </div>
      </div>

      <div class="cta">
        <router-link v-if="!isAuthenticated" to="/login" class="btn btn-large">
          Try the Demo →
        </router-link>
        <router-link v-else to="/admin" class="btn btn-large">
          Go to Dashboard →
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()

const isAuthenticated = computed(() => authService.isAuthenticated())

function handleLogout() {
  authService.logout()
  router.push('/')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.navbar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  color: white;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.demo-credentials {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin: 3rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-credentials h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.credentials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.credential-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #42b983;
}

.credential-card h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.credential-card p {
  margin: 0.5rem 0;
  color: #666;
}

.credential-card .note {
  margin-top: 1rem;
  font-size: 0.9rem;
  font-style: italic;
  color: #999;
}

.cta {
  text-align: center;
  margin: 3rem 0;
}

.btn-large {
  padding: 1rem 3rem;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
