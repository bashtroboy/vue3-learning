<script setup lang="ts">
import { ref } from 'vue'
import BasicTypes from './examples/BasicTypes.vue'
import InterfacesExample from './examples/InterfacesExample.vue'
import GenericsExample from './examples/GenericsExample.vue'
import UnionsIntersections from './examples/UnionsIntersections.vue'
import UtilityTypes from './examples/UtilityTypes.vue'
import TypeGuards from './examples/TypeGuards.vue'

const activeTab = ref<string>('basic')

interface Tab {
  id: string
  label: string
  component: any
}

const tabs: Tab[] = [
  { id: 'basic', label: 'Basic Types', component: BasicTypes },
  { id: 'interfaces', label: 'Interfaces', component: InterfacesExample },
  { id: 'generics', label: 'Generics', component: GenericsExample },
  { id: 'unions', label: 'Unions & Intersections', component: UnionsIntersections },
  { id: 'utility', label: 'Utility Types', component: UtilityTypes },
  { id: 'guards', label: 'Type Guards', component: TypeGuards }
]

const setActive = (id: string): void => {
  activeTab.value = id
}

const getActiveComponent = () => {
  return tabs.find(tab => tab.id === activeTab.value)?.component
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>🎯 TypeScript Fundamentals</h1>
      <p>Learn TypeScript basics with Content Server examples</p>
    </header>

    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab', { active: activeTab === tab.id }]"
        @click="setActive(tab.id)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <main class="content">
      <component :is="getActiveComponent()" />
    </main>

    <footer class="footer">
      <p>💡 Check your browser console for type examples and outputs</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab {
  background: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.tab:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);
}

.content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  min-height: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.footer {
  margin-top: 2rem;
  padding: 1rem;
  text-align: center;
  color: white;
  font-size: 0.9rem;
}
</style>
