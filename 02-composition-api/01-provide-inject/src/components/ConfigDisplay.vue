<template>
  <div class="config-display">
    <h3>Current Configuration</h3>
    <div class="config-grid">
      <div class="config-item">
        <strong>API URL:</strong>
        <span>{{ config.apiUrl }}</span>
      </div>
      <div class="config-item">
        <strong>Version:</strong>
        <span>{{ config.version }}</span>
      </div>
      <div class="config-item">
        <strong>Notifications:</strong>
        <span :class="{ enabled: config.features.notifications }">
          {{ config.features.notifications ? '✅ Enabled' : '❌ Disabled' }}
        </span>
      </div>
      <div class="config-item">
        <strong>Analytics:</strong>
        <span :class="{ enabled: config.features.analytics }">
          {{ config.features.analytics ? '✅ Enabled' : '❌ Disabled' }}
        </span>
      </div>
      <div class="config-item">
        <strong>Dark Mode:</strong>
        <span :class="{ enabled: config.features.darkMode }">
          {{ config.features.darkMode ? '✅ Enabled' : '❌ Disabled' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const config = inject('config')
</script>

<style scoped>
.config-display {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.config-display h3 {
  margin-bottom: 15px;
  color: #333;
}

.config-grid {
  display: grid;
  gap: 12px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 4px;
  font-size: 0.9rem;
}

.config-item strong {
  color: #667eea;
}

.config-item span.enabled {
  color: #48bb78;
  font-weight: 600;
}
</style>
