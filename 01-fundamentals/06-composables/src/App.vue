<template>
  <div class="app">
    <header class="header">
      <h1>🧩 Lesson 6: Composables</h1>
      <p>Reusable Composition Functions for Clean, Maintainable Code</p>
    </header>

    <div class="container">
      <!-- Example 1: useCounter -->
      <section class="card">
        <h2>1. useCounter - Bounded Counter</h2>
        <p class="description">
          A reusable counter with min/max bounds and step control.
        </p>

        <div class="demo-box">
          <div class="counter-display">
            <h3>{{ counter.count }}</h3>
          </div>
          <div class="counter-controls">
            <button
              @click="counter.decrement"
              :disabled="!counter.canDecrement"
            >
              - Decrement
            </button>
            <button @click="counter.reset">
              Reset
            </button>
            <button
              @click="counter.increment"
              :disabled="!counter.canIncrement"
            >
              + Increment
            </button>
          </div>
          <div class="info">
            <strong>Range:</strong> 0 to 10 |
            <strong>Step:</strong> 1
          </div>
        </div>

        <div class="code-preview">
          <pre><code>import { useCounter } from './composables/useCounter'

const counter = useCounter(5, { min: 0, max: 10, step: 1 })</code></pre>
        </div>
      </section>

      <!-- Example 2: useToggle -->
      <section class="card">
        <h2>2. useToggle - Boolean State Management</h2>
        <p class="description">
          Simple boolean state with toggle, set, and clear utilities.
        </p>

        <div class="demo-box">
          <div class="toggle-demo">
            <div class="status-indicator" :class="{ active: darkMode.value }">
              {{ darkMode.value ? '🌙 Dark Mode ON' : '☀️ Dark Mode OFF' }}
            </div>
            <div class="toggle-controls">
              <button @click="darkMode.toggle">Toggle</button>
              <button @click="darkMode.setTrue">Enable</button>
              <button @click="darkMode.setFalse">Disable</button>
            </div>
          </div>
        </div>

        <div class="code-preview">
          <pre><code>import { useToggle } from './composables/useToggle'

const darkMode = useToggle(false)
// darkMode.toggle(), .setTrue(), .setFalse()</code></pre>
        </div>
      </section>

      <!-- Example 3: useDebounce with Search -->
      <section class="card">
        <h2>3. useDebounce - Debounced Search</h2>
        <p class="description">
          Debounce user input to reduce expensive operations like API calls.
        </p>

        <div class="demo-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Type to search..."
            class="search-input"
          />
          <div class="debounce-info">
            <div><strong>Immediate value:</strong> "{{ searchQuery }}"</div>
            <div><strong>Debounced value (500ms):</strong> "{{ debouncedSearch }}"</div>
            <div class="change-count">
              <strong>Immediate changes:</strong> {{ immediateCount }} |
              <strong>Debounced changes:</strong> {{ debouncedCount }}
            </div>
          </div>
          <div class="search-results" v-if="debouncedSearch">
            <div class="result-item" v-for="result in searchResults" :key="result">
              {{ result }}
            </div>
          </div>
        </div>

        <div class="code-preview">
          <pre><code>import { ref, watch } from 'vue'
import { useDebounce } from './composables/useDebounce'

const searchQuery = ref('')
const debouncedSearch = useDebounce(searchQuery, 500)</code></pre>
        </div>
      </section>

      <!-- Example 4: useLocalStorage -->
      <section class="card">
        <h2>4. useLocalStorage - Persistent State</h2>
        <p class="description">
          Automatically sync reactive state with localStorage.
        </p>

        <div class="demo-box">
          <div class="preferences-form">
            <label>
              <span>Username:</span>
              <input
                type="text"
                v-model="preferences.data.username"
                placeholder="Enter username"
              />
            </label>
            <label>
              <span>Theme:</span>
              <select v-model="preferences.data.theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </label>
            <label>
              <input type="checkbox" v-model="preferences.data.notifications" />
              Enable Notifications
            </label>
          </div>
          <div class="info">
            Preferences are automatically saved to localStorage!
            Reload the page to see persistence in action.
          </div>
          <button @click="preferences.clear" class="clear-btn">
            Clear Preferences
          </button>
        </div>

        <div class="code-preview">
          <pre><code>import { useLocalStorage } from './composables/useLocalStorage'

