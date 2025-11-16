<template>
  <div class="app">
    <!--
      TODO: Build your Task Manager here!

      Suggested structure:
      1. Header with app title and save indicator
      2. Sidebar with projects
      3. Main content area with filters and tasks
      4. Statistics panel
    -->

    <header class="app-header">
      <h1>📋 Task Manager Pro</h1>
      <div class="save-indicator" v-if="isSaving">
        💾 Saving...
      </div>
    </header>

    <div class="app-container">
      <!-- TODO: Add your components here -->

      <aside class="sidebar">
        <h2>Projects</h2>
        <p class="hint">Create ProjectList component here</p>
        <!-- ProjectList component will go here -->
      </aside>

      <main class="main-content">
        <div class="filters">
          <p class="hint">Create FilterBar component here</p>
          <!-- FilterBar component will go here -->
        </div>

        <div class="task-section">
          <h2>Tasks</h2>
          <p class="hint">Create TaskList and TaskCard components here</p>
          <!-- TaskList component will go here -->
        </div>
      </main>

      <aside class="stats-panel">
        <h2>Statistics</h2>
        <p class="hint">Display statistics here</p>
        <!-- Statistics will go here -->
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLocalStorage } from './composables/useLocalStorage'
import { sampleProjects, sampleTasks } from './data/sampleData'

// TODO: Initialize state with useLocalStorage
// Hint: const projects = useLocalStorage('projects', sampleProjects)

// TODO: Setup save indicator
const isSaving = ref(false)

// TODO: Watch for changes and show save indicator
// Hint: watch([projects.data, tasks.data], () => { ... }, { deep: true })

// TODO: Create composables for forms
// const projectForm = useForm({ name: '', color: '#667eea' })
// const taskForm = useForm({ ... })

// TODO: Create filter state
// const filters = reactive({ status: 'all', priority: 'all', projectId: null })
// const searchQuery = ref('')
// const debouncedSearch = useDebounce(searchQuery, 500)

// TODO: Create computed for filtered tasks
// const filteredTasks = computed(() => { ... })

// TODO: Create functions for CRUD operations
// function createProject(projectData) { ... }
// function deleteProject(projectId) { ... }
// function createTask(taskData) { ... }
// function updateTask(taskId, updates) { ... }
// function deleteTask(taskId) { ... }
// function toggleTaskComplete(taskId) { ... }

// TODO: Create computed for statistics
// const stats = computed(() => ({ ... }))
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
}

.save-indicator {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.app-container {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 20px;
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.sidebar {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.sidebar h2 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
}

.main-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.filters {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.task-section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.4rem;
}

.stats-panel {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.stats-panel h2 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
}

.hint {
  color: #999;
  font-style: italic;
  padding: 40px 20px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

/* Responsive layout */
@media (max-width: 1200px) {
  .app-container {
    grid-template-columns: 1fr;
  }

  .sidebar,
  .stats-panel {
    position: relative;
    top: 0;
  }
}
</style>
