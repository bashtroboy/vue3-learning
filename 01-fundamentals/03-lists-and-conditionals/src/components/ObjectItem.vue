<template>
  <div class="card" :class="{ 'is-favorite': object.favorite }">
    <!-- Header with favorite button -->
    <div class="card-header">
      <div>
        <h3 class="title">{{ object.name }}</h3>
        <span class="badge" :class="`badge-${object.type.toLowerCase()}`">
          {{ object.type }}
        </span>
      </div>
      <button
        class="favorite-btn"
        :aria-label="`${object.favorite ? 'Remove from' : 'Add to'} favorites`"
        @click="$emit('toggle-favorite', object.id)"
      >
        <span v-if="object.favorite" class="star-icon">★</span>
        <span v-else class="star-icon">☆</span>
      </button>
    </div>

    <!-- Body with details -->
    <div class="card-body">
      <div class="detail">
        <span class="label">ID:</span>
        <span class="value">{{ object.id }}</span>
      </div>

      <div class="detail">
        <span class="label">Size:</span>
        <span class="value">{{ object.size }} KB</span>
      </div>

      <div class="detail">
        <span class="label">Modified:</span>
        <span class="value">{{ formatDate(object.modified) }}</span>
      </div>

      <!-- Show age status using conditional -->
      <div class="detail">
        <span class="label">Status:</span>
        <span v-if="isRecent" class="badge badge-recent">Recent</span>
        <span v-else-if="isModerateAge" class="badge badge-moderate">Moderate</span>
        <span v-else class="badge badge-old">Old</span>
      </div>

      <!-- Show size category using conditional -->
      <div class="detail">
        <span class="label">Size Category:</span>
        <span v-if="object.size > 5000" class="badge badge-large">Large</span>
        <span v-else-if="object.size > 2000" class="badge badge-medium">Medium</span>
        <span v-else class="badge badge-small">Small</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    object: {
      type: Object,
      required: true
    }
  },

  emits: ['toggle-favorite'],

  setup(props) {
    // Computed properties for conditional display
    const isRecent = computed(() => {
      const days = getDaysSinceModified(props.object.modified)
      return days <= 7
    })

    const isModerateAge = computed(() => {
      const days = getDaysSinceModified(props.object.modified)
      return days > 7 && days <= 30
    })

    const getDaysSinceModified = (dateStr) => {
      const modDate = new Date(dateStr)
      const now = new Date()
      const diffTime = Math.abs(now - modDate)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString('en-US', options)
    }

    return {
      isRecent,
      isModerateAge,
      formatDate
    }
  }
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card.is-favorite {
  border-color: #ffd700;
  background: linear-gradient(135deg, #ffffff 0%, #fffacd 100%);
}

.card-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.title {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  word-break: break-word;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 6px;
}

.badge-folder {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-document {
  background: #f3e5f5;
  color: #7b1fa2;
}

.badge-recent {
  background: #c8e6c9;
  color: #2e7d32;
}

.badge-moderate {
  background: #fff9c4;
  color: #f57f17;
}

.badge-old {
  background: #ffccbc;
  color: #d84315;
}

.badge-small {
  background: #b3e5fc;
  color: #01579b;
}

.badge-medium {
  background: #ffe0b2;
  color: #e65100;
}

.badge-large {
  background: #ffccbc;
  color: #bf360c;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 1.5rem;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.2);
}

.star-icon {
  color: #ffd700;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.value {
  color: #333;
  word-break: break-word;
}
</style>
