<template>
  <div class="app">
    <header class="app-header">
      <h1>📋 Task Manager Pro</h1>
      <div class="header-actions">
        <div v-if="isSaving" class="save-indicator">
          💾 Saving...
        </div>
        <div v-else-if="showSaved" class="save-indicator saved">
          ✅ Saved
        </div>
      </div>
    </header>

    <div class="app-container">
      <!-- Sidebar: Projects -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Projects</h2>
          <button
            class="add-btn"
            @click="showProjectForm = !showProjectForm"
            :title="showProjectForm ? 'Cancel' : 'Add Project'"
          >
            {{ showProjectForm ? '×' : '+' }}
          </button>
        </div>

        <!-- Project Form -->
        <div v-if="showProjectForm" class="project-form">
          <input
            v-model="projectForm.formData.name"
            placeholder="Project name..."
            class="form-input"
            @keyup.enter="createProject"
          />
          <div class="color-picker">
            <div
              v-for="color in projectColors"
              :key="color"
              class="color-option"
              :class="{ selected: projectForm.formData.color === color }"
              :style="{ backgroundColor: color }"
              @click="projectForm.formData.color = color"
            ></div>
          </div>
          <div v-if="projectForm.errors.name" class="error-message">
            {{ projectForm.errors.name }}
          </div>
          <button @click="createProject" class="submit-btn">
            Create Project
          </button>
        </div>

        <!-- Projects List -->
        <div class="projects-list">
          <ProjectCard
            v-for="project in projects.data.value"
            :key="project.id"
            :project="project"
            :task-count="getProjectTaskCount(project.id)"
            :is-selected="selectedProjectId === project.id"
            @select="selectProject(project.id)"
            @delete="deleteProject(project.id)"
          />
        </div>

        <button
          v-if="selectedProjectId"
          @click="selectedProjectId = null"
          class="show-all-btn"
        >
          Show All Projects
        </button>
      </aside>

      <!-- Main Content: Tasks -->
      <main class="main-content">
        <!-- Filter Bar -->
        <FilterBar
          v-model="filters"
          v-model:searchQuery="searchQuery"
          :projects="projects.data.value"
          @clear="clearFilters"
        />

        <!-- Task Form (Create/Edit) -->
        <div v-if="showTaskForm" class="task-form-container">
          <div class="form-header">
            <h3>{{ editingTaskId ? 'Edit Task' : 'Create New Task' }}</h3>
            <button class="close-btn" @click="cancelTaskForm">×</button>
          </div>

          <div class="task-form">
            <div class="form-group">
              <label>Title *</label>
              <input
                v-model="taskForm.formData.title"
                placeholder="Task title..."
                class="form-input"
                @blur="validateTaskTitle"
              />
              <span v-if="taskForm.errors.title" class="error-message">
                {{ taskForm.errors.title }}
              </span>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea
                v-model="taskForm.formData.description"
                placeholder="Task description..."
                class="form-textarea"
                rows="3"
                @blur="validateTaskDescription"
              ></textarea>
              <span v-if="taskForm.errors.description" class="error-message">
                {{ taskForm.errors.description }}
              </span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Priority *</label>
                <select v-model="taskForm.formData.priority" class="form-select">
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>

              <div class="form-group">
                <label>Project *</label>
                <select v-model="taskForm.formData.projectId" class="form-select" @blur="validateTaskProject">
                  <option value="">Select project...</option>
                  <option v-for="project in projects.data.value" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
                <span v-if="taskForm.errors.projectId" class="error-message">
                  {{ taskForm.errors.projectId }}
                </span>
              </div>

              <div class="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  v-model="taskForm.formData.dueDate"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-actions">
              <button @click="saveTask" :disabled="taskForm.hasErrors" class="submit-btn">
                {{ editingTaskId ? 'Update Task' : 'Create Task' }}
              </button>
              <button @click="cancelTaskForm" class="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Add Task Button -->
        <button v-else @click="openTaskForm()" class="add-task-btn">
          + Add New Task
        </button>

        <!-- Tasks List -->
        <div class="tasks-section">
          <div class="tasks-header">
            <h2>Tasks</h2>
            <span class="task-count">{{ filteredTasks.length }} tasks</span>
          </div>

          <div v-if="filteredTasks.length === 0" class="empty-state">
            <p>{{ emptyStateMessage }}</p>
          </div>

          <div v-else class="tasks-list">
            <TaskCard
              v-for="task in filteredTasks"
              :key="task.id"
              :task="task"
              :project-name="getProjectName(task.projectId)"
              :project-color="getProjectColor(task.projectId)"
              @toggle-complete="toggleTaskComplete(task.id)"
              @edit="openTaskForm(task.id)"
              @delete="deleteTask(task.id)"
            />
          </div>
        </div>
      </main>

      <!-- Statistics Panel -->
      <aside class="stats-panel">
        <h2>Statistics</h2>

        <div class="stat-card">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Tasks</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ stats.completed }}</div>
          <div class="stat-label">Completed</div>
          <div class="stat-progress">
            <div
              class="stat-progress-bar"
              :style="{ width: stats.completionPercentage + '%' }"
            ></div>
          </div>
          <div class="stat-percentage">{{ stats.completionPercentage }}%</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ stats.active }}</div>
          <div class="stat-label">Active Tasks</div>
        </div>

        <div class="stat-divider"></div>

        <div class="stat-breakdown">
          <h3>By Priority</h3>
          <div class="stat-item">
            <span>🔴 High</span>
            <span class="stat-count">{{ stats.byPriority.high }}</span>
          </div>
          <div class="stat-item">
            <span>🟡 Medium</span>
            <span class="stat-count">{{ stats.byPriority.medium }}</span>
          </div>
          <div class="stat-item">
            <span>🟢 Low</span>
            <span class="stat-count">{{ stats.byPriority.low }}</span>
          </div>
        </div>

        <div v-if="stats.overdue > 0" class="stat-alert">
          <strong>⚠️ {{ stats.overdue }}</strong> overdue tasks
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useLocalStorage } from './composables/useLocalStorage'
import { useForm } from './composables/useForm'
import { useValidation } from './composables/useValidation'
import { useDebounce } from './composables/useDebounce'
import { sampleProjects, sampleTasks, generateId, projectColors } from './data/sampleData'
import ProjectCard from './components/ProjectCard.vue'
import TaskCard from './components/TaskCard.vue'
import FilterBar from './components/FilterBar.vue'

