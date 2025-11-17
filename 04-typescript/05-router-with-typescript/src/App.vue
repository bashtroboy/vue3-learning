<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Type-safe navigation
const goTo = (name: string) => {
  router.push({ name })
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>🧭 Router with TypeScript</h1>
      <nav class="nav">
        <button @click="goTo('home')">Home</button>
        <button @click="goTo('nodes')">Nodes</button>
      </nav>
    </header>

    <main class="content">
      <div class="route-info">
        <strong>Current Route:</strong> {{ route.name }}
        <span v-if="route.meta.title"> - {{ route.meta.title }}</span>
      </div>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app { max-width: 1200px; margin: 0 auto; }
.header { background: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem; }
.header h1 { color: #2c3e50; font-size: 2.5rem; margin-bottom: 1rem; }
.nav { display: flex; gap: 0.5rem; justify-content: center; }
.nav button { padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
.content { background: white; padding: 2rem; border-radius: 12px; }
.route-info { padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 1rem; }
</style>