const preferences = useLocalStorage('userPrefs', {
  username: '',
  theme: 'light',
  notifications: true
})</code></pre>
        </div>
      </section>

      <!-- Example 5: useForm + useValidation -->
      <section class="card">
        <h2>5. useForm + useValidation - Form Management</h2>
        <p class="description">
          Combine composables for powerful, reusable form handling with validation.
        </p>

        <div class="demo-box">
          <form @submit.prevent="handleSubmit" class="user-form">
            <div class="form-group">
              <label for="name">Name *</label>
              <input
                id="name"
                type="text"
                v-model="form.formData.name"
                @blur="validateName"
                :class="{ error: form.errors.name }"
              />
              <span v-if="form.errors.name" class="error-message">
                {{ form.errors.name }}
              </span>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                type="email"
                v-model="form.formData.email"
                @blur="validateEmail"
                :class="{ error: form.errors.email }"
              />
              <span v-if="form.errors.email" class="error-message">
                {{ form.errors.email }}
              </span>
            </div>

            <div class="form-group">
              <label for="age">Age</label>
              <input
                id="age"
                type="number"
                v-model.number="form.formData.age"
                @blur="validateAge"
                :class="{ error: form.errors.age }"
              />
              <span v-if="form.errors.age" class="error-message">
                {{ form.errors.age }}
              </span>
            </div>

            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                id="bio"
                v-model="form.formData.bio"
                @blur="validateBio"
                :class="{ error: form.errors.bio }"
                rows="4"
              ></textarea>
              <span v-if="form.errors.bio" class="error-message">
                {{ form.errors.bio }}
              </span>
            </div>

            <div class="form-actions">
              <button type="submit" :disabled="form.hasErrors || isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Submit' }}
              </button>
              <button type="button" @click="form.resetForm">
                Reset
              </button>
            </div>

            <div v-if="submitSuccess" class="success-message">
              Form submitted successfully! ✅
            </div>
          </form>

          <div class="form-state">
            <h4>Form State</h4>
            <pre>{{ JSON.stringify(form.values, null, 2) }}</pre>
            <div class="validation-status">
              <strong>Valid:</strong> {{ form.isValid ? '✅' : '❌' }} |
              <strong>Errors:</strong> {{ Object.keys(form.errors).length }}
            </div>
          </div>
        </div>

        <div class="code-preview">
          <pre><code>import { useForm } from './composables/useForm'
import { useValidation } from './composables/useValidation'

const form = useForm({ name: '', email: '', age: null, bio: '' })
const validation = useValidation()

function validateName() {
  const error = validation.validate(form.formData.name, [
    (v) => validation.required(v, 'Name'),
    (v) => validation.minLength(v, 3, 'Name')
  ])
  form.setFieldError('name', error)
}</code></pre>
        </div>
      </section>

      <!-- Example 6: useFetch with Mock Data -->
      <section class="card">
        <h2>6. useFetch - Data Fetching</h2>
        <p class="description">
          Simplified data fetching with loading and error states.
        </p>

        <div class="demo-box">
          <div class="fetch-controls">
            <button @click="loadUsers" :disabled="userFetch.isLoading">
              {{ userFetch.isLoading ? 'Loading...' : 'Load Users' }}
            </button>
            <button @click="simulateError">
              Simulate Error
            </button>
          </div>

          <div v-if="userFetch.isLoading" class="loading">
            Loading users...
          </div>

          <div v-else-if="userFetch.error" class="error-box">
            ❌ Error: {{ userFetch.error }}
          </div>

          <div v-else-if="userFetch.data" class="user-list">
            <div class="user-card" v-for="user in userFetch.data" :key="user.id">
              <strong>{{ user.name }}</strong>
              <span>{{ user.email }}</span>
            </div>
          </div>
        </div>

        <div class="code-preview">
          <pre><code>import { useFetch } from './composables/useFetch'

