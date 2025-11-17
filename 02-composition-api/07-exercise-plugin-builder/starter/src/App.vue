<template>
  <div class="app">
    <h1>Plugin Builder Exercise</h1>
    <p class="subtitle">Build a comprehensive plugin system</p>

    <!-- TODO: Add demo sections for your plugins -->

    <section class="demo-section">
      <h2>1. Notification Plugin</h2>
      <div class="demo-card">
        <!-- TODO: Add notification demo -->
        <button @click="showNotification" class="btn">Show Notification</button>
      </div>
    </section>

    <section class="demo-section">
      <h2>2. Theme Plugin</h2>
      <div class="demo-card">
        <!-- TODO: Add theme switcher -->
        <button class="btn">Toggle Theme</button>
      </div>
    </section>

    <section class="demo-section">
      <h2>3. Analytics Plugin</h2>
      <div class="demo-card">
        <!-- TODO: Add analytics demo -->
        <button class="btn">Track Event</button>
      </div>
    </section>
  </div>
</template>

<script setup>
// TODO: Import composables
// import { useNotification } from './composables/useNotification'
// import { useTheme } from './composables/useTheme'
// import { useAnalytics } from './composables/useAnalytics'

const showNotification = () => {
  // TODO: Implement notification
  alert('TODO: Implement notification system')
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

.btn {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:hover {
  background: #2980b9;
}
</style>
