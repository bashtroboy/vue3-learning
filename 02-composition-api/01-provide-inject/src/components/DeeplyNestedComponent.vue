<template>
  <div class="deeply-nested">
    <p>
      This component is deeply nested in the tree, yet it can inject user data
      without passing props through every parent!
    </p>
    <div v-if="user.isAuthenticated" class="user-status">
      ✅ User <strong>{{ user.name }}</strong> is authenticated
    </div>
    <div v-else class="user-status">
      ❌ No user authenticated
    </div>
    <p class="info">
      User data was injected, not passed via props. This avoids "prop drilling".
    </p>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// Inject user - no matter how deep in the component tree
const user = inject('user')
</script>

<style scoped>
.deeply-nested {
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 2px dashed #667eea;
}

.user-status {
  margin: 10px 0;
  padding: 10px;
  background: #e7f3ff;
  border-radius: 4px;
  font-size: 0.95rem;
}

.info {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}
</style>
