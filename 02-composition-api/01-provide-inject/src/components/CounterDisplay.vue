<template>
  <div class="counter-display">
    <p>
      Counter value from inject: <strong class="value">{{ counter }}</strong>
    </p>
    <p class="info">
      This value is reactive - it updates automatically when changed in the provider!
    </p>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const counter = inject('counter')
</script>

<style scoped>
.counter-display {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  margin: 10px 0;
}

.value {
  font-size: 1.5rem;
  color: #667eea;
}

.info {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}
</style>
