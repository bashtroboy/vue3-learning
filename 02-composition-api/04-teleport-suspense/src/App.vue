<template>
  <div class="app">
    <h1>Lesson 4: Teleport & Suspense</h1>
    <p class="subtitle">Master Vue 3's advanced rendering features</p>

    <!-- Teleport Examples -->
    <section class="demo-section">
      <h2>Part 1: Teleport</h2>

      <div class="demo-card">
        <h3>1. Modal Dialog (Teleport to body)</h3>
        <button @click="showModal = true" class="btn-primary">Open Modal</button>

        <Teleport to="body">
          <div v-if="showModal" class="modal-overlay" @click="showModal = false">
            <div class="modal-content" @click.stop>
              <h3>Modal Title</h3>
              <p>This modal is teleported to the body element!</p>
              <p>It renders outside the component hierarchy but maintains logical state.</p>
              <button @click="showModal = false" class="btn-secondary">Close</button>
            </div>
          </div>
        </Teleport>
      </div>

      <div class="demo-card">
        <h3>2. Notification System (Teleport to container)</h3>
        <button @click="addNotification" class="btn-primary">Show Notification</button>

        <Teleport to="#notification-container">
          <TransitionGroup name="notification" tag="div" class="notifications">
            <div
              v-for="notif in notifications"
              :key="notif.id"
              class="notification"
              :class="`notification-${notif.type}`"
            >
              <span>{{ notif.message }}</span>
              <button @click="removeNotification(notif.id)" class="close-btn">×</button>
            </div>
          </TransitionGroup>
        </Teleport>
      </div>

      <div class="demo-card">
        <h3>3. Tooltip (Conditional Teleport)</h3>
        <label>
          <input type="checkbox" v-model="teleportTooltip" />
          Teleport tooltip to #tooltip-container
        </label>

        <div class="tooltip-demo">
          <button
            @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false"
            class="btn-primary"
          >
            Hover for tooltip
          </button>

          <Teleport :to="teleportTooltip ? '#tooltip-container' : '.tooltip-demo'" :disabled="!teleportTooltip">
            <div v-if="showTooltip" class="tooltip">
              {{ teleportTooltip ? 'Teleported tooltip!' : 'Local tooltip' }}
            </div>
          </Teleport>
        </div>
      </div>

      <div class="demo-card">
        <h3>4. Multiple Teleports to Same Target</h3>
        <button @click="panel1 = !panel1" class="btn-primary">Toggle Panel 1</button>
        <button @click="panel2 = !panel2" class="btn-primary">Toggle Panel 2</button>

        <div id="teleport-target" class="teleport-target">
          <h4>Teleport Target Area</h4>
        </div>

        <Teleport to="#teleport-target">
          <div v-if="panel1" class="panel panel-blue">
            Panel 1 (Teleported)
          </div>
        </Teleport>

        <Teleport to="#teleport-target">
          <div v-if="panel2" class="panel panel-green">
            Panel 2 (Also Teleported)
          </div>
        </Teleport>
      </div>
    </section>

    <!-- Suspense Examples -->
    <section class="demo-section">
      <h2>Part 2: Suspense</h2>

      <div class="demo-card">
        <h3>5. Basic Suspense with Async Component</h3>
        <button @click="refreshAsync" class="btn-primary">Refresh Async Data</button>

        <Suspense>
          <template #default>
            <AsyncUserData :key="asyncKey" />
          </template>
          <template #fallback>
            <div class="loading">
              <div class="spinner"></div>
              <p>Loading user data...</p>
            </div>
          </template>
        </Suspense>
      </div>

      <div class="demo-card">
        <h3>6. Nested Suspense Components</h3>
        <Suspense>
          <template #default>
            <AsyncParentComponent />
          </template>
          <template #fallback>
            <div class="loading">Loading parent component...</div>
          </template>
        </Suspense>
      </div>

      <div class="demo-card">
        <h3>7. Error Handling with Suspense</h3>
        <button @click="toggleErrorMode" class="btn-primary">
          {{ errorMode ? 'Disable' : 'Enable' }} Error Mode
        </button>

        <Suspense @pending="onPending" @resolve="onResolve" @fallback="onFallback">
          <template #default>
            <AsyncDataWithError :shouldError="errorMode" :key="errorKey" />
          </template>
          <template #fallback>
            <div class="loading">
              <div class="spinner"></div>
              <p>Loading data...</p>
            </div>
          </template>
        </Suspense>

        <div v-if="suspenseState" class="state-indicator">
          State: {{ suspenseState }}
        </div>
      </div>

      <div class="demo-card">
        <h3>8. Timeout with Suspense</h3>
        <Suspense timeout="2000">
          <template #default>
            <AsyncSlowComponent />
          </template>
          <template #fallback>
            <div class="loading">Please wait, loading slow component...</div>
          </template>
        </Suspense>
      </div>
    </section>

    <!-- Combined Example -->
    <section class="demo-section">
      <h2>Part 3: Teleport + Suspense Combined</h2>

      <div class="demo-card">
        <h3>9. Async Modal with Suspense</h3>
        <button @click="showAsyncModal = true" class="btn-primary">
          Open Async Modal
        </button>

        <Teleport to="#modal-container">
          <div v-if="showAsyncModal" class="modal-overlay" @click="showAsyncModal = false">
            <div class="modal-content modal-large" @click.stop>
              <h3>Async Modal Content</h3>
              <Suspense>
                <template #default>
                  <AsyncModalContent />
                </template>
                <template #fallback>
                  <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading modal content...</p>
                  </div>
                </template>
              </Suspense>
              <button @click="showAsyncModal = false" class="btn-secondary">Close</button>
            </div>
          </div>
        </Teleport>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

