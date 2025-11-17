<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div class="actions">
        <router-link to="/" class="action-btn primary">
          Go to Home
        </router-link>
        <button @click="goBack" class="action-btn">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.not-found-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
}

h2 {
  margin: 1rem 0;
  color: var(--text-primary);
  font-size: 2rem;
}

p {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 1rem;
  font-weight: 500;
}

.action-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.action-btn.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}
</style>
