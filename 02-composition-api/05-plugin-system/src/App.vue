<template>
  <div class="app">
    <h1>Lesson 5: Vue Plugin System</h1>
    <p class="subtitle">Working examples of custom Vue 3 plugins</p>

    <!-- Plugin 1: Toast Notification System -->
    <section class="demo-section">
      <h2>1. Toast Notification Plugin</h2>
      <div class="demo-card">
        <h3>useToast() Composable</h3>
        <div class="button-group">
          <button @click="showSuccess" class="btn btn-success">Success Toast</button>
          <button @click="showError" class="btn btn-error">Error Toast</button>
          <button @click="showWarning" class="btn btn-warning">Warning Toast</button>
          <button @click="showInfo" class="btn btn-info">Info Toast</button>
        </div>

        <div class="stats">
          <p>Toasts shown: {{ toastCount }}</p>
          <p>Active toasts: {{ toast.state.toasts.length }}</p>
        </div>

        <button @click="toast.dismissAll()" class="btn btn-secondary">
          Dismiss All
        </button>
      </div>
    </section>

    <!-- Plugin 2: I18n System -->
    <section class="demo-section">
      <h2>2. I18n Translation Plugin</h2>
      <div class="demo-card">
        <h3>useI18n() Composable</h3>

        <div class="language-selector">
          <label>Current Language:</label>
          <select v-model="i18n.locale.value">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div class="translations">
          <p><strong>{{ i18n.t('greeting') }}</strong></p>
          <p>{{ i18n.t('welcome') }}</p>
          <p>{{ i18n.t('description') }}</p>
          <p>{{ i18n.t('items', { count: 5 }) }}</p>
        </div>
      </div>
    </section>

    <!-- Plugin 3: Logger Plugin -->
    <section class="demo-section">
      <h2>3. Logger Plugin</h2>
      <div class="demo-card">
        <h3>useLogger() Composable</h3>

        <div class="button-group">
          <button @click="logInfo" class="btn btn-info">Log Info</button>
          <button @click="logWarn" class="btn btn-warning">Log Warning</button>
          <button @click="logError" class="btn btn-error">Log Error</button>
          <button @click="logDebug" class="btn">Log Debug</button>
        </div>

        <div class="log-display">
          <h4>Recent Logs (check console):</h4>
          <div
            v-for="(log, index) in recentLogs"
            :key="index"
            class="log-entry"
            :class="`log-${log.level}`"
          >
            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
            <span class="log-level">{{ log.level.toUpperCase() }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>

        <button @click="clearLogs" class="btn btn-secondary">Clear Logs</button>
      </div>
    </section>

    <!-- Plugin 4: HTTP Client Plugin -->
    <section class="demo-section">
      <h2>4. HTTP Client Plugin</h2>
      <div class="demo-card">
        <h3>useHttp() Composable</h3>

        <button @click="fetchData" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Loading...' : 'Fetch User Data' }}
        </button>

        <div v-if="error" class="error-box">
          <strong>Error:</strong> {{ error }}
        </div>

        <div v-if="userData" class="data-display">
          <h4>Fetched Data:</h4>
          <pre>{{ JSON.stringify(userData, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <!-- Global Properties Demo -->
    <section class="demo-section">
      <h2>5. Global Properties</h2>
      <div class="demo-card">
        <h3>Accessing via this.$plugin</h3>
        <p>Plugins can add global properties accessible in templates:</p>

        <GlobalPropertiesDemo />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useToast } from './composables/useToast'
import { useI18n } from './composables/useI18n'
import { useLogger } from './composables/useLogger'
import { useHttp } from './composables/useHttp'
import GlobalPropertiesDemo from './components/GlobalPropertiesDemo.vue'

// Toast plugin usage
const toast = useToast()
const toastCount = ref(0)

const showSuccess = () => {
  toast.success('Operation completed successfully!')
  toastCount.value++
}

const showError = () => {
  toast.error('An error occurred!')
  toastCount.value++
}

const showWarning = () => {
  toast.warning('Please review your input')
  toastCount.value++
}

const showInfo = () => {
  toast.info('Did you know? Plugins are awesome!')
  toastCount.value++
}

// I18n plugin usage
const i18n = useI18n()

// Logger plugin usage
const logger = useLogger()
const recentLogs = ref([])

const logInfo = () => {
  logger.info('This is an info message')
  updateRecentLogs()
}

const logWarn = () => {
  logger.warn('This is a warning message')
  updateRecentLogs()
}

const logError = () => {
  logger.error('This is an error message')
  updateRecentLogs()
}

const logDebug = () => {
  logger.debug('This is a debug message')
  updateRecentLogs()
}

const updateRecentLogs = () => {
  recentLogs.value = logger.getLogs().slice(-5).reverse()
}

const clearLogs = () => {
  logger.clear()
  recentLogs.value = []
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

// HTTP client plugin usage
const http = useHttp()
const userData = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  userData.value = null

  try {
    // Simulated API call
    const response = await http.get('https://jsonplaceholder.typicode.com/users/1')
    userData.value = response
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
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
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary { background: #3498db; color: white; }
.btn-success { background: #27ae60; color: white; }
.btn-error { background: #e74c3c; color: white; }
.btn-warning { background: #f39c12; color: white; }
.btn-info { background: #3498db; color: white; }
.btn-secondary { background: #95a5a6; color: white; }

.btn:hover { opacity: 0.9; transform: translateY(-1px); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.stats {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}

.stats p {
  margin: 5px 0;
  font-weight: 600;
}

.language-selector {
  margin-bottom: 20px;
}

.language-selector label {
  margin-right: 10px;
  font-weight: 600;
}

.language-selector select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.translations {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
}

.translations p {
  margin: 10px 0;
  line-height: 1.6;
}

.log-display {
  background: #2c3e50;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
  max-height: 300px;
  overflow-y: auto;
}

.log-display h4 {
  color: #ecf0f1;
  margin-top: 0;
}

.log-entry {
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  display: flex;
  gap: 10px;
}

.log-info { background: #34495e; color: #3498db; }
.log-warn { background: #34495e; color: #f39c12; }
.log-error { background: #34495e; color: #e74c3c; }
.log-debug { background: #34495e; color: #95a5a6; }

.log-time { color: #95a5a6; }
.log-level { font-weight: bold; min-width: 60px; }
.log-message { flex: 1; }

.error-box {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}

.data-display {
  margin-top: 15px;
}

.data-display h4 {
  margin-top: 0;
}

.data-display pre {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
}
</style>
