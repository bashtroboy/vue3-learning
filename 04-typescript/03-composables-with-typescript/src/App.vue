<script setup lang="ts">
import { ref } from 'vue'
import { useCounter } from './composables/useCounter'
import { useLocalStorage } from './composables/useLocalStorage'

interface Settings {
  theme: 'light' | 'dark'
  notifications: boolean
}

const { count, doubled, increment, decrement, reset } = useCounter(0)
const settings = useLocalStorage<Settings>('app-settings', {
  theme: 'light',
  notifications: true
})

const activeTab = ref<string>('counter')
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>🎣 Composables with TypeScript</h1>
      <p>Type-safe reusable logic</p>
    </header>

    <nav class="tabs">
      <button
        :class="['tab', { active: activeTab === 'counter' }]"
        @click="activeTab = 'counter'"
      >
        Counter
      </button>
      <button
        :class="['tab', { active: activeTab === 'storage' }]"
        @click="activeTab = 'storage'"
      >
        Local Storage
      </button>
    </nav>

    <main class="content">
      <div v-if="activeTab === 'counter'" class="demo">
        <h2>useCounter</h2>
        <div class="counter-display">
          <p>Count: <strong>{{ count }}</strong></p>
          <p>Doubled: <strong>{{ doubled }}</strong></p>
        </div>
        <div class="buttons">
          <button @click="decrement">-</button>
          <button @click="increment">+</button>
          <button @click="reset">Reset</button>
        </div>
        <div class="code-block">
          <pre><code>const { count, doubled, increment } = useCounter(0)</code></pre>
        </div>
      </div>

      <div v-if="activeTab === 'storage'" class="demo">
        <h2>useLocalStorage</h2>
        <div class="form-group">
          <label>Theme:</label>
          <select v-model="settings.theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="settings.notifications" />
            Enable Notifications
          </label>
        </div>
        <div class="info">
          Settings are automatically saved to localStorage!
        </div>
        <div class="code-block">
          <pre><code>const settings = useLocalStorage&lt;Settings&gt;('app-settings', {
  theme: 'light',
  notifications: true
})</code></pre>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app { max-width: 1200px; margin: 0 auto; }
.header { background: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.header h1 { color: #2c3e50; margin-bottom: 0.5rem; font-size: 2.5rem; }
.header p { color: #7f8c8d; font-size: 1.1rem; }
.tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
.tab { background: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 500; color: #7f8c8d; transition: all 0.3s; }
.tab.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.content { background: white; padding: 2rem; border-radius: 12px; min-height: 400px; }
.demo h2 { color: #2c3e50; margin-bottom: 1.5rem; }
.counter-display { background: #f8f9fa; padding: 2rem; border-radius: 8px; text-align: center; margin-bottom: 1rem; }
.counter-display p { font-size: 1.5rem; margin: 0.5rem 0; }
.counter-display strong { color: #667eea; }
.buttons { display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
.buttons button { padding: 1rem 2rem; font-size: 1.2rem; border: none; border-radius: 8px; background: #667eea; color: white; cursor: pointer; }
.form-group { margin: 1rem 0; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
.form-group select { padding: 0.5rem; border: 2px solid #e9ecef; border-radius: 4px; }
.info { background: #e7f3ff; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
.code-block { background: #f8f9fa; border-radius: 8px; padding: 1rem; margin-top: 2rem; }
.code-block pre { margin: 0; font-family: Monaco, monospace; font-size: 0.85rem; }
</style>
