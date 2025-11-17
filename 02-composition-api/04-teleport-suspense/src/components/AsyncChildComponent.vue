<template>
  <div class="child-component">
    <h5>Child Component</h5>
    <p>Child loaded after {{ loadTime }}ms</p>
    <p class="success">✓ Nested Suspense working!</p>
  </div>
</template>

<script setup>
const loadTime = 600

// Child async setup
await new Promise(resolve => setTimeout(resolve, loadTime))
</script>

<style scoped>
.child-component {
  padding: 15px;
  background: #d1f2eb;
  border-radius: 6px;
  border-left: 4px solid #27ae60;
}

.success {
  color: #27ae60;
  font-weight: 600;
  margin: 10px 0 0 0;
}
</style>