// State Management
const projects = useLocalStorage('taskManagerProjects', sampleProjects)
const tasks = useLocalStorage('taskManagerTasks', sampleTasks)

// UI State
const showProjectForm = ref(false)
const showTaskForm = ref(false)
const editingTaskId = ref(null)
const selectedProjectId = ref(null)
const isSaving = ref(false)
const showSaved = ref(false)

// Forms
const validation = useValidation()

const projectForm = useForm({
  name: '',
  color: projectColors[0]
})

const taskForm = useForm({
  title: '',
  description: '',
  priority: 'medium',
  projectId: '',
  dueDate: ''
})

// Filters
const filters = reactive({
  status: 'all',
  priority: 'all',
  projectId: ''
})

const searchQuery = ref('')
const debouncedSearch = useDebounce(searchQuery, 500)

// Auto-save indicator
watch([tasks.data, projects.data], () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    showSaved.value = true
    setTimeout(() => {
      showSaved.value = false
    }, 2000)
  }, 300)
}, { deep: true })

// Computed: Filtered Tasks
const filteredTasks = computed(() => {
  let result = tasks.data.value

  // Filter by status
  if (filters.status !== 'all') {
    result = result.filter(t => t.status === filters.status)
  }

  // Filter by priority
  if (filters.priority !== 'all') {
    result = result.filter(t => t.priority === filters.priority)
  }

  // Filter by project (from filters or sidebar selection)
  const projectFilter = filters.projectId || selectedProjectId.value
  if (projectFilter) {
    result = result.filter(t => t.projectId === projectFilter)
  }

  // Search filter (debounced)
  if (debouncedSearch.value) {
    const query = debouncedSearch.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  }

  // Sort by: incomplete first, then by priority, then by due date
  return result.sort((a, b) => {
    // Incomplete tasks first
    if (a.status !== b.status) {
      return a.status === 'active' ? -1 : 1
    }

    // Then by priority (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }

    // Then by due date (soonest first, null last)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1

    return 0
  })
})

