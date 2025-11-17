<template>
  <div id="app">
    <Navigation v-if="!isLoginPage" />
    <main class="main-content">
      <router-view />
    </main>
    <NotificationToast />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from './components/Navigation.vue'
import NotificationToast from './components/NotificationToast.vue'

const route = useRoute()
const isLoginPage = computed(() => route.name === 'login')
</script>

<style>
/* CSS Variables for theming */
:root {
  --primary-color: #3b82f6;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --card-bg: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --border-color: #e5e7eb;
}

[data-theme="dark"] {
  --primary-color: #60a5fa;
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --card-bg: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;
  --border-color: #4b5563;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.3s, color 0.3s;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

button {
  font-family: inherit;
}

a {
  color: var(--primary-color);
}
</style>
