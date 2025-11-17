<template>
  <div class="tab-content">
    <h4>Tab One Content</h4>
    <p>Lifecycle Status: {{ lifecycleStatus }}</p>
    <p>Mount Count: {{ mountCount }}</p>
    <p>Activated Count: {{ activatedCount }}</p>
    <p>Current Time: {{ currentTime }}</p>

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
const currentTime = ref(new Date().toLocaleTimeString())
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

  // Start timer when mounted
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
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

  // Resume timer
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

onDeactivated(() => {
  lifecycleStatus.value = 'Deactivated (Keep-Alive)'
  logEvent('onDeactivated')

  // Pause timer
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.tab-content {
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  min-height: 300px;
}

.tab-content h4 {
  margin-top: 0;
  color: #0369a1;
}

.tab-content p {
  margin: 10px 0;
  font-size: 14px;
}

.lifecycle-log {
  margin-top: 20px;
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #bae6fd;
}

.lifecycle-log h5 {
  margin-top: 0;
  color: #0369a1;
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
  border-bottom: 1px solid #e0f2fe;
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
  color: #0369a1;
  font-weight: 600;
}
</style>