const userFetch = useFetch('https://api.example.com/users')

async function loadUsers() {
  await userFetch.execute()
}</code></pre>
        </div>
      </section>

      <!-- Benefits Summary -->
      <section class="card benefits">
        <h2>🎯 Why Use Composables?</h2>
        <div class="benefits-grid">
          <div class="benefit-item">
            <h3>♻️ Reusability</h3>
            <p>Write once, use everywhere. Share logic across components.</p>
          </div>
          <div class="benefit-item">
            <h3>🧹 Clean Code</h3>
            <p>Separate concerns. Keep components focused on UI.</p>
          </div>
          <div class="benefit-item">
            <h3>🧪 Testability</h3>
            <p>Test logic independently from components.</p>
          </div>
          <div class="benefit-item">
            <h3>📦 Organization</h3>
            <p>Group related logic together, not by component.</p>
          </div>
          <div class="benefit-item">
            <h3>🔄 Composition</h3>
            <p>Combine multiple composables for powerful functionality.</p>
          </div>
          <div class="benefit-item">
            <h3>⚡ TypeScript</h3>
            <p>Full type inference and autocomplete support.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCounter } from './composables/useCounter'
import { useToggle } from './composables/useToggle'
import { useDebounce } from './composables/useDebounce'
import { useLocalStorage } from './composables/useLocalStorage'
import { useForm } from './composables/useForm'
import { useValidation } from './composables/useValidation'
import { useFetch } from './composables/useFetch'

// Example 1: useCounter
const counter = useCounter(5, { min: 0, max: 10, step: 1 })

// Example 2: useToggle
const darkMode = useToggle(false)

// Example 3: useDebounce
const searchQuery = ref('')
const debouncedSearch = useDebounce(searchQuery, 500)
const immediateCount = ref(0)
const debouncedCount = ref(0)
const searchResults = ref([])

const mockSearchData = [
  'Apple', 'Application', 'Apricot', 'Banana', 'Blueberry',
  'Cherry', 'Coconut', 'Date', 'Dragon Fruit'
]

watch(searchQuery, () => {
  immediateCount.value++
})

watch(debouncedSearch, (query) => {
  debouncedCount.value++

  if (query) {
    searchResults.value = mockSearchData.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    )
  } else {
    searchResults.value = []
  }
})

// Example 4: useLocalStorage
const preferences = useLocalStorage('userPreferences', {
  username: '',
  theme: 'light',
  notifications: true
})

// Example 5: useForm + useValidation
const form = useForm({
  name: '',
  email: '',
  age: null,
  bio: ''
})

const validation = useValidation()
const isSubmitting = ref(false)
const submitSuccess = ref(false)

function validateName() {
  const error = validation.validate(form.formData.name, [
    (v) => validation.required(v, 'Name'),
    (v) => validation.minLength(v, 3, 'Name'),
    (v) => validation.maxLength(v, 50, 'Name')
  ])
  form.setFieldError('name', error)
}

function validateEmail() {
  const error = validation.validate(form.formData.email, [
    (v) => validation.required(v, 'Email'),
    (v) => validation.email(v, 'Email')
  ])
  form.setFieldError('email', error)
}

function validateAge() {
  const error = validation.numberRange(form.formData.age, 1, 120, 'Age')
  form.setFieldError('age', error)
}

function validateBio() {
  const error = validation.maxLength(form.formData.bio, 500, 'Bio')
  form.setFieldError('bio', error)
}

