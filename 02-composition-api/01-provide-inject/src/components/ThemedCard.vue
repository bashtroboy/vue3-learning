<template>
  <div class="themed-card" :style="cardStyle">
    <h3>{{ title }}</h3>
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="theme-indicator">
      Theme Mode: {{ theme.mode }}
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  }
})

// Inject theme from ancestor (App.vue)
const theme = inject('theme')

const cardStyle = computed(() => ({
  borderColor: theme.colors.primary,
  background: theme.mode === 'dark' ? '#2d3748' : '#ffffff',
  color: theme.colors.text
}))
</script>

<style scoped>
.themed-card {
  border: 3px solid;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  transition: all 0.3s;
}

.themed-card h3 {
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.card-content {
  margin-bottom: 15px;
  line-height: 1.6;
}

.theme-indicator {
  font-size: 0.85rem;
  opacity: 0.7;
  font-style: italic;
}
</style>
