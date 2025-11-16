<template>
  <div class="user-profile">
    <div v-if="user.isAuthenticated" class="user-info">
      <div class="avatar">{{ user.name.charAt(0) }}</div>
      <div class="details">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <span class="role">{{ user.role }}</span>
      </div>
    </div>
    <div v-else class="not-authenticated">
      <p>👤 Not logged in</p>
      <p class="hint">Click "Login" button above to authenticate</p>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// Inject user from App.vue
const user = inject('user')
</script>

<style scoped>
.user-profile {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 20px 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
}

.details h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.details p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.role {
  display: inline-block;
  padding: 4px 12px;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.not-authenticated {
  text-align: center;
  padding: 20px;
  color: #999;
}

.not-authenticated p {
  margin: 5px 0;
}

.hint {
  font-size: 0.85rem;
  font-style: italic;
}
</style>
