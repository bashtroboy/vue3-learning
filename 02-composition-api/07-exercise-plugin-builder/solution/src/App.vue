<template>
  <div class="app" :class="`theme-${theme.current.value}`">
    <h1>Plugin Builder Exercise - Solution</h1>
    <p class="subtitle">Complete plugin system implementation</p>

    <!-- Notification Plugin Demo -->
    <section class="demo-section">
      <h2>Notification Plugin</h2>
      <div class="demo-card">
        <button @click="notify.success('Success!')" class="btn btn-success">Success</button>
        <button @click="notify.error('Error!')" class="btn btn-error">Error</button>
        <button @click="notify.warning('Warning!')" class="btn btn-warning">Warning</button>
        <button @click="notify.info('Info!')" class="btn btn-info">Info</button>
      </div>
    </section>

    <!-- Theme Plugin Demo -->
    <section class="demo-section">
      <h2>Theme Plugin</h2>
      <div class="demo-card">
        <p>Current theme: {{ theme.current.value }}</p>
        <button @click="theme.toggle()" class="btn">Toggle Theme</button>
      </div>
    </section>

    <!-- Analytics Plugin Demo -->
    <section class="demo-section">
      <h2>Analytics Plugin</h2>
      <div class="demo-card">
        <button @click="trackEvent" class="btn">Track Event</button>
        <p>Events tracked: {{ analytics.getEvents().length }}</p>
      </div>
    </section>

    <!-- Directive Demos -->
    <section class="demo-section">
      <h2>Custom Directives</h2>
      <div class="demo-card">
        <button v-toast="'Click directive works!'" class="btn">v-toast</button>
        <button v-track:click="'button-clicked'" class="btn">v-track</button>
      </div>
    </section>

    <NotificationContainer />
  </div>
</template>

<script setup>
import { useNotification } from './composables/useNotification'
import { useTheme } from './composables/useTheme'
import { useAnalytics } from './composables/useAnalytics'
import NotificationContainer from './components/NotificationContainer.vue'

const notify = useNotification()
const theme = useTheme()
const analytics = useAnalytics()

const trackEvent = () => {
  analytics.track('button_click', { timestamp: Date.now() })
  notify.info('Event tracked!')
}
</script>

<style>
:root {
  --bg-color: #ffffff;
  --text-color: #2c3e50;
  --card-bg: #ffffff;
}

.theme-dark {
  --bg-color: #2c3e50;
  --text-color: #ecf0f1;
  --card-bg: #34495e;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s;
}
</style>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 40px;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h2 {
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.demo-card {
  background: var(--card-bg);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 15px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 5px;
  color: white;
  transition: all 0.3s;
}

.btn-success { background: #27ae60; }
.btn-error { background: #e74c3c; }
.btn-warning { background: #f39c12; }
.btn-info { background: #3498db; }
.btn { background: #95a5a6; }

.btn:hover { opacity: 0.9; }
</style>