// Computed: Statistics
const stats = computed(() => {
  const total = tasks.data.value.length
  const completed = tasks.data.value.filter(t => t.status === 'completed').length
  const active = total - completed

  const byPriority = {
    high: tasks.data.value.filter(t => t.priority === 'high' && t.status === 'active').length,
    medium: tasks.data.value.filter(t => t.priority === 'medium' && t.status === 'active').length,
    low: tasks.data.value.filter(t => t.priority === 'low' && t.status === 'active').length
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdue = tasks.data.value.filter(t => {
    if (t.status === 'completed' || !t.dueDate) return false
    return new Date(t.dueDate) < today
  }).length

  return {
    total,
    completed,
    active,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    byPriority,
    overdue
  }
})

const emptyStateMessage = computed(() => {
  if (searchQuery.value) return `No tasks found matching "${searchQuery.value}"`
  if (filters.status !== 'all' || filters.priority !== 'all' || filters.projectId) {
    return 'No tasks match the current filters'
  }
  if (selectedProjectId.value) return 'No tasks in this project yet'
  return 'No tasks yet. Create your first task!'
})

// Project Functions
function createProject() {
  // Validate
  const nameError = validation.validate(projectForm.formData.name, [
    (v) => validation.required(v, 'Project name'),
    (v) => validation.minLength(v, 2, 'Project name'),
    (v) => validation.maxLength(v, 50, 'Project name')
  ])

  projectForm.setFieldError('name', nameError)

  if (nameError) return

  // Create project
  const newProject = {
    id: generateId('proj'),
    name: projectForm.formData.name,
    color: projectForm.formData.color,
    createdAt: Date.now()
  }

  projects.data.value.push(newProject)

  // Reset form
  projectForm.resetForm()
  projectForm.formData.color = projectColors[0]
  showProjectForm.value = false
}

function deleteProject(projectId) {
  if (!confirm('Delete this project? Tasks in this project will also be deleted.')) return

  projects.data.value = projects.data.value.filter(p => p.id !== projectId)
  tasks.data.value = tasks.data.value.filter(t => t.projectId !== projectId)

  if (selectedProjectId.value === projectId) {
    selectedProjectId.value = null
  }
}

function selectProject(projectId) {
  selectedProjectId.value = selectedProjectId.value === projectId ? null : projectId
}

function getProjectName(projectId) {
  return projects.data.value.find(p => p.id === projectId)?.name || 'Unknown'
}

function getProjectColor(projectId) {
  return projects.data.value.find(p => p.id === projectId)?.color || '#999'
}

function getProjectTaskCount(projectId) {
  return tasks.data.value.filter(t => t.projectId === projectId).length
}

// Task Functions
function validateTaskTitle() {
  const error = validation.validate(taskForm.formData.title, [
    (v) => validation.required(v, 'Title'),
    (v) => validation.minLength(v, 3, 'Title'),
    (v) => validation.maxLength(v, 100, 'Title')
  ])
  taskForm.setFieldError('title', error)
}

function validateTaskDescription() {
  const error = validation.maxLength(taskForm.formData.description, 500, 'Description')
  taskForm.setFieldError('description', error)
}

function validateTaskProject() {
  const error = validation.required(taskForm.formData.projectId, 'Project')
  taskForm.setFieldError('projectId', error)
}

function openTaskForm(taskId = null) {
  editingTaskId.value = taskId

  if (taskId) {
    // Edit mode - populate form
    const task = tasks.data.value.find(t => t.id === taskId)
    if (task) {
      taskForm.formData.title = task.title
      taskForm.formData.description = task.description
      taskForm.formData.priority = task.priority
      taskForm.formData.projectId = task.projectId
      taskForm.formData.dueDate = task.dueDate || ''
    }
  } else {
    // Create mode - reset form
    taskForm.resetForm()
    taskForm.formData.priority = 'medium'

    // Pre-select project if one is selected
    if (selectedProjectId.value) {
      taskForm.formData.projectId = selectedProjectId.value
    }
  }

  showTaskForm.value = true
}

function cancelTaskForm() {
  showTaskForm.value = false
  editingTaskId.value = null
  taskForm.resetForm()
}

function saveTask() {
  // Validate all fields
  validateTaskTitle()
  validateTaskDescription()
  validateTaskProject()

  if (taskForm.hasErrors) return

  if (editingTaskId.value) {
    // Update existing task
    const task = tasks.data.value.find(t => t.id === editingTaskId.value)
    if (task) {
      task.title = taskForm.formData.title
      task.description = taskForm.formData.description
      task.priority = taskForm.formData.priority
      task.projectId = taskForm.formData.projectId
      task.dueDate = taskForm.formData.dueDate || null
    }
  } else {
    // Create new task
    const newTask = {
      id: generateId('task'),
      title: taskForm.formData.title,
      description: taskForm.formData.description,
      priority: taskForm.formData.priority,
      status: 'active',
      projectId: taskForm.formData.projectId,
      dueDate: taskForm.formData.dueDate || null,
      createdAt: Date.now(),
      completedAt: null
    }

    tasks.data.value.push(newTask)
  }

  cancelTaskForm()
}

function toggleTaskComplete(taskId) {
  const task = tasks.data.value.find(t => t.id === taskId)
  if (!task) return

  if (task.status === 'active') {
    task.status = 'completed'
    task.completedAt = Date.now()
  } else {
    task.status = 'active'
    task.completedAt = null
  }
}

function deleteTask(taskId) {
  if (!confirm('Delete this task?')) return

  tasks.data.value = tasks.data.value.filter(t => t.id !== taskId)
}

// Filter Functions
function clearFilters() {
  filters.status = 'all'
  filters.priority = 'all'
  filters.projectId = ''
  searchQuery.value = ''
  selectedProjectId.value = null
}
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

.header-actions {
  min-width: 120px;
  text-align: right;
}

.save-indicator {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  display: inline-block;
}

.save-indicator.saved {
  background: rgba(76, 175, 80, 0.3);
}

.app-container {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 20px;
  padding: 20px;
  max-width: 1800px;
  margin: 0 auto;
}

/* Sidebar: Projects */
.sidebar {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar h2 {
  font-size: 1.2rem;
  color: #333;
}

.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #667eea;
  color: white;
}

.project-form {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.color-picker {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin: 10px 0;
}

.color-option {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
  border: 3px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #333;
  transform: scale(1.15);
}

.projects-list {
  margin-bottom: 15px;
}

.show-all-btn {
  width: 100%;
  padding: 10px;
  background: #f0f0f0;
  border: 2px dashed #ddd;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.show-all-btn:hover {
  background: #e7f3ff;
  border-color: #667eea;
  color: #667eea;
}

/* Main Content */
.main-content {
  background: white;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 600px;
}

.task-form-container {
  background: #f9f9f9;
  border: 2px solid #667eea;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-header h3 {
  color: #333;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #fee;
  color: #dc3545;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.form-input,
.form-textarea,
.form-select {
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.submit-btn {
  flex: 1;
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  padding: 12px 24px;
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  border-color: #dc3545;
  color: #dc3545;
}

.add-task-btn {
  width: 100%;
  padding: 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s;
}

.add-task-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tasks-section {
  margin-top: 24px;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tasks-header h2 {
  font-size: 1.4rem;
  color: #333;
}

.task-count {
  background: #f0f0f0;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.1rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 4px;
}

/* Stats Panel */
.stats-panel {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-panel h2 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 4px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-progress {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-top: 12px;
  overflow: hidden;
}

.stat-progress-bar {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.stat-percentage {
  margin-top: 8px;
  font-size: 1.1rem;
  font-weight: 600;
}

.stat-divider {
  height: 2px;
  background: #f0f0f0;
  margin: 8px 0;
}

.stat-breakdown h3 {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-count {
  font-weight: 600;
  color: #667eea;
}

.stat-alert {
  background: #fee;
  color: #dc3545;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 1400px) {
  .app-container {
    grid-template-columns: 250px 1fr 280px;
  }
}

@media (max-width: 1200px) {
  .app-container {
    grid-template-columns: 1fr;
  }

  .sidebar,
  .stats-panel {
    position: relative;
    top: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 16px 20px;
  }

  .app-header h1 {
    font-size: 1.4rem;
  }

  .app-container {
    padding: 12px;
  }
}
</style>
