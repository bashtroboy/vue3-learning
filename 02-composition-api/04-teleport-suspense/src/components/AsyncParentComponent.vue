<template>
  <div class="parent-component">
    <h4>Parent Component</h4>
    <p>Parent loaded after {{ loadTime }}ms</p>

    <div class="nested-suspense">
      <Suspense>
        <template #default>
          <AsyncChildComponent />
        </template>
        <template #fallback>
          <div class="loading-nested">Loading child...</div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const loadTime = 800

// Parent async setup
await new Promise(resolve => setTimeout(resolve, loadTime))

const AsyncChildComponent = defineAsyncComponent(() =>
  import('./AsyncChildComponent.vue')
)
</script>

<style scoped>
.parent-component {
  padding: 15px;
  background: #e8f4f8;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.nested-suspense {
  margin-top: 15px;
  padding: 15px;
  background: white;
  border-radius: 6px;
}

.loading-nested {
  padding: 20px;
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
}
</style>