async function handleSubmit() {
  // Validate all fields
  validateName()
  validateEmail()
  validateAge()
  validateBio()

  if (form.hasErrors) {
    return
  }

  isSubmitting.value = true
  submitSuccess.value = false

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  console.log('Form submitted:', form.values)
  submitSuccess.value = true
  isSubmitting.value = false

  setTimeout(() => {
    submitSuccess.value = false
  }, 3000)
}

// Example 6: useFetch
const userFetch = useFetch('https://jsonplaceholder.typicode.com/users')

async function loadUsers() {
  try {
    await userFetch.execute()
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}

async function simulateError() {
  const errorFetch = useFetch('https://invalid-url-that-does-not-exist.com/api')
  try {
    await errorFetch.execute()
  } catch (error) {
    userFetch.error.value = 'Failed to fetch data from server'
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
  margin-bottom: 15px;
}

.info {
  margin-top: 15px;
  padding: 10px;
  background: #e7f3ff;
  border-left: 4px solid #2196F3;
  font-size: 0.9rem;
}

.code-preview {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
}

.code-preview pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

/* Counter */
.counter-display {
  text-align: center;
  margin-bottom: 20px;
}

.counter-display h3 {
  font-size: 3rem;
  color: #667eea;
}

.counter-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.counter-controls button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.counter-controls button:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.counter-controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Toggle */
.toggle-demo {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-indicator {
  text-align: center;
  padding: 30px;
  background: #f0f0f0;
  border-radius: 10px;
  font-size: 1.5rem;
  transition: all 0.3s;
}

.status-indicator.active {
  background: #2d2d2d;
  color: white;
}

.toggle-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.toggle-controls button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-controls button:hover {
  background: #5568d3;
}

/* Debounce/Search */
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

.debounce-info {
  background: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.debounce-info div {
  padding: 5px 0;
}

.change-count {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.search-results {
  display: grid;
  gap: 5px;
}

.result-item {
  padding: 10px;
  background: white;
  border-radius: 5px;
  border-left: 3px solid #667eea;
}

/* LocalStorage */
.preferences-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.preferences-form label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preferences-form label span {
  min-width: 120px;
  font-weight: 600;
}

.preferences-form input[type="text"],
.preferences-form select {
  flex: 1;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.preferences-form input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.clear-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.clear-btn:hover {
  background: #c82333;
}

/* Form */
.user-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #dc3545;
}

.error-message {
  display: block;
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.form-actions button {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.form-actions button[type="submit"] {
  background: #28a745;
  color: white;
}

.form-actions button[type="submit"]:hover:not(:disabled) {
  background: #218838;
}

.form-actions button[type="submit"]:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-actions button[type="button"] {
  background: #6c757d;
  color: white;
}

.form-actions button[type="button"]:hover {
  background: #5a6268;
}

.success-message {
  margin-top: 15px;
  padding: 15px;
  background: #d4edda;
  color: #155724;
  border-radius: 5px;
  text-align: center;
  font-weight: 600;
}

.form-state {
  background: white;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
}

.form-state h4 {
  margin-bottom: 10px;
  color: #333;
}

.form-state pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 0.85rem;
}

.validation-status {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

/* Fetch */
.fetch-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.fetch-controls button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.fetch-controls button:hover:not(:disabled) {
  background: #5568d3;
}

.fetch-controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.error-box {
  padding: 15px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 5px;
  text-align: center;
}

.user-list {
  display: grid;
  gap: 10px;
}

.user-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px;
  background: white;
  border-radius: 5px;
  border-left: 3px solid #667eea;
}

.user-card strong {
  font-size: 1.1rem;
  color: #333;
}

.user-card span {
  color: #666;
  font-size: 0.9rem;
}

/* Benefits */
.benefits {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.benefits h2 {
  color: white;
  text-align: center;
  margin-bottom: 30px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.benefit-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.benefit-item h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.benefit-item p {
  opacity: 0.9;
  line-height: 1.6;
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
