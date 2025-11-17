<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>📦 Typed Content Server</h1>
      <nav>
        <button @click="router.push({ name: 'home' })">Home</button>
        <button @click="router.push({ name: 'nodes' })">Nodes</button>
      </nav>
    </header>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app { max-width: 1200px; margin: 0 auto; padding: 20px; }
.header { background: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; text-align: center; }
.header h1 { color: #2c3e50; margin-bottom: 1rem; }
.header nav { display: flex; gap: 0.5rem; justify-content: center; }
.header button { padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
.content { background: white; padding: 2rem; border-radius: 12px; min-height: 400px; }
</style>
