# Section 2: Composition API - Advanced Patterns

## 🎯 Overview

This section dives deep into Vue 3's Composition API, exploring advanced patterns and features that enable you to build sophisticated, production-ready applications. Building on the fundamentals from Section 1, you'll master dependency injection, lifecycle management, custom directives, plugins, and advanced architectural patterns.

## Prerequisites

Before starting this section, you should have completed:
- ✅ **Section 1: Fundamentals** (Lessons 1-6 + Exercise)
- ✅ Understanding of components, reactivity, and composables
- ✅ Comfortable with Vue 3 `<script setup>` syntax
- ✅ Familiarity with JavaScript ES6+ features

## 📚 Lessons

### Lesson 1: Provide/Inject - Dependency Injection
**Topics:** Provide/Inject API, dependency injection patterns, avoiding prop drilling, typed injection, reactive injection, composable injection

**What You'll Build:** Multi-level theme system with nested components

**Key Concepts:**
- Understanding provide/inject
- Avoiding prop drilling
- Reactive provided values
- Type-safe injection with TypeScript
- Injection keys and symbols
- Default values and validation

**Time:** 1-2 hours

---

### Lesson 2: Lifecycle Hooks - Deep Dive
**Topics:** All lifecycle hooks, timing, use cases, SSR considerations, cleanup patterns

**What You'll Build:** Component lifecycle visualizer and logger

**Key Concepts:**
- onMounted, onUpdated, onUnmounted
- onBeforeMount, onBeforeUpdate, onBeforeUnmount
- onActivated, onDeactivated (for keep-alive)
- onErrorCaptured, onRenderTracked, onRenderTriggered
- Lifecycle timing and order
- Cleanup and memory management
- SSR lifecycle differences

**Time:** 1.5-2 hours

---

### Lesson 3: Custom Directives - DOM Manipulation
**Topics:** Creating custom directives, directive hooks, modifiers, arguments

**What You'll Build:** Directive library (v-focus, v-click-outside, v-tooltip, v-lazy-load)

**Key Concepts:**
- Directive lifecycle hooks
- mounted, updated, unmounted
- Directive arguments and modifiers
- Accessing element and binding
- Common directive patterns
- Performance considerations

**Time:** 2-3 hours

---

### Lesson 4: Teleport & Suspense - Advanced Rendering
**Topics:** Teleport component, Suspense for async components, error boundaries

**What You'll Build:** Modal system with teleport, async component loader

**Key Concepts:**
- Teleport to different DOM locations
- Multiple teleports to same target
- Disabled teleport
- Suspense for async components
- Fallback content
- Error handling with onErrorCaptured

**Time:** 1.5-2 hours

---

### Lesson 5: Plugins - Extending Vue
**Topics:** Plugin architecture, global properties, directives, components, install function

**What You'll Build:** Toast notification plugin, i18n plugin

**Key Concepts:**
- Plugin structure and install function
- Registering global components
- Adding global properties
- Providing app-level data
- Plugin options and configuration
- TypeScript support for plugins

**Time:** 2-3 hours

---

### Lesson 6: Advanced Composable Patterns
**Topics:** Composable composition, state sharing, async composables, cleanup, testing

**What You'll Build:** Advanced composables (useAsync, useEventBus, usePermissions)

**Key Concepts:**
- Composable best practices
- Shared vs scoped state
- Async data fetching patterns
- Event bus pattern
- Cleanup and memory management
- Testing composables
- TypeScript with composables

**Time:** 2-3 hours

---

### Lesson 7: Exercise - Plugin System
**Capstone Project:** Build a comprehensive plugin system with theme provider, notification service, modal manager, and permission system

**Integration:** Uses all concepts from Lessons 1-6

**Time:** 4-6 hours

---

## 🎓 Learning Path

```
Section 1: Fundamentals
       ↓
01. Provide/Inject ────────→ Dependency injection patterns
       ↓
02. Lifecycle Hooks ───────→ Component lifecycle management
       ↓
03. Custom Directives ─────→ DOM manipulation patterns
       ↓
04. Teleport & Suspense ───→ Advanced rendering techniques
       ↓
05. Plugins ───────────────→ Extending Vue globally
       ↓
06. Advanced Patterns ─────→ Complex composable patterns
       ↓
07. Exercise ──────────────→ Plugin System (Capstone)
```

## 🎯 Learning Objectives

By the end of this section, you will be able to:

