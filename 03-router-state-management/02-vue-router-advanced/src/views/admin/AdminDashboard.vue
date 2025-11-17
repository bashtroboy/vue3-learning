<template>
  <div class="admin-dashboard">
    <h1>Dashboard</h1>
    <p class="subtitle">Welcome to the admin dashboard</p>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalUsers }}</div>
          <div class="stat-label">Total Users</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ activeUsers }}</div>
          <div class="stat-label">Active Users</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalReports }}</div>
          <div class="stat-label">Reports Generated</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🔐</div>
        <div class="stat-content">
          <div class="stat-value">{{ currentUser?.role }}</div>
          <div class="stat-label">Your Role</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-section">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <router-link to="/admin/users" class="btn">
            👥 Manage Users
          </router-link>
          <router-link to="/admin/reports" class="btn">
            📈 View Reports
          </router-link>
          <router-link to="/admin/settings" class="btn">
            ⚙️ Settings
          </router-link>
        </div>
      </div>

      <div class="dashboard-section">
        <h2>Recent Activity</h2>
        <ul class="activity-list">
          <li class="activity-item">
            <span class="activity-icon">👤</span>
            <span class="activity-text">User "johndoe" logged in</span>
            <span class="activity-time">2 hours ago</span>
          </li>
          <li class="activity-item">
            <span class="activity-icon">📊</span>
            <span class="activity-text">Report "Monthly Activity" generated</span>
            <span class="activity-time">3 hours ago</span>
          </li>
          <li class="activity-item">
            <span class="activity-icon">⚙️</span>
            <span class="activity-text">Settings updated</span>
            <span class="activity-time">5 hours ago</span>
          </li>
          <li class="activity-item">
            <span class="activity-icon">✅</span>
            <span class="activity-text">User "alicejohnson" activated</span>
            <span class="activity-time">1 day ago</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="permissions-section">
      <h2>Your Permissions</h2>
      <div class="permissions-grid">
        <span
          v-for="permission in currentUser?.permissions"
          :key="permission"
          class="permission-badge"
        >
          ✓ {{ permission }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authService } from '../../services/auth'
import { mockUsers, mockReports } from '../../data/mockUsers'

const currentUser = computed(() => authService.getUser())
const totalUsers = computed(() => mockUsers.length)
const activeUsers = computed(() => mockUsers.filter(u => u.status === 'active').length)
const totalReports = computed(() => mockReports.length)
</script>

<style scoped>
h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.dashboard-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.dashboard-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.activity-icon {
  font-size: 1.5rem;
}

.activity-text {
  flex: 1;
  color: #666;
}

.activity-time {
  color: #999;
  font-size: 0.85rem;
}

.permissions-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.permissions-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.permission-badge {
  background: white;
  color: #42b983;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 2px solid #42b983;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
