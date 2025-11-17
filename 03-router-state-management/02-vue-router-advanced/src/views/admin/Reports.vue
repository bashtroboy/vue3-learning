<template>
  <div class="reports">
    <h1>Reports</h1>
    <p class="subtitle">View and generate system reports</p>

    <div class="reports-grid">
      <div v-for="report in reports" :key="report.id" class="report-card">
        <div class="report-header">
          <h3>{{ report.title }}</h3>
          <span class="badge" :class="`badge-${report.type}`">
            {{ report.type }}
          </span>
        </div>
        <div class="report-meta">
          <div class="meta-item">
            <strong>Generated:</strong> {{ report.generated }}
          </div>
          <div class="meta-item">
            <strong>Status:</strong>
            <span
              class="badge"
              :class="report.status === 'completed' ? 'badge-success' : 'badge-warning'"
            >
              {{ report.status }}
            </span>
          </div>
        </div>
        <div class="report-actions">
          <button class="btn btn-small">📥 Download</button>
          <button class="btn btn-small btn-secondary">👁️ View</button>
        </div>
      </div>
    </div>

    <div class="generate-section">
      <h2>Generate New Report</h2>
      <div class="form-group">
        <label for="reportType" class="form-label">Report Type</label>
        <select id="reportType" class="form-input">
          <option>Usage Report</option>
          <option>Security Audit</option>
          <option>Performance Report</option>
          <option>Analytics Report</option>
        </select>
      </div>
      <div class="form-group">
        <label for="dateRange" class="form-label">Date Range</label>
        <select id="dateRange" class="form-input">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Custom Range</option>
        </select>
      </div>
      <button class="btn">Generate Report</button>
    </div>
  </div>
</template>

<script setup>
import { mockReports } from '../../data/mockUsers'

const reports = mockReports
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

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.report-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #42b983;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.report-header h3 {
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 0;
  flex: 1;
}

.badge-usage {
  background-color: #17a2b8;
}

.badge-security {
  background-color: #dc3545;
}

.badge-performance {
  background-color: #ffc107;
  color: #333;
}

.badge-analytics {
  background-color: #28a745;
}

.report-meta {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.meta-item {
  margin-bottom: 0.5rem;
}

.meta-item strong {
  color: #2c3e50;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.generate-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  border: 2px dashed #ddd;
}

.generate-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }

  .report-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
