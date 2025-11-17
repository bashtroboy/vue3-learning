<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p class="error-message">
        The page <code>{{ currentPath }}</code> does not exist.
      </p>
      <div class="error-actions">
        <router-link to="/" class="btn">
          🏠 Go Home
        </router-link>
        <button @click="goBack" class="btn btn-secondary">
          ← Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.fullPath)

function goBack() {
  router.back()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
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

code {
  background: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  color: #e74c3c;
  font-family: 'Courier New', monospace;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>
