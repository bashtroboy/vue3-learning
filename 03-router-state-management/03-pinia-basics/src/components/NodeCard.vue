<template>
  <div class="node-card" :class="`node-card--${node.type}`">
    <div class="node-card__icon">
      {{ node.type === 'folder' ? '📁' : '📄' }}
    </div>
    <div class="node-card__content">
      <h3 class="node-card__name">{{ node.name }}</h3>
      <p class="node-card__description">{{ node.description }}</p>
      <div class="node-card__meta">
        <span class="node-card__owner">👤 {{ node.owner }}</span>
        <span class="node-card__date">📅 {{ node.created }}</span>
        <span v-if="node.size" class="node-card__size">💾 {{ node.size }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.node-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--card-bg);
}

.node-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.node-card--folder {
  border-left: 3px solid #3b82f6;
}

.node-card--document {
  border-left: 3px solid #10b981;
}

.node-card__icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
}

.node-card__content {
  flex: 1;
  min-width: 0;
}

.node-card__name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-card__description {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-card__meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.node-card__meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
