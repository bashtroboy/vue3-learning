<template>
  <div class="app" :class="{ dark: theme.mode === 'dark' }">
    <header class="header">
      <h1>🔌 Provide/Inject - Dependency Injection</h1>
      <p>Pass data through component tree without prop drilling</p>
    </header>

    <div class="container">
      <!-- Example 1: Theme Provider -->
      <section class="card">
        <h2>1. Theme System with Provide/Inject</h2>
        <p class="description">
          Theme is provided at the root level and injected by any descendant component,
          no matter how deep in the tree.
        </p>

        <div class="theme-controls">
          <button @click="toggleTheme" class="theme-btn">
            {{ theme.mode === 'light' ? '🌙 Switch to Dark' : '☀️ Switch to Light' }}
          </button>
          <div class="theme-info">
            <strong>Current Theme:</strong> {{ theme.mode }}
            <br />
            <strong>Primary Color:</strong> {{ theme.colors.primary }}
          </div>
        </div>

        <ThemedCard title="Themed Card Component">
          <p>This card automatically receives theme via inject.</p>
          <p>No props needed - theme is injected from ancestor!</p>

          <ThemedButton @click="showMessage">
            Themed Button
          </ThemedButton>
        </ThemedCard>
      </section>

      <!-- Example 2: User Context -->
      <section class="card">
        <h2>2. User Context Provider</h2>
        <p class="description">
          User data provided at app level, accessible anywhere in the component tree.
        </p>

        <div class="user-controls">
          <button @click="login" v-if="!user.isAuthenticated" class="login-btn">
            🔐 Login
          </button>
          <button @click="logout" v-else class="logout-btn">
            🚪 Logout
          </button>
        </div>

        <UserProfile />

        <div class="nested-example">
          <h3>Deeply Nested Component</h3>
          <DeeplyNestedComponent />
        </div>
      </section>

      <!-- Example 3: Configuration -->
      <section class="card">
        <h2>3. App Configuration</h2>
        <p class="description">
          Global configuration object provided at root level.
        </p>

        <ConfigDisplay />

        <div class="config-controls">
          <label>
            <input
              type="checkbox"
              v-model="config.features.notifications"
            />
            Enable Notifications
          </label>
          <label>
            <input
              type="checkbox"
              v-model="config.features.analytics"
            />
            Enable Analytics
          </label>
          <label>
            API Endpoint:
            <input
              type="text"
              v-model="config.apiUrl"
              class="text-input"
            />
          </label>
        </div>
      </section>

      <!-- Example 4: Symbols for Type Safety -->
      <section class="card">
        <h2>4. Symbol Keys for Type Safety</h2>
        <p class="description">
          Using symbols as injection keys prevents naming conflicts.
        </p>

        <SymbolExample />
      </section>

      <!-- Example 5: Reactive Injection -->
      <section class="card">
        <h2>5. Reactive Provided Values</h2>
        <p class="description">
          Injected values are reactive - changes in provider update all consumers.
        </p>

        <div class="counter-controls">
          <button @click="counter.value--" class="counter-btn">-</button>
          <span class="counter-display">{{ counter.value }}</span>
          <button @click="counter.value++" class="counter-btn">+</button>
        </div>

        <CounterDisplay />

        <div class="nested">
          <h4>Nested Counter Display</h4>
          <CounterDisplay />
        </div>
      </section>

      <!-- Example 6: Default Values -->
      <section class="card">
        <h2>6. Injection with Defaults</h2>
        <p class="description">
          Components can provide default values when injection is not available.
        </p>

        <DefaultExample />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, provide } from 'vue'
import ThemedCard from './components/ThemedCard.vue'
import ThemedButton from './components/ThemedButton.vue'
import UserProfile from './components/UserProfile.vue'
import DeeplyNestedComponent from './components/DeeplyNestedComponent.vue'
import ConfigDisplay from './components/ConfigDisplay.vue'
import SymbolExample from './components/SymbolExample.vue'
import CounterDisplay from './components/CounterDisplay.vue'
import DefaultExample from './components/DefaultExample.vue'

// Example 1: Theme Provider
const theme = reactive({
  mode: 'light',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#ffffff',
    text: '#333333'
  }
})

provide('theme', theme)

function toggleTheme() {
  if (theme.mode === 'light') {
    theme.mode = 'dark'
    theme.colors.background = '#1a1a1a'
    theme.colors.text = '#ffffff'
  } else {
    theme.mode = 'light'
    theme.colors.background = '#ffffff'
    theme.colors.text = '#333333'
  }
}

function showMessage() {
  alert(`Button clicked! Current theme: ${theme.mode}`)
}

// Example 2: User Context
const user = reactive({
  isAuthenticated: false,
  name: '',
  email: '',
  role: ''
})

provide('user', user)

function login() {
  user.isAuthenticated = true
  user.name = 'John Doe'
  user.email = 'john@example.com'
  user.role = 'Admin'
}

function logout() {
  user.isAuthenticated = false
  user.name = ''
  user.email = ''
  user.role = ''
}

// Example 3: Configuration
const config = reactive({
  apiUrl: 'https://api.example.com',
  features: {
    notifications: true,
    analytics: false,
    darkMode: true
  },
  version: '1.0.0'
})

provide('config', config)

// Example 5: Reactive Counter
const counter = ref(0)
provide('counter', counter)
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f7fa;
  transition: all 0.3s;
}

.app.dark {
  background: #1a1a1a;
}

.app.dark .header {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
}

.app.dark .card {
  background: #2d3748;
  color: #e2e8f0;
}

.app.dark .description {
  color: #a0aec0;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: grid;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #667eea;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.theme-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.theme-btn {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.theme-info {
  background: #f9f9f9;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.6;
}

.app.dark .theme-info {
  background: #1a202c;
}

.user-controls {
  margin-bottom: 20px;
}

.login-btn,
.logout-btn {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn {
  background: #48bb78;
  color: white;
}

.login-btn:hover {
  background: #38a169;
}

.logout-btn {
  background: #f56565;
  color: white;
}

.logout-btn:hover {
  background: #e53e3e;
}

.nested-example {
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.app.dark .nested-example {
  background: #1a202c;
}

.nested-example h3 {
  color: #667eea;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.config-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.config-controls label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
}

.config-controls input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.text-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.text-input:focus {
  outline: none;
  border-color: #667eea;
}

.app.dark .text-input {
  background: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

.counter-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.counter-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #667eea;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.counter-btn:hover {
  background: #5568d3;
  transform: scale(1.1);
}

.counter-display {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  min-width: 60px;
  text-align: center;
}

.nested {
  margin-top: 20px;
  padding: 15px;
  background: #e7f3ff;
  border-radius: 6px;
}

.app.dark .nested {
  background: #1a365d;
}

.nested h4 {
  color: #667eea;
  margin-bottom: 10px;
}
</style>