// Teleport state
const showModal = ref(false)
const showTooltip = ref(false)
const teleportTooltip = ref(false)
const panel1 = ref(false)
const panel2 = ref(false)

// Notification system
let notificationId = 0
const notifications = ref([])

const addNotification = () => {
  const types = ['success', 'info', 'warning', 'error']
  const messages = [
    'Operation successful!',
    'New update available',
    'Please review your settings',
    'An error occurred'
  ]

  const type = types[Math.floor(Math.random() * types.length)]
  const message = messages[types.indexOf(type)]

  const id = notificationId++
  notifications.value.push({ id, type, message })

  setTimeout(() => {
    removeNotification(id)
  }, 3000)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Suspense state
const asyncKey = ref(0)
const errorKey = ref(0)
const errorMode = ref(false)
const suspenseState = ref('')
const showAsyncModal = ref(false)

const refreshAsync = () => {
  asyncKey.value++
}

const toggleErrorMode = () => {
  errorMode.value = !errorMode.value
  errorKey.value++
}

const onPending = () => {
  suspenseState.value = 'pending'
}

const onResolve = () => {
  suspenseState.value = 'resolved'
}

const onFallback = () => {
  suspenseState.value = 'showing fallback'
}

// Async components
const AsyncUserData = defineAsyncComponent(() =>
  import('./components/AsyncUserData.vue')
)

const AsyncParentComponent = defineAsyncComponent(() =>
  import('./components/AsyncParentComponent.vue')
)

const AsyncDataWithError = defineAsyncComponent(() =>
  import('./components/AsyncDataWithError.vue')
)

const AsyncSlowComponent = defineAsyncComponent(() =>
  import('./components/AsyncSlowComponent.vue')
)

const AsyncModalContent = defineAsyncComponent(() =>
  import('./components/AsyncModalContent.vue')
)
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 40px;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h2 {
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.demo-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.demo-card h3 {
  color: #2c3e50;
  margin-top: 0;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

/* Teleport Targets */
.teleport-target {
  margin-top: 20px;
  padding: 20px;
  background: #ecf0f1;
  border: 2px dashed #95a5a6;
  border-radius: 8px;
  min-height: 100px;
}

.teleport-target h4 {
  margin-top: 0;
  color: #7f8c8d;
}

.panel {
  padding: 15px;
  margin: 10px 0;
  border-radius: 6px;
  color: white;
}

.panel-blue {
  background: #3498db;
}

.panel-green {
  background: #27ae60;
}

/* Tooltip */
.tooltip-demo {
  position: relative;
  margin-top: 20px;
}

.tooltip {
  position: absolute;
  top: -40px;
  left: 10px;
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1000;
}

/* Loading states */
.loading {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 15px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.state-indicator {
  margin-top: 15px;
  padding: 10px;
  background: #e8f4f8;
  border-left: 4px solid #3498db;
  border-radius: 4px;
  font-weight: 600;
  color: #2c3e50;
}
</style>

<style>
/* Global styles for teleported elements */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.modal-large {
  max-width: 700px;
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

#notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none;
}

.notifications {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  pointer-events: all;
  color: white;
}

.notification-success { background: #27ae60; }
.notification-info { background: #3498db; }
.notification-warning { background: #f39c12; }
.notification-error { background: #e74c3c; }

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  margin-left: 15px;
  line-height: 1;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

#tooltip-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9998;
}
</style>