1. ✅ Implement dependency injection with provide/inject
2. ✅ Master all Vue lifecycle hooks and their use cases
3. ✅ Create custom directives for reusable DOM behavior
4. ✅ Use Teleport for portals and Suspense for async loading
5. ✅ Build and publish Vue plugins
6. ✅ Design advanced composable architectures
7. ✅ Implement complex application patterns
8. ✅ Optimize performance and memory usage
9. ✅ Write testable, maintainable code
10. ✅ Build production-ready Vue applications

## 📊 Section Statistics

- **Lessons:** 6 lessons + 1 exercise
- **Total Time:** 12-16 hours
- **Code Examples:** 50+ working examples
- **Projects:** 7 hands-on projects
- **Documentation:** ~15,000 lines
- **Difficulty:** Intermediate to Advanced

## 🛠️ What You'll Build

### Lesson Projects
1. **Theme System** - Multi-level theming with provide/inject
2. **Lifecycle Visualizer** - Interactive lifecycle demonstration
3. **Directive Library** - Collection of useful directives
4. **Modal System** - Teleport-based modal manager
5. **Toast Plugin** - Global notification system
6. **Advanced Composables** - Production-ready utilities

### Capstone Exercise
**Plugin System** - A complete plugin architecture featuring:
- Theme provider with dark/light modes
- Toast notification service
- Modal manager
- Permission system
- i18n integration
- Event bus
- All using advanced patterns

## 🎨 Key Patterns Covered

### 1. Dependency Injection
```javascript
// Provide at root
provide('theme', reactive({ mode: 'light' }))

// Inject anywhere in tree
const theme = inject('theme')
```

### 2. Custom Directives
```javascript
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

### 3. Teleport
```vue
<Teleport to="body">
  <div class="modal">Content</div>
</Teleport>
```

### 4. Suspense
```vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <Loading />
  </template>
</Suspense>
```

### 5. Plugins
```javascript
export default {
  install(app, options) {
    app.config.globalProperties.$toast = createToast(options)
  }
}
```

## 📖 Recommended Learning Path

### For Beginners (from Section 1)
1. Start with Lesson 1 (Provide/Inject)
2. Work through lessons sequentially
3. Build each lesson's project
4. Read NOTES.md for deep understanding
5. Complete the capstone exercise

### For Experienced Developers
1. Review README for each lesson
2. Focus on lessons with new concepts
3. Study advanced patterns in Lesson 6
4. Jump to the capstone exercise
5. Use as reference documentation

### For Quick Reference
- Use lesson READMEs for syntax and examples
- Check NOTES.md for deep explanations
- Review solution code for patterns
- Use search to find specific topics

## 🔗 Relationship to Real Projects

These patterns are used extensively in:
- **Component Libraries:** Element Plus, Vuetify, Ant Design Vue
- **Frameworks:** Nuxt 3, Quasar, VuePress
- **State Management:** Pinia, Vue Router
- **Real Applications:** Admin dashboards, SaaS apps, enterprise systems

## 📚 Additional Resources

- [Vue 3 Composition API Docs](https://vuejs.org/api/composition-api-dependency-injection.html)
- [Vue 3 Reusability Docs](https://vuejs.org/guide/reusability/)
- [Vue 3 Advanced Guides](https://vuejs.org/guide/extras/)

## 🚀 Getting Started

```bash
# Navigate to a lesson
cd 02-composition-api/01-provide-inject

# Install dependencies
npm install

# Run development server
npm run dev
```

Each lesson follows the same structure:
- `README.md` - Quick reference and examples
- `NOTES.md` - Deep technical documentation
- `src/` - Working code examples
- `package.json` - Dependencies and scripts

## 💡 Tips for Success

1. **Build Each Project** - Don't just read, code along
2. **Experiment** - Modify examples and see what happens
3. **Read NOTES** - Deep understanding comes from detailed docs
4. **Complete Exercise** - The capstone ties everything together
5. **Take Breaks** - Complex topics need time to digest
6. **Ask Questions** - Use the community or documentation
7. **Review Section 1** - If concepts feel unclear, review fundamentals

## ⚠️ Common Pitfalls

- **Overusing provide/inject** - Not everything needs dependency injection
- **Ignoring lifecycle cleanup** - Always clean up event listeners, timers
- **Complex directives** - Keep directives simple and focused
- **Teleport abuse** - Use sparingly for modals, tooltips, notifications
- **Heavy plugins** - Plugins should be lightweight and focused

## 🎓 After This Section

You'll be ready for:
- **Section 3: Real Tools** - Build production utilities
- **Section 4: Migration Patterns** - Vue 2 → Vue 3
- **Real Projects** - Production applications
- **Open Source** - Contributing to Vue ecosystem

---

**Let's dive deep into Vue 3's advanced features!** 🚀

Start with [Lesson 1: Provide/Inject](./01-provide-inject/README.md)
