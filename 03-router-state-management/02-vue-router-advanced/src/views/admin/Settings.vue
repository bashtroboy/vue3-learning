<template>
  <div class="settings">
    <h1>Settings</h1>
    <p class="subtitle">Configure your application settings</p>

    <div class="settings-sections">
      <section class="settings-section">
        <h2>General Settings</h2>
        <div class="setting-item">
          <label for="siteName" class="form-label">Site Name</label>
          <input
            id="siteName"
            type="text"
            class="form-input"
            value="Admin Dashboard"
          />
        </div>
        <div class="setting-item">
          <label for="siteUrl" class="form-label">Site URL</label>
          <input
            id="siteUrl"
            type="url"
            class="form-input"
            value="https://example.com"
          />
        </div>
        <div class="setting-item">
          <label for="timezone" class="form-label">Timezone</label>
          <select id="timezone" class="form-input">
            <option>UTC</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
            <option>Asia/Tokyo</option>
          </select>
        </div>
      </section>

      <section class="settings-section">
        <h2>Security Settings</h2>
        <div class="setting-item">
          <label class="checkbox-label">
            <input type="checkbox" checked />
            <span>Enable two-factor authentication</span>
          </label>
        </div>
        <div class="setting-item">
          <label class="checkbox-label">
            <input type="checkbox" checked />
            <span>Require strong passwords</span>
          </label>
        </div>
        <div class="setting-item">
          <label class="checkbox-label">
            <input type="checkbox" />
            <span>Log all authentication attempts</span>
          </label>
        </div>
        <div class="setting-item">
          <label for="sessionTimeout" class="form-label">Session Timeout (minutes)</label>
          <input
            id="sessionTimeout"
            type="number"
            class="form-input"
            value="30"
            min="5"
            max="120"
          />
        </div>
      </section>

      <section class="settings-section">
        <h2>Notification Settings</h2>
        <div class="setting-item">
          <label class="checkbox-label">
            <input type="checkbox" checked />
            <span>Email notifications</span>
          </label>
        </div>
        <div class="setting-item">
          <label class="checkbox-label">
            <input type="checkbox" checked />
            <span>Browser notifications</span>
          </label>
        </div>
        <div class="setting-item">
          <label class="checkbox-label">
            <input type="checkbox" />
            <span>SMS notifications</span>
          </label>
        </div>
      </section>

      <section class="settings-section">
        <h2>Display Settings</h2>
        <div class="setting-item">
          <label for="theme" class="form-label">Theme</label>
          <select id="theme" class="form-input">
            <option>Light</option>
            <option>Dark</option>
            <option>Auto</option>
          </select>
        </div>
        <div class="setting-item">
          <label for="itemsPerPage" class="form-label">Items Per Page</label>
          <select id="itemsPerPage" class="form-input">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </section>
    </div>

    <div class="action-buttons">
      <button class="btn">Save Changes</button>
      <button class="btn btn-secondary">Reset to Defaults</button>
    </div>
  </div>
</template>

<script setup>
// No script needed for this demo
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

.settings-sections {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.settings-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.settings-section h2 {
  color: #2c3e50;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #42b983;
}

.setting-item {
  margin-bottom: 1.25rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
}
</style>
