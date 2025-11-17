<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from './examples/SearchInput.vue'

const searchResults = ref<string[]>([])
const searchHistory = ref<string[]>([])

const handleSearch = (query: string) => {
  searchHistory.value.unshift(query)
  searchResults.value = [`Result for "${query}" 1`, `Result for "${query}" 2`]
}

const handleClear = () => {
  searchResults.value = []
}
</script>

<template>
  <div class="example">
    <h2>Typed Emits</h2>
    <p class="description">
      Use <code>defineEmits&lt;T&gt;()</code> for type-safe event emissions.
    </p>

    <div class="section">
      <h3>Example Code</h3>
      <div class="code-block">
        <pre><code>// Define emits with tuple syntax
const emit = defineEmits&lt;{
  search: [query: string]
  clear: []
  update: [id: number, value: string]
}&gt;()

// Emit events
emit('search', 'hello')  // ✅ OK
emit('search')           // ❌ Error: missing argument
emit('search', 123)      // ❌ Error: wrong type</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Live Example</h3>
      <SearchInput
        @search="handleSearch"
        @clear="handleClear"
      />

      <div v-if="searchResults.length" class="results">
        <h4>Results:</h4>
        <ul>
          <li v-for="(result, i) in searchResults" :key="i">{{ result }}</li>
        </ul>
      </div>

      <div v-if="searchHistory.length" class="history">
        <h4>Search History:</h4>
        <ul>
          <li v-for="(query, i) in searchHistory.slice(0, 5)" :key="i">{{ query }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.example { padding: 1rem; }
h2 { color: #2c3e50; margin-bottom: 0.5rem; }
.description { color: #7f8c8d; margin-bottom: 2rem; font-size: 1.05rem; }
.description code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
.section { margin-bottom: 2rem; }
.section h3 { color: #34495e; margin-bottom: 1rem; font-size: 1.3rem; }
.code-block { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
.code-block pre { margin: 0; font-family: 'Monaco', monospace; font-size: 0.85rem; line-height: 1.6; color: #2c3e50; }
.results, .history { margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; }
.results h4, .history h4 { margin-bottom: 0.5rem; color: #2c3e50; }
.results ul, .history ul { margin-left: 1.5rem; }
.results li, .history li { margin: 0.25rem 0; }
</style>
