<template>
  <div class="app">
    <h1>Lesson 6: Advanced Composable Patterns</h1>
    <p class="subtitle">Mastering reusable composition</p>

    <!-- Pattern 1: useCounter (Stateless) -->
    <section class="demo-section">
      <h2>1. Stateless Composable</h2>
      <div class="demo-card">
        <h3>useCounter() - Independent State</h3>
        <div class="counters">
          <div class="counter-box">
            <h4>Counter A</h4>
            <p>Count: {{ counterA.count }}</p>
            <button @click="counterA.increment()" class="btn">+</button>
            <button @click="counterA.decrement()" class="btn">-</button>
          </div>
          <div class="counter-box">
            <h4>Counter B</h4>
            <p>Count: {{ counterB.count }}</p>
            <button @click="counterB.increment()" class="btn">+</button>
            <button @click="counterB.decrement()" class="btn">-</button>
          </div>
        </div>
        <p class="note">Each counter has independent state</p>
      </div>
    </section>

    <!-- Pattern 2: useGlobalState (Stateful/Singleton) -->
    <section class="demo-section">
      <h2>2. Stateful Composable (Singleton)</h2>
      <div class="demo-card">
        <h3>useGlobalState() - Shared State</h3>
        <div>
          <p>Theme: {{ globalState.theme }}</p>
          <button @click="toggleTheme" class="btn">Toggle Theme</button>
        </div>
        <p class="note">State is shared across all calls</p>
      </div>
    </section>

    <!-- Pattern 3: useAsyncData -->
    <section class="demo-section">
      <h2>3. Async Data Pattern</h2>
      <div class="demo-card">
        <h3>useAsyncData() - Async Loading</h3>
        <button @click="refresh" class="btn" :disabled="loading">
          {{ loading ? 'Loading...' : 'Fetch Data' }}
        </button>

        <div v-if="error" class="error">Error: {{ error.message }}</div>
        <div v-else-if="data" class="success">
          <pre>{{ JSON.stringify(data, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <!-- Pattern 4: useDebounce -->
    <section class="demo-section">
      <h2>4. Reactive Arguments</h2>
      <div class="demo-card">
        <h3>useDebounce() - Debounced Value</h3>
        <input v-model="searchTerm" placeholder="Type to search..." />
        <p>Immediate: {{ searchTerm }}</p>
        <p>Debounced (500ms): {{ debouncedSearch }}</p>
      </div>
    </section>

    <!-- Pattern 5: useEventBus -->
    <section class="demo-section">
      <h2>5. Event Bus Pattern</h2>
      <div class="demo-card">
        <h3>useEventBus() - Global Events</h3>
        <button @click="emitEvent" class="btn">Emit Event</button>
        <div class="events">
          <div v-for="(event, i) in events" :key="i" class="event-item">
            {{ event }}
          </div>
        </div>
      </div>
    </section>

    <!-- Pattern 6: useInterval -->
    <section class="demo-section">
      <h2>6. Resource Management</h2>
      <div class="demo-card">
        <h3>useInterval() - Auto Cleanup</h3>
        <p>Seconds: {{ seconds }}</p>
        <button @click="interval.start()" class="btn" :disabled="interval.isActive.value">Start</button>
        <button @click="interval.stop()" class="btn" :disabled="!interval.isActive.value">Stop</button>
        <p class="note">Interval auto-cleans on unmount</p>
      </div>
    </section>

    <!-- Pattern 7: useLocalStorage -->
    <section class="demo-section">
      <h2>7. Composable Composition</h2>
      <div class="demo-card">
        <h3>useLocalStorage() - Persisted State</h3>
        <input v-model="savedName" placeholder="Enter name..." />
        <p>Saved value: {{ savedName }}</p>
        <p class="note">Refresh page - value persists!</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCounter } from './composables/useCounter'
import { useGlobalState } from './composables/useGlobalState'
import { useAsyncData } from './composables/useAsyncData'
import { useDebounce } from './composables/useDebounce'
import { useEventBus } from './composables/useEventBus'
import { useInterval } from './composables/useInterval'
import { useLocalStorage } from './composables/useLocalStorage'

// Pattern 1: Stateless counters
const counterA = useCounter(0)
const counterB = useCounter(10)

// Pattern 2: Singleton state
const globalState = useGlobalState()
const toggleTheme = () => {
  globalState.theme.value = globalState.theme.value === 'light' ? 'dark' : 'light'
}

// Pattern 3: Async data
const fetchUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { id: 1, name: 'John Doe', email: 'john@example.com' }
}

const { data, error, loading, refresh } = useAsyncData(fetchUser)

// Pattern 4: Debounce
const searchTerm = ref('')
const debouncedSearch = useDebounce(searchTerm, 500)

// Pattern 5: Event bus
const bus = useEventBus()
const events = ref([])

bus.on('user:action', (message) => {
  events.value.unshift(message)
  if (events.value.length > 5) events.value.pop()
})

const emitEvent = () => {
  bus.emit('user:action', `Event at ${new Date().toLocaleTimeString()}`)
}

// Pattern 6: Interval
const seconds = ref(0)
const interval = useInterval(() => {
  seconds.value++
}, 1000)

// Pattern 7: Local storage
const savedName = useLocalStorage('username', '')
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 40px;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h2 {
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.demo-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.demo-card h3 {
  color: #2c3e50;
  margin-top: 0;
}

.counters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.counter-box {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
}

.counter-box h4 {
  margin-top: 0;
}

.counter-box p {
  font-size: 24px;
  font-weight: bold;
  margin: 15px 0;
}

.btn {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 5px;
  transition: all 0.3s;
}

.btn:hover:not(:disabled) {
  background: #2980b9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.note {
  color: #7f8c8d;
  font-style: italic;
  margin-top: 15px;
}

.error {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.success {
  background: #efe;
  border: 1px solid #cfc;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.success pre {
  margin: 0;
  overflow-x: auto;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  margin: 10px 0;
}

.events {
  margin-top: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
}

.event-item {
  padding: 8px;
  background: white;
  border-left: 4px solid #3498db;
  margin: 5px 0;
  border-radius: 4px;
}
</style>
