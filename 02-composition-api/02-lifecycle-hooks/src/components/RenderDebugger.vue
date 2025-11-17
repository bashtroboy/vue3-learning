<template>
  <div class="render-debugger">
    <h4>Render Debugger</h4>
    <div class="stats">
      <div class="stat">
        <label>Render Count:</label>
        <span class="value">{{ renderCount }}</span>
      </div>
      <div class="stat">
        <label>Update Count:</label>
        <span class="value">{{ updateCount }}</span>
      </div>
    </div>

    <div class="controls">
      <input v-model="text" placeholder="Type to trigger updates..." />
      <button @click="forceUpdate">Force Re-render</button>
    </div>

    <div class="render-times">
      <h5>Render Timestamps:</h5>
      <ul>
        <li v-for="(time, index) in renderTimes" :key="index">
          Render #{{ index + 1 }}: {{ time }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onRenderTracked, onRenderTriggered } from 'vue'

const renderCount = ref(0)
const updateCount = ref(0)
const text = ref('')
const renderTimes = ref([])
const componentKey = ref(0)

onBeforeMount(() => {
  console.log('[RenderDebugger] onBeforeMount')
})

onMounted(() => {
  renderCount.value++
  renderTimes.value.push(new Date().toLocaleTimeString())
  console.log('[RenderDebugger] onMounted - Render count:', renderCount.value)
})

onBeforeUpdate(() => {
  console.log('[RenderDebugger] onBeforeUpdate')
})

onUpdated(() => {
  updateCount.value++
  renderTimes.value.push(new Date().toLocaleTimeString())
  console.log('[RenderDebugger] onUpdated - Update count:', updateCount.value)
})

onRenderTracked((event) => {
  console.log('[RenderDebugger] Tracked:', event)
})

onRenderTriggered((event) => {
  console.log('[RenderDebugger] Triggered:', event)
})

const forceUpdate = () => {
  componentKey.value++
}
</script>

<style scoped>
.render-debugger {
  padding: 15px;
  background: #e3f2fd;
  border: 2px solid #2196f3;
  border-radius: 8px;
  margin: 10px 0;
}

.render-debugger h4 {
  margin-top: 0;
  color: #1976d2;
}

.stats {
  display: flex;
  gap: 20px;
  margin: 15px 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px 15px;
  border-radius: 6px;
}

.stat label {
  font-weight: 600;
  color: #555;
}

.stat .value {
  font-size: 24px;
  font-weight: bold;
  color: #2196f3;
}

.controls {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.controls input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.controls button {
  background: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #1976d2;
}

.render-times {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.render-times h5 {
  margin-top: 0;
  color: #1976d2;
}

.render-times ul {
  margin: 0;
  padding-left: 20px;
}

.render-times li {
  padding: 5px 0;
  font-family: monospace;
  font-size: 13px;
}
</style>
