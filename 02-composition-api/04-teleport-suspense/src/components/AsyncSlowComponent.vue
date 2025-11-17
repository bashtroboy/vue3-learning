<template>
  <div class="slow-component">
    <h4>Slow Loading Component</h4>
    <p>This component took {{ loadTime / 1000 }} seconds to load</p>
    <p class="info">Notice the timeout behavior if it takes too long</p>
  </div>
</template>

<script setup>
const loadTime = 3000

// Simulate slow loading
await new Promise(resolve => setTimeout(resolve, loadTime))
</script>

<style scoped>
.slow-component {
  padding: 15px;
  background: #fff3cd;
  border-radius: 8px;
  border-left: 4px solid #f39c12;
}

.info {
  color: #856404;
  font-style: italic;
  margin: 10px 0 0 0;
}
</style>
