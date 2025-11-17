<template>
  <div class="favorites-page">
    <h1>My Favorites</h1>

    <div v-if="favoriteNodes.length === 0" class="empty-state">
      <p>No favorites yet. Start by adding nodes to your favorites!</p>
      <router-link to="/" class="action-btn">
        Browse Nodes
      </router-link>
    </div>

    <div v-else>
      <div class="favorites-header">
        <p class="count">{{ favoriteCount }} favorite{{ favoriteCount !== 1 ? 's' : '' }}</p>
        <button @click="confirmClearFavorites" class="clear-btn">
          Clear All Favorites
        </button>
      </div>

      <div class="favorites-grid">
        <router-link
          v-for="node in favoriteNodes"
          :key="node.id"
          :to="{ name: 'node-detail', params: { id: node.id } }"
          class="favorite-link"
        >
          <NodeCard :node="node" :show-favorite="true" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'
import { useContentServerStore } from '@/stores/contentServer'
import { useNodeCache } from '@/composables/useNodeCache'
import NodeCard from '@/components/NodeCard.vue'

const favoritesStore = useFavoritesStore()
const contentStore = useContentServerStore()

const { favoriteIds, favoriteCount } = storeToRefs(favoritesStore)
const { nodes } = storeToRefs(contentStore)
const { loadNodes } = useNodeCache()

// Load nodes if not already loaded
if (contentStore.nodeCount === 0) {
  loadNodes()
}

const favoriteNodes = computed(() => {
  return nodes.value.filter(node => favoriteIds.value.includes(node.id))
})

function confirmClearFavorites() {
  if (confirm('Are you sure you want to clear all favorites?')) {
    favoritesStore.clearFavorites()
  }
}
</script>

<style scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin: 0 0 2rem 0;
  color: var(--text-primary);
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.action-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #2563eb;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.count {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.clear-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ef4444;
  background: transparent;
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #ef4444;
  color: white;
}

.favorites-grid {
  display: grid;
  gap: 1rem;
}

.favorite-link {
  text-decoration: none;
  color: inherit;
}
</style>
