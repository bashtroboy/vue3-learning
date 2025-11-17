<template>
  <div class="async-data">
    <h4>User Profile</h4>
    <div class="user-card">
      <div class="avatar">{{ user.name.charAt(0) }}</div>
      <div class="user-info">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref(null)

// Simulate async data fetch
await new Promise(resolve => setTimeout(resolve, 1000))

user.value = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Developer'
}
</script>

<style scoped>
.async-data {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.user-info p {
  margin: 5px 0;
}
</style>
