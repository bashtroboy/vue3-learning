<template>
  <div class="app">
    <header class="header">
      <h1>🔄 Lesson 5: Deep Dive Reactivity</h1>
      <p>Master watch, watchEffect, and reactive tracking patterns</p>
    </header>

    <div class="container">
      <!-- Example 1: watchEffect - Auto-save preferences -->
      <section class="card">
        <h2>1. watchEffect - Auto-Save Preferences</h2>
        <p class="description">
          watchEffect automatically tracks dependencies and runs immediately.
          Perfect for side effects that should run whenever related data changes.
        </p>

        <div class="demo-box">
          <div class="preferences">
            <label>
              <input type="checkbox" v-model="preferences.darkMode" />
              Dark Mode
            </label>
            <label>
              <input type="checkbox" v-model="preferences.notifications" />
              Enable Notifications
            </label>
            <label>
              Font Size:
              <input
                type="range"
                v-model.number="preferences.fontSize"
                min="12"
                max="24"
              />
              {{ preferences.fontSize }}px
            </label>
          </div>
          <div class="status" v-if="saveStatus">
            ✅ {{ saveStatus }}
          </div>
          <div class="info">
            <strong>Auto-saves triggered:</strong> {{ autoSaveCount }}
          </div>
        </div>
      </section>

      <!-- Example 2: watch - Search with debounce -->
      <section class="card">
        <h2>2. watch - Search with Old/New Values</h2>
        <p class="description">
          watch lets you compare old and new values and control when the watcher runs.
          Great for debouncing, validation, and comparing changes.
        </p>

        <div class="demo-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Type to search..."
            class="search-input"
          />
          <div class="search-results">
            <div v-if="isSearching" class="loading">Searching...</div>
            <div v-else-if="searchResults.length > 0">
              <div class="result-item" v-for="result in searchResults" :key="result">
                {{ result }}
              </div>
            </div>
            <div v-else-if="searchQuery" class="no-results">
              No results found
            </div>
          </div>
          <div class="info">
            <strong>Search count:</strong> {{ searchCount }} |
            <strong>Last search:</strong> "{{ lastSearch }}"
          </div>
        </div>
      </section>

      <!-- Example 3: Deep watching nested objects -->
      <section class="card">
        <h2>3. Deep Watch - Nested Object Tracking</h2>
        <p class="description">
          Deep watching tracks changes in nested objects and arrays.
          Essential for complex data structures.
        </p>

        <div class="demo-box">
          <div class="user-form">
            <input
              type="text"
              v-model="user.name"
              placeholder="Name"
            />
            <input
              type="email"
              v-model="user.contact.email"
              placeholder="Email"
            />
            <input
              type="tel"
              v-model="user.contact.phone"
              placeholder="Phone"
            />
            <div class="tags">
              <span
                class="tag"
                v-for="(tag, index) in user.tags"
                :key="index"
              >
                {{ tag }}
                <button @click="removeTag(index)">×</button>
              </span>
              <input
                type="text"
                v-model="newTag"
                @keyup.enter="addTag"
                placeholder="Add tag..."
                class="tag-input"
              />
            </div>
          </div>
          <div class="info">
            <strong>Deep changes detected:</strong> {{ deepChangeCount }}
          </div>
          <div class="change-log">
            <div v-for="(change, index) in changeLog" :key="index" class="change-entry">
              {{ change }}
            </div>
          </div>
        </div>
      </section>

      <!-- Example 4: Multiple sources and computed -->
      <section class="card">
        <h2>4. Watch Multiple Sources</h2>
        <p class="description">
          Watch can monitor multiple reactive sources simultaneously.
        </p>

        <div class="demo-box">
          <div class="calculator">
            <label>
              Width:
              <input type="number" v-model.number="dimensions.width" min="1" />
            </label>
            <label>
              Height:
              <input type="number" v-model.number="dimensions.height" min="1" />
            </label>
            <label>
              Price per sq unit:
              <input type="number" v-model.number="pricePerUnit" min="0" step="0.01" />
            </label>
          </div>
          <div class="results">
            <div><strong>Area:</strong> {{ area }} sq units</div>
            <div><strong>Perimeter:</strong> {{ perimeter }} units</div>
            <div><strong>Total Price:</strong> ${{ totalPrice.toFixed(2) }}</div>
          </div>
          <div class="info">
            <strong>Calculations performed:</strong> {{ calculationCount }}
          </div>
        </div>
      </section>

      <!-- Example 5: Stoppable watcher -->
      <section class="card">
        <h2>5. Stoppable Watcher</h2>
        <p class="description">
          Watchers can be stopped programmatically when no longer needed.
        </p>

        <div class="demo-box">
          <div class="timer-controls">
            <button @click="startTimer" :disabled="timerRunning">
              Start Timer
            </button>
            <button @click="stopTimer" :disabled="!timerRunning">
              Stop Timer
            </button>
            <button @click="resetTimer">
              Reset
            </button>
          </div>
          <div class="timer-display">
            <h3>{{ timerSeconds }} seconds</h3>
            <div class="status">
              Status: {{ timerRunning ? '🟢 Running' : '🔴 Stopped' }}
            </div>
          </div>
          <div class="info">
            Timer events logged: {{ timerLog.length }}
          </div>
        </div>
      </section>

      <!-- Example 6: Flush timing -->
      <section class="card">
        <h2>6. Flush Timing Control</h2>
        <p class="description">
          Control when watchers run: 'pre' (before DOM update), 'post' (after DOM update), or 'sync' (synchronously).
        </p>

        <div class="demo-box">
          <button @click="incrementCounter">
            Increment Counter: {{ counter }}
          </button>
          <div class="flush-log">
            <div v-for="(log, index) in flushLog" :key="index" class="log-entry">
              {{ log }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, watchEffect, computed, nextTick } from 'vue'

