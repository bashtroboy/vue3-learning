<template>
  <div class="node-card">
    <div class="node-icon">
      {{ node.type === 'folder' ? '📁' : '📄' }}
    </div>

    <div class="node-content">
      <h3 class="node-name">{{ node.name }}</h3>
      <p class="node-description">{{ node.description }}</p>

      <div class="node-meta">
        <span class="meta-item">
          <strong>Type:</strong> {{ node.type }}
        </span>
        <span class="meta-item">
          <strong>Owner:</strong> {{ node.owner }}
        </span>
        <span class="meta-item">
          <strong>Created:</strong> {{ node.created }}
        </span>
        <span v-if="node.size" class="meta-item">
          <strong>Size:</strong> {{ node.size }}
        </span>
      </div>

      <div class="node-actions">
        <router-link
          :to="{ name: 'node-detail', params: { id: node.id } }"
          class="btn"
        >
          View Details
        </router-link>
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
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  gap: 1rem;
}

.node-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.node-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.node-content {
  flex: 1;
}

.node-name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.node-description {
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.node-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.meta-item {
  display: inline-block;
}

.meta-item strong {
  color: #2c3e50;
}

.node-actions {
  margin-top: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-size: 0.9rem;
}

.btn:hover {
  background-color: #359268;
}
</style>
