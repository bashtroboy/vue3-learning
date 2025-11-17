<template>
  <div class="about">
    <div class="about-card">
      <h1>About This Demo</h1>

      <section class="section">
        <h2>🎯 Purpose</h2>
        <p>
          This is a demonstration application for learning Vue Router basics.
          It showcases fundamental routing concepts including:
        </p>
        <ul>
          <li>Basic route configuration</li>
          <li>Dynamic routes with parameters (<code>:id</code>)</li>
          <li>Query parameters for search</li>
          <li>Programmatic navigation</li>
          <li>Router links and navigation</li>
        </ul>
      </section>

      <section class="section">
        <h2>📚 Features</h2>
        <ul>
          <li><strong>Home Page:</strong> Browse all nodes with type filtering</li>
          <li><strong>Node Detail:</strong> View detailed information about each node</li>
          <li><strong>Search:</strong> Search nodes with query parameters in URL</li>
          <li><strong>Breadcrumbs:</strong> Navigate hierarchical structure</li>
          <li><strong>Mock Data:</strong> Uses mock Content Server data</li>
        </ul>
      </section>

      <section class="section">
        <h2>🛠️ Technologies</h2>
        <div class="tech-list">
          <span class="tech-badge">Vue 3</span>
          <span class="tech-badge">Vue Router 4</span>
          <span class="tech-badge">Composition API</span>
          <span class="tech-badge">Vite</span>
        </div>
      </section>

      <section class="section">
        <h2>📖 Learning Resources</h2>
        <p>To learn more about Vue Router, check out these resources:</p>
        <ul>
          <li>
            <a href="https://router.vuejs.org/" target="_blank" rel="noopener">
              Vue Router Official Documentation
            </a>
          </li>
          <li>
            <a href="https://vuejs.org/" target="_blank" rel="noopener">
              Vue.js Official Documentation
            </a>
          </li>
          <li>Check the README.md and NOTES.md files in this lesson folder</li>
        </ul>
      </section>

      <section class="section">
        <h2>🚀 Next Steps</h2>
        <p>After mastering the basics, explore:</p>
        <ul>
          <li>Navigation guards for authentication</li>
          <li>Nested routes for complex layouts</li>
          <li>Lazy loading for better performance</li>
          <li>Route transitions and animations</li>
        </ul>
      </section>

      <div class="action-center">
        <router-link to="/" class="btn">
          🏠 Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for this static page
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.about-card {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about-card h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.section {
  margin-bottom: 2.5rem;
}

.section h2 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.section p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.section ul {
  color: #666;
  line-height: 1.8;
  margin-left: 1.5rem;
}

.section li {
  margin-bottom: 0.5rem;
}

.section code {
  background-color: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #e74c3c;
}

.section strong {
  color: #2c3e50;
}

.section a {
  color: #42b983;
  text-decoration: none;
}

.section a:hover {
  text-decoration: underline;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.tech-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.action-center {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #359268;
}

@media (max-width: 768px) {
  .about-card {
    padding: 2rem 1.5rem;
  }

  .about-card h1 {
    font-size: 2rem;
  }

  .section h2 {
    font-size: 1.25rem;
  }
}
</style>
