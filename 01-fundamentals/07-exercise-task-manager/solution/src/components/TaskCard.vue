<template>
  <div
    class="task-card"
    :class="{ completed: task.status === 'completed', overdue: isOverdue }"
    :style="{ borderLeftColor: priorityColor }"
  >
    <div class="task-header">
      <label class="checkbox-container">
        <input
          type="checkbox"
          :checked="task.status === 'completed'"
          @change="$emit('toggle-complete')"
        />
        <span class="checkmark"></span>
      </label>

      <div class="task-main">
        <h3 class="task-title">{{ task.title }}</h3>
        <p v-if="task.description" class="task-description">
          {{ task.description }}
        </p>
      </div>
    </div>

    <div class="task-meta">
      <div class="task-tags">
        <span class="priority-badge" :class="`priority-${task.priority}`">
          {{ priorityConfig[task.priority].icon }}
          {{ priorityConfig[task.priority].label }}
        </span>

        <span v-if="task.dueDate" class="due-date" :class="{ overdue: isOverdue }">
          📅 {{ formattedDueDate }}
        </span>

        <span class="project-name" :style="{ color: projectColor }">
          {{ projectName }}
        </span>
      </div>

      <div class="task-actions">
        <button
          class="action-btn edit-btn"
          @click="$emit('edit')"
          title="Edit task"
        >
          ✏️
        </button>
        <button
          class="action-btn delete-btn"
          @click="$emit('delete')"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { priorityConfig } from '../data/sampleData'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  projectName: {
    type: String,
    default: 'Unknown'
  },
  projectColor: {
    type: String,
    default: '#999'
  }
})

defineEmits(['toggle-complete', 'edit', 'delete'])

const priorityColor = computed(() => priorityConfig[props.task.priority].color)

const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return ''

  const date = new Date(props.task.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(props.task.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays <= 7) return `${diffDays}d`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 'completed') return false

  const dueDate = new Date(props.task.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return dueDate < today
})
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-card.completed {
  opacity: 0.7;
  background: #f9f9f9;
}

.task-card.overdue {
  border-left-color: #dc3545;
}

.task-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  position: relative;
  padding-top: 2px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 22px;
  height: 22px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
}

.checkbox-container:hover .checkmark {
  border-color: #667eea;
}

.checkbox-container input:checked ~ .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-container input:checked ~ .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.task-main {
  flex: 1;
}

.task-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.4;
}

.completed .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.task-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-high {
  background: #fee;
  color: #dc3545;
}

.priority-medium {
  background: #fff8e1;
  color: #f57c00;
}

.priority-low {
  background: #e8f5e9;
  color: #28a745;
}

.due-date {
  font-size: 0.85rem;
  color: #666;
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 6px;
}

.due-date.overdue {
  background: #fee;
  color: #dc3545;
  font-weight: 600;
}

.project-name {
  font-size: 0.85rem;
  font-weight: 600;
}

.task-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.delete-btn:hover {
  background: #fee;
}
</style>
