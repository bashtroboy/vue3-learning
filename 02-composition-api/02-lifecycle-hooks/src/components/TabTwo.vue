<template>
  <div class="tab-content">
    <h4>Tab Two Content</h4>
    <p>Lifecycle Status: {{ lifecycleStatus }}</p>
    <p>Mount Count: {{ mountCount }}</p>
    <p>Activated Count: {{ activatedCount }}</p>

    <div class="counter-display">
      <h5>Counter (continues even when deactivated):</h5>
      <div class="counter">{{ counter }}</div>
    </div>

    <div class="lifecycle-log">
      <h5>Lifecycle Events:</h5>
      <ul>
        <li v-for="(event, index) in events" :key="index">
          <span class="time">{{ event.time }}</span>
          <span class="event">{{ event.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

const lifecycleStatus = ref('Initializing...')
const mountCount = ref(0)
const activatedCount = ref(0)
const counter = ref(0)
const events = ref([])
let timer = null

const logEvent = (name) => {
  events.value.push({
    name,
    time: new Date().toLocaleTimeString()
  })
}

onMounted(() => {
  mountCount.value++
  lifecycleStatus.value = 'Mounted'
  logEvent('onMounted')

  // Start counter - continues even when deactivated
  timer = setInterval(() => {
    counter.value++
  }, 1000)
})

onUnmounted(() => {
  lifecycleStatus.value = 'Unmounted'
  logEvent('onUnmounted')

  if (timer) {
    clearInterval(timer)
  }
})

onActivated(() => {
  activatedCount.value++
  lifecycleStatus.value = 'Activated (Keep-Alive)'
  logEvent('onActivated')
})

onDeactivated(() => {
  lifecycleStatus.value = 'Deactivated (Keep-Alive)'
  logEvent('onDeactivated')
})
</script>

<style scoped>
.tab-content {
  padding: 20px;
  background: #faf5ff;
  border-radius: 8px;
  min-height: 300px;
}

.tab-content h4 {
  margin-top: 0;
  color: #7c3aed;
}

.tab-content p {
  margin: 10px 0;
  font-size: 14px;
}

.counter-display {
  margin: 20px 0;
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e9d5ff;
  text-align: center;
}

.counter-display h5 {
  margin-top: 0;
  color: #7c3aed;
}

.counter {
  font-size: 48px;
  font-weight: bold;
  color: #7c3aed;
}

.lifecycle-log {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e9d5ff;
}

.lifecycle-log h5 {
  margin-top: 0;
  color: #7c3aed;
}

.lifecycle-log ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
}

.lifecycle-log li {
  padding: 5px 0;
  border-bottom: 1px solid #f3e8ff;
  font-family: monospace;
  font-size: 13px;
}

.lifecycle-log li:last-child {
  border-bottom: none;
}

.time {
  color: #64748b;
  margin-right: 10px;
}

.event {
  color: #7c3aed;
  font-weight: 600;
}
</style>
