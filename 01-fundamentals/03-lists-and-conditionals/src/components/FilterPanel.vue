<template>
  <div class="filter-panel">
    <div class="filter-group">
      <label for="search">Search Objects</label>
      <input
        id="search"
        type="text"
        placeholder="Type to search..."
        :value="search"
        @input="$emit('update:search', $event.target.value)"
        class="input"
      >
    </div>

    <div class="filter-group">
      <label for="type">Filter by Type</label>
      <select
        id="type"
        :value="typeFilter"
        @change="$emit('update:typeFilter', $event.target.value)"
        class="input"
      >
        <option value="">All Types</option>
        <option v-for="type in types" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label for="sort">Sort By</label>
      <select
        id="sort"
        :value="sortBy"
        @change="$emit('update:sortBy', $event.target.value)"
        class="input"
      >
        <option value="name">Name (A-Z)</option>
        <option value="size-asc">Size (Small to Large)</option>
        <option value="size-desc">Size (Large to Small)</option>
        <option value="modified">Recently Modified</option>
        <option value="favorite">Favorites First</option>
      </select>
    </div>

    <div class="info">
      Showing <strong>{{ showing }}</strong> of <strong>{{ total }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    search: String,
    typeFilter: String,
    sortBy: String,
    types: Array,
    total: Number,
    showing: Number
  },

  emits: ['update:search', 'update:typeFilter', 'update:sortBy']
}
</script>

<style scoped>
.filter-panel {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.info {
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #666;
}

@media (max-width: 768px) {
  .filter-panel {
    grid-template-columns: 1fr;
  }
}
</style>