// Example 1: watchEffect - Auto-save preferences
const preferences = reactive({
  darkMode: false,
  notifications: true,
  fontSize: 16
})

const saveStatus = ref('')
const autoSaveCount = ref(0)

// watchEffect runs immediately and tracks all reactive dependencies automatically
watchEffect(() => {
  // Simulating auto-save to localStorage
  const prefsData = JSON.stringify(preferences)
  localStorage.setItem('userPreferences', prefsData)

  autoSaveCount.value++
  saveStatus.value = `Saved at ${new Date().toLocaleTimeString()}`

  // Clear status after 2 seconds
  setTimeout(() => {
    saveStatus.value = ''
  }, 2000)
})

// Example 2: watch - Search with debounce
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchCount = ref(0)
const lastSearch = ref('')

const mockData = [
  'Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Coconut',
  'Date', 'Dragon Fruit', 'Elderberry', 'Fig', 'Grape', 'Guava'
]

let searchTimeout

// watch gives you the old and new values
watch(searchQuery, (newQuery, oldQuery) => {
  // Clear previous timeout
  clearTimeout(searchTimeout)

  if (!newQuery) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  // Debounce search by 500ms
  searchTimeout = setTimeout(() => {
    searchCount.value++
    lastSearch.value = newQuery

    // Simulate search
    searchResults.value = mockData.filter(item =>
      item.toLowerCase().includes(newQuery.toLowerCase())
    )

    isSearching.value = false
  }, 500)
})

// Example 3: Deep watching nested objects
const user = reactive({
  name: 'John Doe',
  contact: {
    email: 'john@example.com',
    phone: '555-0100'
  },
  tags: ['developer', 'vue']
})

const newTag = ref('')
const deepChangeCount = ref(0)
const changeLog = ref([])

// Deep watch tracks nested property changes
watch(user, (newUser, oldUser) => {
  deepChangeCount.value++
  const timestamp = new Date().toLocaleTimeString()
  changeLog.value.unshift(`Change #${deepChangeCount.value} at ${timestamp}`)

  // Keep only last 5 changes
  if (changeLog.value.length > 5) {
    changeLog.value.pop()
  }
}, { deep: true })

