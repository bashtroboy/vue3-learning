<template>
  <div
    class="project-card"
    :class="{ active: isSelected }"
    @click="$emit('select')"
  >
    <div class="project-info">
      <div class="color-indicator" :style="{ backgroundColor: project.color }"></div>
      <div class="project-details">
        <h3>{{ project.name }}</h3>
        <span class="task-count">{{ taskCount }} tasks</span>
      </div>
    </div>
    <button
      class="delete-btn"
      @click.stop="$emit('delete')"
      title="Delete project"
    >
      ×
    </button>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  },
  taskCount: {
    type: Number,
    default: 0
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select', 'delete'])
</script>

<style scoped>
.project-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s;
}

.project-card:hover {
  background: #f0f0f0;
  transform: translateX(4px);
}

.project-card.active {
  background: #e7f3ff;
  border-left: 4px solid #667eea;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.color-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-details h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.task-count {
  font-size: 0.8rem;
  color: #999;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  opacity: 0;
}

.project-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #fee;
  color: #dc3545;
}
</style>
