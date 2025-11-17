<template>
  <div class="timing-demo">
    <h4>Lifecycle Timing Demonstration</h4>
    <p class="description">
      Watch the console and timeline to see when each lifecycle hook fires
    </p>

    <div class="controls">
      <button @click="toggleComponent" class="toggle-btn">
        {{ showChild ? 'Unmount' : 'Mount' }} Child Component
      </button>
      <button @click="triggerUpdate" class="update-btn" :disabled="!showChild">
        Trigger Update
      </button>
      <button @click="clearTimeline" class="clear-btn">
        Clear Timeline
      </button>
    </div>

    <div v-if="showChild" class="child-container">
      <ChildComponent
        :key="childKey"
        :update-trigger="updateTrigger"
        @lifecycle="logLifecycle"
      />
    </div>

    <div class="timeline">
      <h5>Lifecycle Timeline:</h5>
      <div class="timeline-items">
        <div
          v-for="(item, index) in timeline"
          :key="index"
          class="timeline-item"
          :class="item.type"
        >
          <span class="timestamp">{{ item.timestamp }}ms</span>
          <span class="hook-name">{{ item.hook }}</span>
          <span class="message">{{ item.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showChild = ref(false)
const childKey = ref(0)
const updateTrigger = ref(0)
const timeline = ref([])
const startTime = ref(0)

onMounted(() => {
  startTime.value = Date.now()
})

const toggleComponent = () => {
  showChild.value = !showChild.value
  if (showChild.value) {
    childKey.value++
  }
}

const triggerUpdate = () => {
  updateTrigger.value++
}

const logLifecycle = (hook, message, type = 'mount') => {
  const elapsed = Date.now() - startTime.value
  timeline.value.push({
    timestamp: elapsed,
    hook,
    message,
    type
  })
}

const clearTimeline = () => {
  timeline.value = []
  startTime.value = Date.now()
}
</script>

<script>
import { defineComponent, ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

const ChildComponent = defineComponent({
  name: 'ChildComponent',
  props: ['updateTrigger'],
  emits: ['lifecycle'],
  setup(props, { emit }) {
    const localData = ref('Initial value')

    onBeforeMount(() => {
      emit('lifecycle', 'onBeforeMount', 'Child is about to mount', 'mount')
    })

    onMounted(() => {
      emit('lifecycle', 'onMounted', 'Child DOM is ready', 'mount')
    })

    onBeforeUpdate(() => {
      emit('lifecycle', 'onBeforeUpdate', 'Child is about to update', 'update')
    })

    onUpdated(() => {
      emit('lifecycle', 'onUpdated', 'Child DOM updated', 'update')
    })

    onBeforeUnmount(() => {
      emit('lifecycle', 'onBeforeUnmount', 'Child is about to unmount', 'unmount')
    })

    onUnmounted(() => {
      emit('lifecycle', 'onUnmounted', 'Child is unmounted', 'unmount')
    })

    return {
      localData
    }
  },
  template: `
    <div class="child-component">
      <h5>Child Component</h5>
      <p>Update Trigger: {{ updateTrigger }}</p>
      <p>{{ localData }}</p>
    </div>
  `
})

export { ChildComponent }
</script>

<style scoped>
.timing-demo {
  padding: 20px;
  background: #f8fafc;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
}

.timing-demo h4 {
  margin-top: 0;
  color: #334155;
}

.description {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 15px;
}

.controls {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toggle-btn {
  background: #3b82f6;
  color: white;
}

.toggle-btn:hover {
  background: #2563eb;
}

.update-btn {
  background: #10b981;
  color: white;
}

.update-btn:hover:not(:disabled) {
  background: #059669;
}

.update-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.clear-btn {
  background: #ef4444;
  color: white;
}

.clear-btn:hover {
  background: #dc2626;
}

.child-container {
  margin: 15px 0;
}

.timeline {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
}

.timeline h5 {
  margin-top: 0;
  color: #334155;
}

.timeline-items {
  max-height: 300px;
  overflow-y: auto;
}

.timeline-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  margin: 5px 0;
  border-left: 4px solid #cbd5e1;
  background: #f8fafc;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
}

.timeline-item.mount {
  border-left-color: #3b82f6;
  background: #eff6ff;
}

.timeline-item.update {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.timeline-item.unmount {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.timestamp {
  color: #64748b;
  min-width: 60px;
}

.hook-name {
  color: #334155;
  font-weight: 600;
  min-width: 140px;
}

.message {
  color: #64748b;
}
</style>

<style>
.child-component {
  padding: 15px;
  background: #dbeafe;
  border: 2px solid #3b82f6;
  border-radius: 6px;
}

.child-component h5 {
  margin-top: 0;
  color: #1e40af;
}

.child-component p {
  margin: 5px 0;
  color: #1e3a8a;
}
</style>