function addTag() {
  if (newTag.value.trim()) {
    user.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(index) {
  user.tags.splice(index, 1)
}

// Example 4: Watch multiple sources
const dimensions = reactive({
  width: 10,
  height: 5
})

const pricePerUnit = ref(2.5)
const calculationCount = ref(0)

const area = computed(() => dimensions.width * dimensions.height)
const perimeter = computed(() => 2 * (dimensions.width + dimensions.height))
const totalPrice = computed(() => area.value * pricePerUnit.value)

// Watch multiple sources - runs when ANY of them change
watch([() => dimensions.width, () => dimensions.height, pricePerUnit],
  ([newWidth, newHeight, newPrice], [oldWidth, oldHeight, oldPrice]) => {
    calculationCount.value++
    console.log('Dimensions or price changed:', {
      width: { old: oldWidth, new: newWidth },
      height: { old: oldHeight, new: newHeight },
      price: { old: oldPrice, new: newPrice }
    })
  }
)

// Example 5: Stoppable watcher
const timerSeconds = ref(0)
const timerRunning = ref(false)
const timerLog = ref([])
let timerInterval
let stopWatcher

function startTimer() {
  timerRunning.value = true
  timerInterval = setInterval(() => {
    timerSeconds.value++
  }, 1000)

  // Create a watcher that can be stopped
  stopWatcher = watch(timerSeconds, (newVal) => {
    timerLog.value.push(`Timer: ${newVal}s at ${new Date().toLocaleTimeString()}`)

    // Auto-stop at 10 seconds
    if (newVal >= 10) {
      stopTimer()
      alert('Timer reached 10 seconds!')
    }
  })
}

function stopTimer() {
  timerRunning.value = false
  clearInterval(timerInterval)

  // Stop the watcher
  if (stopWatcher) {
    stopWatcher()
  }
}

function resetTimer() {
  stopTimer()
  timerSeconds.value = 0
  timerLog.value = []
}

// Example 6: Flush timing
const counter = ref(0)
const flushLog = ref([])

// Pre flush - runs before DOM updates
watch(counter, (newVal) => {
  flushLog.value.push(`[PRE] Counter changed to ${newVal}`)
}, { flush: 'pre' })

// Post flush - runs after DOM updates (default)
watch(counter, (newVal) => {
  flushLog.value.push(`[POST] Counter changed to ${newVal}`)
}, { flush: 'post' })

// Sync flush - runs synchronously
watch(counter, (newVal) => {
  flushLog.value.push(`[SYNC] Counter changed to ${newVal}`)
}, { flush: 'sync' })

function incrementCounter() {
  counter.value++

  // Keep only last 10 logs
  if (flushLog.value.length > 10) {
    flushLog.value = flushLog.value.slice(-10)
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 30px;
  border-radius: 10px;
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
  color: #667eea;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.demo-box {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

/* Example 1: Preferences */
.preferences {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preferences label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
}

.preferences input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.preferences input[type="range"] {
  margin: 0 10px;
}

.status {
  margin-top: 15px;
  padding: 10px;
  background: #d4edda;
  color: #155724;
  border-radius: 5px;
  text-align: center;
}

.info {
  margin-top: 15px;
  padding: 10px;
  background: #e7f3ff;
  border-left: 4px solid #2196F3;
  font-size: 0.9rem;
}

/* Example 2: Search */
.search-input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-results {
  min-height: 100px;
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}

.result-item {
  padding: 10px;
  background: white;
  margin-bottom: 5px;
  border-radius: 5px;
  border-left: 3px solid #667eea;
}

.no-results {
  text-align: center;
  color: #999;
  padding: 20px;
}

/* Example 3: Deep watch */
.user-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.user-form input {
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
}

.user-form input:focus {
  outline: none;
  border-color: #667eea;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag {
  background: #667eea;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.tag button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-input {
  flex: 1;
  min-width: 150px;
  padding: 5px 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
}

.change-log {
  max-height: 120px;
  overflow-y: auto;
  margin-top: 10px;
}

.change-entry {
  padding: 5px;
  background: white;
  margin-bottom: 3px;
  border-radius: 3px;
  font-size: 0.85rem;
  color: #555;
}

/* Example 4: Multiple sources */
.calculator {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.calculator label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.calculator input {
  flex: 1;
  padding: 8px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
}

.results {
  background: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.results div {
  padding: 5px 0;
  font-size: 1rem;
}

/* Example 5: Timer */
.timer-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.timer-controls button {
  flex: 1;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.timer-controls button:hover:not(:disabled) {
  background: #5568d3;
}

.timer-controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.timer-display {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 5px;
  margin-bottom: 10px;
}

.timer-display h3 {
  font-size: 2rem;
  color: #667eea;
}

.timer-display .status {
  margin-top: 10px;
  background: transparent;
  font-size: 1.1rem;
}

/* Example 6: Flush timing */
.flush-log {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 15px;
  background: white;
  padding: 10px;
  border-radius: 5px;
}

.log-entry {
  padding: 5px;
  margin-bottom: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  border-left: 3px solid #667eea;
  padding-left: 10px;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #5568d3;
}
</style>
