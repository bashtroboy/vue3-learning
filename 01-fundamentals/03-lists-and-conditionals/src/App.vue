<template>
  <div class="app">
    <header class="header">
      <h1>Content Server Objects Browser</h1>
      <p class="subtitle">Learn Lists, Conditionals, and Computed Properties</p>
    </header>

    <main class="container">
      <!-- Filter Panel -->
      <FilterPanel
        v-model:search="searchQuery"
        v-model:typeFilter="selectedType"
        v-model:sortBy="sortBy"
        :types="uniqueTypes"
        :total="objects.length"
        :showing="filteredAndSortedObjects.length"
      />

      <!-- Empty State -->
      <div v-if="filteredAndSortedObjects.length === 0" class="empty-state">
        <p>No objects match your filters</p>
        <button @click="clearFilters" class="btn btn-secondary">Clear Filters</button>
      </div>

      <!-- Objects List -->
      <div v-else class="objects-list">
        <ObjectItem
          v-for="obj in filteredAndSortedObjects"
          :key="obj.id"
          :object="obj"
          @toggle-favorite="toggleFavorite"
        />
      </div>

      <!-- Stats Footer -->
      <footer class="footer">
        <div class="stat">
          <span class="label">Total Objects:</span>
          <span class="value">{{ objects.length }}</span>
        </div>
        <div class="stat">
          <span class="label">Favorites:</span>
          <span class="value">{{ favoriteCount }}</span>
        </div>
        <div class="stat">
          <span class="label">Average Size:</span>
          <span class="value">{{ averageSize }}</span>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import FilterPanel from './components/FilterPanel.vue'
import ObjectItem from './components/ObjectItem.vue'

export default {
  components: {
    FilterPanel,
    ObjectItem
  },

  setup() {
    // Reactive state
    const searchQuery = ref('')
    const selectedType = ref('')
    const sortBy = ref('name')

    // Mock data - simulating Content Server objects
    const objects = ref([
      {
        id: 1,
        name: 'Enterprise Folder',
        type: 'Folder',
        size: 2500,
        modified: '2024-01-15',
        favorite: true
      },
      {
        id: 2,
        name: 'Financial Report Q4',
        type: 'Document',
        size: 856,
        modified: '2024-01-10',
        favorite: false
      },
      {
        id: 3,
        name: 'HR Policies',
        type: 'Document',
        size: 1200,
        modified: '2024-01-08',
        favorite: true
      },
      {
        id: 4,
        name: 'Project Archive',
        type: 'Folder',
        size: 5400,
        modified: '2024-01-05',
        favorite: false
      },
      {
        id: 5,
        name: 'Annual Strategy',
        type: 'Document',
        size: 2100,
        modified: '2024-01-12',
        favorite: false
      },
      {
        id: 6,
        name: 'Marketing Assets',
        type: 'Folder',
        size: 8900,
        modified: '2024-01-14',
        favorite: true
      },
      {
        id: 7,
        name: 'Budget 2024',
        type: 'Document',
        size: 445,
        modified: '2024-01-09',
        favorite: false
      },
      {
        id: 8,
        name: 'Training Materials',
        type: 'Folder',
        size: 3200,
        modified: '2024-01-13',
        favorite: true
      }
    ])

    // ==================== COMPUTED PROPERTIES ====================

    // Get unique types for filter dropdown
    const uniqueTypes = computed(() => {
      const types = objects.value.map(obj => obj.type)
      return [...new Set(types)].sort()
    })

    // Filter objects based on search and type
    const filteredObjects = computed(() => {
      return objects.value.filter(obj => {
        const matchesSearch = obj.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesType = !selectedType.value || obj.type === selectedType.value
        return matchesSearch && matchesType
      })
    })

    // Sort filtered objects
    const filteredAndSortedObjects = computed(() => {
      const items = [...filteredObjects.value]

      switch (sortBy.value) {
        case 'name':
          return items.sort((a, b) => a.name.localeCompare(b.name))
        case 'size-asc':
          return items.sort((a, b) => a.size - b.size)
        case 'size-desc':
          return items.sort((a, b) => b.size - a.size)
        case 'modified':
          return items.sort((a, b) => new Date(b.modified) - new Date(a.modified))
        case 'favorite':
          return items.sort((a, b) => b.favorite - a.favorite)
        default:
          return items
      }
    })

    // Count favorite objects
    const favoriteCount = computed(() => {
      return objects.value.filter(obj => obj.favorite).length
    })

    // Calculate average size
    const averageSize = computed(() => {
      if (objects.value.length === 0) return '0 KB'
      const total = objects.value.reduce((sum, obj) => sum + obj.size, 0)
      const avg = Math.round(total / objects.value.length)
      return `${avg} KB`
    })

    // ==================== METHODS ====================

    const toggleFavorite = (id) => {
      const obj = objects.value.find(o => o.id === id)
      if (obj) {
        obj.favorite = !obj.favorite
      }
    }

    const clearFilters = () => {
      searchQuery.value = ''
      selectedType.value = ''
      sortBy.value = 'name'
    }

    return {
      // State
      searchQuery,
      selectedType,
      sortBy,
      objects,

      // Computed
      uniqueTypes,
      filteredObjects,
      filteredAndSortedObjects,
      favoriteCount,
      averageSize,

      // Methods
      toggleFavorite,
      clearFilters
    }
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: white;
  padding: 40px 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.objects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.empty-state {
  background: white;
  padding: 60px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state p {
  font-size: 1.2rem;
  color: #999;
  margin-bottom: 20px;
}

.footer {
  background: white;
  padding: 20px;
  border-radius: 0 0 12px 12px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat .label {
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 4px;
}

.stat .value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #ddd;
  color: #333;
}

.btn-secondary:hover {
  background: #ccc;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }

  .objects-list {
    grid-template-columns: 1fr;
  }

  .footer {
    flex-direction: column;
  }
}
</style>
