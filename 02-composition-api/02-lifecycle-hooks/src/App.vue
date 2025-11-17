<template>
  <div class="app">
    <header class="header">
      <h1>🔄 Lifecycle Hooks - Deep Dive</h1>
      <p>Master all Vue 3 component lifecycle hooks</p>
    </header>

    <div class="container">
      <!-- Example 1: Lifecycle Visualizer -->
      <section class="card">
        <h2>1. Lifecycle Visualizer</h2>
        <p class="description">
          Watch lifecycle hooks fire in real-time as components mount, update, and unmount.
        </p>

        <div class="controls">
          <button @click="showComponent = !showComponent" class="toggle-btn">
            {{ showComponent ? '🗑️ Unmount Component' : '✨ Mount Component' }}
          </button>
          <button @click="clearLogs" class="clear-btn">
            Clear Logs
          </button>
        </div>

        <div class="demo-area">
          <LifecycleDemo v-if="showComponent" :count="demoCount" @log="addLog" />
          <div v-else class="placeholder">
            Component unmounted - click "Mount Component" to create it
          </div>
        </div>

        <div class="trigger-update">
          <button @click="demoCount++">
            Trigger Update (count: {{ demoCount }})
          </button>
        </div>

        <div class="log-panel">
          <h3>Lifecycle Event Log</h3>
          <div class="logs">
            <div
              v-for="(log, index) in logs"
              :key="index"
              class="log-entry"
              :class="`log-${log.type}`"
            >
              <span class="timestamp">{{ log.timestamp }}</span>
              <span class="hook-name">{{ log.hook }}</span>
              <span class="message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Example 2: Common Lifecycle Patterns -->
      <section class="card">
        <h2>2. Common Lifecycle Patterns</h2>
        <p class="description">
          Real-world use cases for each lifecycle hook.
        </p>

        <div class="pattern-examples">
          <div class="pattern">
            <h4>onMounted - Fetch Data</h4>
            <DataFetcher />
          </div>

          <div class="pattern">
            <h4>onMounted - DOM Access</h4>
            <DomManipulator />
          </div>

          <div class="pattern">
            <h4>onUpdated - Track Changes</h4>
            <UpdateTracker />
          </div>

          <div class="pattern">
            <h4>onUnmounted - Cleanup</h4>
            <button @click="showTimer = !showTimer">
              {{ showTimer ? 'Stop Timer' : 'Start Timer' }}
            </button>
            <TimerComponent v-if="showTimer" />
          </div>
        </div>
      </section>

      <!-- Example 3: Advanced Hooks -->
      <section class="card">
        <h2>3. Advanced Lifecycle Hooks</h2>
        <p class="description">
          Less common but powerful hooks for specific scenarios.
        </p>

        <div class="advanced-demos">
          <div class="demo">
            <h4>onErrorCaptured - Error Boundary</h4>
            <ErrorBoundary>
              <button @click="triggerError = !triggerError">
                {{ triggerError ? 'Fix Component' : 'Break Component' }}
              </button>
              <ErrorProneComponent v-if="!triggerError" />
            </ErrorBoundary>
          </div>

          <div class="demo">
            <h4>onRenderTracked / onRenderTriggered - Debugging</h4>
            <RenderDebugger />
          </div>
        </div>
      </section>

      <!-- Example 4: Keep-Alive Hooks -->
      <section class="card">
        <h2>4. Keep-Alive Lifecycle</h2>
        <p class="description">
          onActivated and onDeactivated for cached components.
        </p>

        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="currentTab = tab"
            :class="{ active: currentTab === tab }"
            class="tab-btn"
          >
            {{ tab }}
          </button>
        </div>

        <KeepAlive>
          <component :is="currentTabComponent" />
        </KeepAlive>
      </section>

      <!-- Example 5: Lifecycle Best Practices -->
      <section class="card">
        <h2>5. Best Practices & Patterns</h2>
        <p class="description">
          Guidelines for using lifecycle hooks effectively.
        </p>

        <div class="best-practices">
          <div class="practice">
            <h4>✅ DO: Clean up in onUnmounted</h4>
            <pre><code>onMounted(() => {
  const interval = setInterval(() => {...}, 1000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})</code></pre>
          </div>

          <div class="practice">
            <h4>❌ DON'T: Side effects in onUpdated</h4>
            <pre><code>// ❌ Bad - can cause infinite loop
onUpdated(() => {
  data.value++ // Triggers another update!
})

// ✅ Good - use watch instead
watch(dependency, () => {
  data.value++
})</code></pre>
          </div>

          <div class="practice">
            <h4>✅ DO: Async operations in onMounted</h4>
            <pre><code>onMounted(async () => {
  const data = await fetchData()
  state.value = data
})</code></pre>
          </div>
        </div>
      </section>

      <!-- Example 6: Lifecycle Timing -->
      <section class="card">
        <h2>6. Lifecycle Hook Timing</h2>
        <p class="description">
          Understanding the order and timing of lifecycle hooks.
        </p>

        <div class="timing-diagram">
          <div class="phase">
            <h4>Creation Phase</h4>
            <div class="hooks">
              <div class="hook">setup()</div>
              <div class="hook">onBeforeMount()</div>
              <div class="hook">onMounted()</div>
            </div>
          </div>

          <div class="phase">
            <h4>Update Phase</h4>
            <div class="hooks">
              <div class="hook">onBeforeUpdate()</div>
              <div class="hook">onUpdated()</div>
            </div>
          </div>

          <div class="phase">
            <h4>Destruction Phase</h4>
            <div class="hooks">
              <div class="hook">onBeforeUnmount()</div>
              <div class="hook">onUnmounted()</div>
            </div>
          </div>
        </div>

        <button @click="showTimingDemo = !showTimingDemo" class="demo-btn">
          {{ showTimingDemo ? 'Hide' : 'Show' }} Timing Demo
        </button>
        <TimingDemo v-if="showTimingDemo" @hook="addTimingLog" />
        <div v-if="timingLogs.length > 0" class="timing-logs">
          <h4>Hook Execution Order:</h4>
          <div v-for="(log, i) in timingLogs" :key="i" class="timing-log">
            {{ i + 1 }}. {{ log }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LifecycleDemo from './components/LifecycleDemo.vue'
import DataFetcher from './components/DataFetcher.vue'
import DomManipulator from './components/DomManipulator.vue'
import UpdateTracker from './components/UpdateTracker.vue'
import TimerComponent from './components/TimerComponent.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import ErrorProneComponent from './components/ErrorProneComponent.vue'
import RenderDebugger from './components/RenderDebugger.vue'
import TabOne from './components/TabOne.vue'
import TabTwo from './components/TabTwo.vue'
import TimingDemo from './components/TimingDemo.vue'

// Example 1: Lifecycle Visualizer
const showComponent = ref(true)
const demoCount = ref(0)
const logs = ref([])

function addLog(hook, message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push({ hook, message, type, timestamp })
}

function clearLogs() {
  logs.value = []
}

// Example 4: Keep-Alive
const tabs = ['Tab 1', 'Tab 2']
const currentTab = ref('Tab 1')
const currentTabComponent = computed(() => {
  return currentTab.value === 'Tab 1' ? TabOne : TabTwo
})

// Example 2: Timer
const showTimer = ref(false)

// Example 3: Error Boundary
const triggerError = ref(false)

// Example 6: Timing
const showTimingDemo = ref(false)
const timingLogs = ref([])

function addTimingLog(hook) {
  timingLogs.value.push(hook)
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: grid;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #f5576c;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.toggle-btn,
.clear-btn,
.demo-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn {
  background: #f5576c;
  color: white;
}

.toggle-btn:hover {
  background: #e04455;
}

.clear-btn {
  background: #666;
  color: white;
}

.clear-btn:hover {
  background: #555;
}

.demo-area {
  margin-bottom: 20px;
  min-height: 150px;
}

.placeholder {
  padding: 40px;
  text-align: center;
  background: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 8px;
  color: #999;
}

.trigger-update {
  margin-bottom: 20px;
}

.trigger-update button {
  padding: 10px 20px;
  background: #f093fb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.trigger-update button:hover {
  background: #d67de8;
}

.log-panel {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}

.log-panel h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 1.1rem;
}

.logs {
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.log-entry {
  padding: 6px 10px;
  margin-bottom: 4px;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 80px 150px 1fr;
  gap: 10px;
}

.log-info {
  background: #e7f3ff;
}

.log-mount {
  background: #d4edda;
}

.log-update {
  background: #fff3cd;
}

.log-unmount {
  background: #f8d7da;
}

.timestamp {
  color: #666;
}

.hook-name {
  color: #f5576c;
  font-weight: 600;
}

.pattern-examples {
  display: grid;
  gap: 20px;
}

.pattern {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #f5576c;
}

.pattern h4 {
  color: #f5576c;
  margin-bottom: 10px;
}

.pattern button {
  margin-bottom: 10px;
}

.advanced-demos {
  display: grid;
  gap: 20px;
}

.demo {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.demo h4 {
  color: #333;
  margin-bottom: 10px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  border: 2px solid #f5576c;
  background: white;
  color: #f5576c;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #f5576c;
  color: white;
}

.tab-btn:hover {
  transform: translateY(-2px);
}

.best-practices {
  display: grid;
  gap: 20px;
}

.practice {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.practice h4 {
  margin-bottom: 10px;
}

.practice pre {
  background: #2d3748;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
}

.practice code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.timing-diagram {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.phase {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.phase h4 {
  color: #f5576c;
  margin-bottom: 10px;
  text-align: center;
}

.hooks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hook {
  background: white;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #f5576c;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  text-align: center;
}

.demo-btn {
  background: #f093fb;
  color: white;
  margin-bottom: 20px;
}

.demo-btn:hover {
  background: #d67de8;
}

.timing-logs {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.timing-logs h4 {
  margin-bottom: 10px;
  color: #333;
}

.timing-log {
  padding: 6px 10px;
  background: white;
  margin-bottom: 4px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}
</style>
