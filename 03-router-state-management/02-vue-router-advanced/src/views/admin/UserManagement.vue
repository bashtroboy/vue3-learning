<template>
  <div class="user-management">
    <div class="page-header">
      <h1>User Management</h1>
      <button class="btn">+ Add New User</button>
    </div>

    <div class="users-table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" :class="`badge-${user.role}`">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span
                class="badge"
                :class="user.status === 'active' ? 'badge-success' : 'badge-danger'"
              >
                {{ user.status }}
              </span>
            </td>
            <td>{{ user.lastLogin }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-small">Edit</button>
                <button class="btn btn-small btn-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="stats">
      <div class="stat-item">
        <strong>Total Users:</strong> {{ users.length }}
      </div>
      <div class="stat-item">
        <strong>Active:</strong> {{ activeUsers }}
      </div>
      <div class="stat-item">
        <strong>Inactive:</strong> {{ inactiveUsers }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { mockUsers } from '../../data/mockUsers'

const users = mockUsers

const activeUsers = computed(() =>
  users.filter(u => u.status === 'active').length
)

const inactiveUsers = computed(() =>
  users.filter(u => u.status === 'inactive').length
)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  margin: 0;
}

.users-table-container {
  overflow-x: auto;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.badge-admin {
  background-color: #dc3545;
}

.badge-user {
  background-color: #17a2b8;
}

.badge-moderator {
  background-color: #ffc107;
  color: #333;
}

.stats {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  color: #666;
}

.stat-item strong {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
