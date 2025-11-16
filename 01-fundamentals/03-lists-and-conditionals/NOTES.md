# Lesson 3 - Deep Dive Notes

## Table of Contents
1. [v-for: List Rendering](#v-for-list-rendering)
2. [v-if / v-show: Conditional Rendering](#conditional-rendering)
3. [Computed Properties for Filtering](#computed-properties-for-filtering)
4. [Sorting Lists](#sorting-lists)
5. [Vite Project Setup](#vite-project-setup)
6. [Component Communication](#component-communication)
7. [Common Patterns](#common-patterns)

---

## v-for: List Rendering

### Basic Syntax
```vue
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>
```

### Breaking It Down

**v-for="item in items"**
- `item` - Local variable for each iteration
- `items` - Array to loop through
- Similar to JavaScript's `for...of` loop

**:key="item.id"**
- Unique identifier for Vue to track items
- Critical for performance and correctness
- Should be unique and stable (not index!)
- Without :key, Vue reuses DOM elements (can cause bugs)

### Example from our app
```javascript
// In App.vue setup()
const objects = ref([
  { id: 1, name: 'Enterprise Folder', type: 'Folder', ... },
  { id: 2, name: 'Financial Report Q4', type: 'Document', ... },
  // ... more objects
])
```

```vue
<!-- In template -->
<ObjectItem
  v-for="obj in filteredAndSortedObjects"
  :key="obj.id"
  :object="obj"
  @toggle-favorite="toggleFavorite"
/>
```

### Why :key is Important

Without :key:
```
Initial list: [A, B, C]
DOM elements: [<div>A</div>, <div>B</div>, <div>C</div>]

After removing B: [A, C]
Vue might reuse DOM: [<div>A</div>, <div>B</div>]
              ↑ Bug! This is now C but still says B
```

With :key:
```
Initial list: [{id:1, name:'A'}, {id:2, name:'B'}, {id:3, name:'C'}]
DOM elements: [<div key="1">A</div>, <div key="2">B</div>, <div key="3">C</div>]

After removing B: [{id:1, name:'A'}, {id:3, name:'C'}]
Vue updates: [<div key="1">A</div>, <div key="3">C</div>]
           ✓ Correct! Vue knew which element to remove
```

### Getting Index in v-for

Sometimes you need the iteration index:
```vue
<div v-for="(item, index) in items" :key="item.id">
  {{ index + 1 }}. {{ item.name }}
</div>
```

⚠️ **Never use index as :key** when list can be reordered!

### Nested v-for

For hierarchical data (like Content Server folders):
```vue
<div v-for="folder in folders" :key="folder.id">
  <h3>{{ folder.name }}</h3>
  <div v-for="doc in folder.documents" :key="doc.id">
    - {{ doc.name }}
  </div>
</div>
```

---

## Conditional Rendering

### v-if vs v-show

#### v-if - Removes element from DOM
```vue
<div v-if="isLoggedIn">
  Welcome back!
</div>
```
- DOM element is completely removed when false
- Can't see it in Developer Tools when false
- More expensive to toggle frequently
- Good for: Major layout changes, feature flags

#### v-show - Hides with CSS
```vue
<div v-show="isVisible">
  This is visible or hidden
</div>
```
- DOM element stays in DOM, but `display: none` when false
- Can see it in Developer Tools (but hidden)
- Cheaper to toggle frequently
- Good for: Modals, dropdowns, temporary visibility

### Using v-if in our app

```javascript
// Computed property to determine age
const isRecent = computed(() => {
  const days = getDaysSinceModified(props.object.modified)
  return days <= 7
})

const isModerateAge = computed(() => {
  const days = getDaysSinceModified(props.object.modified)
  return days > 7 && days <= 30
})
```

```vue
<!-- In template -->
<span v-if="isRecent" class="badge badge-recent">Recent</span>
<span v-else-if="isModerateAge" class="badge badge-moderate">Moderate</span>
<span v-else class="badge badge-old">Old</span>
```

### v-if with v-for

⚠️ **Avoid combining** - it's a common mistake!

```vue
<!-- ❌ DON'T DO THIS - inefficient -->
<div v-for="item in items" :key="item.id">
  <div v-if="item.active">
    {{ item.name }}
  </div>
</div>

<!-- ✅ DO THIS INSTEAD - filter in computed -->
<div v-for="item in activeItems" :key="item.id">
  {{ item.name }}
</div>
```

In the computed property:
```javascript
const activeItems = computed(() => {
  return items.value.filter(item => item.active)
})
```

---

## Computed Properties for Filtering

### What is a Computed Property?

A computed property is:
- A function that returns derived data
- Reactive - automatically updates when dependencies change
- Cached - only recalculates if dependencies change
- Read-only by default

### Structure in our app

```javascript
import { computed } from 'vue'

// Input reactive values
const searchQuery = ref('')
const selectedType = ref('')

// Computed property that filters
const filteredObjects = computed(() => {
  return objects.value.filter(obj => {
    const matchesSearch = obj.name.toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesType = !selectedType.value || obj.type === selectedType.value
    return matchesSearch && matchesType
  })
})
```

### How Filtering Works

Step by step:
1. User types in search box
2. `@input` event updates `searchQuery.value`
3. Vue sees `searchQuery` dependency changed
4. `filteredObjects` recomputes
5. Template updates with new filtered list

### Array Methods for Filtering

**filter()** - Keep matching items
```javascript
const activeObjects = computed(() => {
  return objects.value.filter(obj => obj.favorite)
})
```

**map()** - Transform each item
```javascript
const objectNames = computed(() => {
  return objects.value.map(obj => obj.name)
})
```

**find()** - Get first matching item
```javascript
const firstDocument = computed(() => {
  return objects.value.find(obj => obj.type === 'Document')
})
```

**some()** - Check if any item matches
```javascript
const hasLargeFiles = computed(() => {
  return objects.value.some(obj => obj.size > 5000)
})
```

**reduce()** - Aggregate data
```javascript
const totalSize = computed(() => {
  return objects.value.reduce((sum, obj) => sum + obj.size, 0)
})
```

### Multiple Computed Properties (Chaining)

Our app uses chaining:
```javascript
// Step 1: Filter by search + type
const filteredObjects = computed(() => {
  return objects.value.filter(obj => {
    const matchesSearch = obj.name.toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesType = !selectedType.value || obj.type === selectedType.value
    return matchesSearch && matchesType
  })
})

// Step 2: Sort filtered results
const filteredAndSortedObjects = computed(() => {
  const items = [...filteredObjects.value]  // Copy to avoid mutating
  return items.sort(...) // Apply sorting
})
```

⚠️ **Important**: Always create a copy with `[...]` before sorting!

---

## Sorting Lists

### Sort Implementation

```javascript
const filteredAndSortedObjects = computed(() => {
  const items = [...filteredObjects.value]  // Copy array

  switch (sortBy.value) {
    case 'name':
      // Alphabetical sort
      return items.sort((a, b) => a.name.localeCompare(b.name))

    case 'size-asc':
      // Numbers: ascending
      return items.sort((a, b) => a.size - b.size)

    case 'size-desc':
      // Numbers: descending
      return items.sort((a, b) => b.size - a.size)

    case 'modified':
      // Dates: most recent first
      return items.sort((a, b) =>
        new Date(b.modified) - new Date(a.modified)
      )

    case 'favorite':
      // Boolean: true (1) before false (0)
      return items.sort((a, b) => b.favorite - a.favorite)

    default:
      return items
  }
})
```

### Sort Methods Explained

#### String Sort (localeCompare)
```javascript
// Bad: Case-sensitive, doesn't handle accents
items.sort((a, b) => a.name > b.name ? 1 : -1)

// Good: Case-insensitive, handles accents properly
items.sort((a, b) => a.name.localeCompare(b.name))
```

#### Number Sort
```javascript
// Ascending (0-9)
items.sort((a, b) => a.size - b.size)
// 100, 200, 500, 1000

// Descending (9-0)
items.sort((a, b) => b.size - a.size)
// 1000, 500, 200, 100
```

#### Date Sort
```javascript
// Most recent first
items.sort((a, b) => new Date(b.date) - new Date(a.date))

// Oldest first
items.sort((a, b) => new Date(a.date) - new Date(b.date))
```

#### Boolean Sort
```javascript
// Favorites first
items.sort((a, b) => b.favorite - a.favorite)
// true (1) comes before false (0)
```

### Why Copy with [...] ?

The `.sort()` method mutates the original array!

```javascript
// ❌ Wrong - mutates the computed property's input
const sorted = filteredObjects.value.sort(...)

// ✅ Correct - copies first, then sorts
const items = [...filteredObjects.value]
return items.sort(...)
```

---

## Vite Project Setup

### What is Vite?

Vite is a modern build tool that:
- Provides fast development server with Hot Module Replacement (HMR)
- Automatically reloads your app when you save files
- Bundles and optimizes for production
- Handles Vue, TypeScript, CSS, and more

### Project Structure

```
03-lists-and-conditionals/
├── index.html              # Entry point - references src/main.js
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.js             # Creates Vue app, mounts to #app
│   ├── App.vue             # Root component
│   └── components/         # Child components
│       ├── FilterPanel.vue
│       └── ObjectItem.vue
```

### vite.config.js Explained

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],  // Enable Vue support
  server: {
    port: 5173,      // Development server port
    open: true       // Auto-open in browser
  }
})
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",           // Start dev server
    "build": "vite build",   // Build for production
    "preview": "vite preview" // Preview production build
  }
}
```

### ES Modules in main.js

```javascript
import { createApp } from 'vue'  // Import Vue
import App from './App.vue'       // Import component

createApp(App).mount('#app')      // Create and mount app
```

This is different from Lesson 1's CDN approach:
```html
<!-- Lesson 1: Global Vue from CDN -->
<script>
  const { createApp, ref } = Vue
  createApp({ ... }).mount('#app')
</script>
```

---

## Component Communication

### Parent → Child: Props

FilterPanel receives data from App:
```javascript
// In App.vue
<FilterPanel
  :search="searchQuery"
  :typeFilter="selectedType"
  :sortBy="sortBy"
  :types="uniqueTypes"
  :total="objects.length"
  :showing="filteredAndSortedObjects.length"
/>
```

FilterPanel defines props:
```javascript
// In FilterPanel.vue
export default {
  props: {
    search: String,
    typeFilter: String,
    sortBy: String,
    types: Array,
    total: Number,
    showing: Number
  }
}
```

### Child → Parent: Emits

FilterPanel updates parent via v-model pattern:
```vue
<!-- In FilterPanel.vue template -->
<input
  :value="search"
  @input="$emit('update:search', $event.target.value)"
/>
```

App listens and updates:
```vue
<!-- In App.vue template -->
<FilterPanel
  v-model:search="searchQuery"
  v-model:typeFilter="selectedType"
  v-model:sortBy="sortBy"
  ...
/>
```

### v-model Two-way Binding

The pattern above is Vue 3's `v-model:prop` syntax:
```vue
<!-- This: -->
<FilterPanel v-model:search="searchQuery" />

<!-- Is equivalent to: -->
<FilterPanel
  :search="searchQuery"
  @update:search="searchQuery = $event"
/>
```

Benefits:
- Clean, readable syntax
- Automatic two-way binding
- Works with form controls
- Parent controls the source of truth

---

## Common Patterns

### Pattern 1: Search + Filter + Sort Pipeline

This is what our app does:

```javascript
// Step 1: Base data
const objects = ref([...])

// Step 2: Filter by text + category
const filteredObjects = computed(() => {
  return objects.value.filter(obj => {
    return obj.name.includes(search.value) &&
           (!type.value || obj.type === type.value)
  })
})

// Step 3: Sort the filtered results
const results = computed(() => {
  const items = [...filteredObjects.value]
  return items.sort((a, b) => {
    // sorting logic
  })
})
```

Then render:
```vue
<div v-for="item in results" :key="item.id">
  {{ item.name }}
</div>
```

### Pattern 2: Computed Aggregations

Calculate statistics from data:

```javascript
// Count items matching condition
const favoriteCount = computed(() => {
  return objects.value.filter(obj => obj.favorite).length
})

// Calculate average
const averageSize = computed(() => {
  if (objects.value.length === 0) return 0
  const total = objects.value.reduce((sum, obj) => sum + obj.size, 0)
  return Math.round(total / objects.value.length)
})

// Get unique values
const uniqueTypes = computed(() => {
  const types = objects.value.map(obj => obj.type)
  return [...new Set(types)]  // Set removes duplicates
})
```

### Pattern 3: Conditional Display Based on Data

```javascript
// Calculate days since modified
const getDaysSince = (dateStr) => {
  const modDate = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now - modDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Computed property for conditional logic
const isRecent = computed(() => getDaysSince(date.value) <= 7)
```

```vue
<!-- Then use conditionally -->
<span v-if="isRecent" class="recent">Recent</span>
<span v-else-if="!isRecent && getDaysSince(date) <= 30">
  Moderate
</span>
<span v-else>Old</span>
```

### Pattern 4: Empty State Handling

```vue
<div v-if="filteredObjects.length === 0" class="empty-state">
  <p>No results found</p>
  <button @click="clearFilters">Clear Filters</button>
</div>

<div v-else class="results">
  <!-- Show filtered list -->
</div>
```

---

## Performance Considerations

### Computed vs Methods

```javascript
// ❌ Method - recalculates EVERY time
const expensiveOperation = () => {
  return objects.value.filter(...).map(...).sort(...)
}

// ✅ Computed - recalculates ONLY when dependencies change
const expensiveOperation = computed(() => {
  return objects.value.filter(...).map(...).sort(...)
})
```

Use computed for:
- Expensive calculations
- Things that depend on reactive data
- Things used in templates

Use methods for:
- One-time operations
- Side effects
- Things called from events

### Array Mutations

```javascript
// ❌ Mutates original - causes issues
const items = arr.sort(...)

// ✅ Creates copy first
const items = [...arr].sort(...)
```

---

## Moving to Application Analyzer

These concepts appear everywhere in Application Analyzer:

1. **Tree Views** - Use v-for with recursive components
2. **Data Tables** - Lists with filtering, sorting, pagination
3. **Filter Panels** - Multi-criteria filtering with computed
4. **Status Indicators** - Conditional rendering (v-if/v-show) for status badges
5. **Bulk Operations** - Filter + checkboxes + batch actions
6. **Search Features** - Computed filters on large datasets
7. **Aggregations** - Computed properties for stats/summaries

Understanding these patterns is essential for working with Application Analyzer!

---

## Practice Exercises

### Exercise 1: Add Deletion
```javascript
// Add to App.vue setup()
const deleteObject = (id) => {
  objects.value = objects.value.filter(obj => obj.id !== id)
}
```

```vue
<!-- Add to ObjectItem.vue template -->
<button @click="$emit('delete', object.id)">Delete</button>
```

### Exercise 2: Add Selection Checkboxes
```javascript
const selectedIds = ref([])

const toggleSelection = (id) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}
```

### Exercise 3: Add Pagination
```javascript
const itemsPerPage = ref(5)
const currentPage = ref(1)

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAndSortedObjects.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(
    filteredAndSortedObjects.value.length / itemsPerPage.value
  )
})
```

---

## Key Takeaways

1. **v-for renders lists** - Always use :key with unique, stable values
2. **v-if removes, v-show hides** - Choose based on frequency of toggle
3. **Computed properties are powerful** - Use for filtering, sorting, aggregations
4. **Always copy before sorting** - Avoid mutating reactive arrays
5. **Vite provides professional tooling** - Much better than CDN for real projects
6. **Components communicate via props and emits** - Parent controls state, child requests changes
7. **Pipeline pattern** - Data flows through filter → sort → render

These are the foundations for everything in Vue 3! Master them here, and Application Analyzer will make sense.
