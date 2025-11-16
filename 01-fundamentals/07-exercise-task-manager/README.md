# Exercise: Task Manager Pro

## 🎯 Overview

Build a comprehensive **Task Manager** application that combines all concepts from Lessons 1-6. This capstone exercise will solidify your Vue 3 fundamentals by creating a real-world application.

## What You'll Build

A full-featured task management application with:
- **Projects** - Organize tasks into color-coded projects
- **Tasks** - Create, edit, complete, and delete tasks with priorities
- **Smart Filtering** - Filter by status, priority, project, and search
- **Auto-save** - Automatic persistence to localStorage
- **Statistics** - Real-time completion tracking and breakdowns
- **Modern UI** - Clean, responsive interface

## 📚 Learning Objectives

This exercise combines everything you've learned:

| Lesson | Concept | Applied In |
|--------|---------|------------|
| 1. Hello Vue | Basics, reactive state | App setup, refs |
| 2. Components | Component composition | TaskCard, ProjectCard, FilterBar |
| 3. Lists & Conditionals | v-for, v-if, v-show | Task lists, filtering |
| 4. Forms & Validation | v-model, validation | Task/Project forms |
| 5. Reactivity | watch, computed | Auto-save, statistics |
| 6. Composables | Reusable logic | useLocalStorage, useForm, etc. |

## ✨ Features to Implement

### 🎨 Phase 1: Project Management

- [ ] Create projects with custom names and colors
- [ ] Display projects in sidebar
- [ ] Delete projects (with confirmation)
- [ ] Show task count per project
- [ ] Select project to filter tasks

### ✅ Phase 2: Task Management

- [ ] Create tasks with title, description, priority, due date
- [ ] Assign tasks to projects
- [ ] Mark tasks complete/incomplete
- [ ] Edit existing tasks
- [ ] Delete tasks
- [ ] Display tasks in cards with all details

### 🔍 Phase 3: Filtering & Search

- [ ] Filter by status: All, Active, Completed
- [ ] Filter by priority: All, High, Medium, Low
- [ ] Filter by project
- [ ] Search tasks (debounced, across title + description)
- [ ] Show filtered count
- [ ] Clear all filters button

### 💾 Phase 4: Data Persistence

- [ ] Auto-save to localStorage on any change
- [ ] Load saved data on app start
- [ ] Show save indicator
- [ ] Sample data if first time

### 📊 Phase 5: Statistics

- [ ] Total tasks
- [ ] Completed tasks with percentage
- [ ] Tasks by priority (High/Medium/Low count)
- [ ] Tasks by project
- [ ] Overdue tasks count

## 📋 Data Structures

### Project

```javascript
{
  id: 'proj_1234567890',
  name: 'Personal',
  color: '#667eea',
  createdAt: 1699564800000
}
```

### Task

```javascript
{
  id: 'task_1234567890',
  title: 'Learn Vue 3 Composables',
  description: 'Complete Lesson 6 and build reusable composables',
  priority: 'high',              // 'high' | 'medium' | 'low'
  status: 'active',              // 'active' | 'completed'
  projectId: 'proj_1234567890',
  dueDate: '2024-12-31',         // ISO date string or null
  createdAt: 1699564800000,
  completedAt: null              // timestamp or null
}
```

## ✏️ Validation Rules

### Project Form
- **name**: Required, 2-50 characters

### Task Form
- **title**: Required, 3-100 characters
- **description**: Optional, max 500 characters
- **priority**: Required (high/medium/low)
- **projectId**: Required, must exist
- **dueDate**: Optional, must be valid date

## 🏗️ Component Structure

```
App.vue
├── AppHeader
│   └── Statistics summary
├── Sidebar
│   ├── ProjectForm
│   └── ProjectCard (v-for projects)
├── MainContent
│   ├── FilterBar
│   │   ├── SearchInput (debounced)
│   │   ├── StatusFilter
│   │   ├── PriorityFilter
│   │   └── ClearFilters
│   ├── TaskForm (create/edit)
│   └── TaskList
│       └── TaskCard (v-for filtered tasks)
└── StatsPanel
    └── Detailed statistics
```

## 🧩 Composables to Use

Copy from `01-fundamentals/06-composables/src/composables/`:

1. **useLocalStorage** - Persist projects and tasks
2. **useForm** - Manage form state
3. **useValidation** - Validate inputs
4. **useDebounce** - Debounce search
5. **useToggle** - Modal/form visibility

## 🚀 Getting Started

### Option 1: Start from Starter Template

```bash
cd 01-fundamentals/07-exercise-task-manager/starter
npm install
npm run dev
```

The starter includes:
- ✅ Vite setup
- ✅ Sample data
- ✅ Composables ready to use
- ✅ Basic CSS structure
- ❌ Components (you build these!)

### Option 2: Start from Scratch

```bash
npm create vite@latest my-task-manager -- --template vue
cd my-task-manager
npm install
npm run dev
```

Then copy composables from Lesson 6 and build everything yourself!

## 📝 Step-by-Step Guide

### Phase 1: Setup (30 minutes)

1. **Setup project and install dependencies**
   ```bash
   cd starter
   npm install
   ```

2. **Study the provided code**
   - Review `src/data/sampleData.js`
   - Check composables in `src/composables/`
   - Understand the data structure

3. **Initialize state**
   ```javascript
   const projects = useLocalStorage('projects', sampleProjects)
   const tasks = useLocalStorage('tasks', sampleTasks)
   ```

### Phase 2: Projects (1 hour)

4. **Create `ProjectCard.vue`**
   - Display project name with colored indicator
   - Show task count
   - Delete button (emits event)

5. **Create `ProjectForm.vue`**
   - Input for project name
   - Color picker (or predefined colors)
   - Validation with useForm and useValidation
   - Submit to create project

6. **Add to App.vue**
   - Render project list
   - Handle create project
   - Handle delete project

### Phase 3: Tasks (2 hours)

7. **Create `TaskCard.vue`**
   - Display: title, description, priority badge, due date
   - Complete checkbox (toggles status)
   - Edit and delete buttons
   - Color-code by priority

8. **Create `TaskForm.vue`**
   - Title input
   - Description textarea
   - Priority radio buttons (high/medium/low)
   - Project select dropdown
   - Due date input
   - Validation
   - Submit/cancel buttons

9. **Implement task CRUD in App.vue**
   - Create task
   - Edit task (populate form)
   - Delete task
   - Toggle complete

### Phase 4: Filtering (1 hour)

10. **Create `FilterBar.vue`**
    - Search input (use useDebounce!)
    - Status buttons (All/Active/Completed)
    - Priority dropdown
    - Project dropdown
    - Clear filters button

11. **Add computed for filtered tasks**
    ```javascript
    const filteredTasks = computed(() => {
      return tasks.data.value
        .filter(/* status filter */)
        .filter(/* priority filter */)
        .filter(/* project filter */)
        .filter(/* search filter */)
    })
    ```

### Phase 5: Statistics & Polish (1 hour)

12. **Create statistics computed**
    ```javascript
    const stats = computed(() => ({
      total: tasks.data.value.length,
      completed: tasks.data.value.filter(t => t.status === 'completed').length,
      // ... more stats
    }))
    ```

13. **Add save indicator**
    ```javascript
    watch([tasks.data, projects.data], () => {
      showSaved.value = true
      setTimeout(() => showSaved.value = false, 1000)
    }, { deep: true })
    ```

14. **Polish UI**
    - Smooth transitions
    - Empty states
    - Loading indicators
    - Responsive design

## 💡 Hints & Code Snippets

### Hint 1: Creating Unique IDs

```javascript
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Usage
const newTask = {
  id: generateId('task'),
  // ... other properties
}
```

### Hint 2: Filtering Tasks

```javascript
const filteredTasks = computed(() => {
  let result = tasks.data.value

  // Filter by status
  if (filters.status !== 'all') {
    result = result.filter(t => t.status === filters.status)
  }

  // Filter by priority
  if (filters.priority !== 'all') {
    result = result.filter(t => t.priority === filters.priority)
  }

  // Filter by project
  if (filters.projectId) {
    result = result.filter(t => t.projectId === filters.projectId)
  }

  // Search (debounced)
  if (debouncedSearch.value) {
    const query = debouncedSearch.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  }

  return result
})
```

### Hint 3: Toggle Task Completion

```javascript
function toggleComplete(taskId) {
  const task = tasks.data.value.find(t => t.id === taskId)
  if (!task) return

  task.status = task.status === 'active' ? 'completed' : 'active'
  task.completedAt = task.status === 'completed' ? Date.now() : null
}
```

### Hint 4: Priority Colors & Icons

```javascript
const priorityConfig = {
  high: { color: '#dc3545', label: 'High', icon: '🔴' },
  medium: { color: '#ffc107', label: 'Medium', icon: '🟡' },
  low: { color: '#28a745', label: 'Low', icon: '🟢' }
}
```

### Hint 5: Date Formatting & Overdue Check

```javascript
function formatDueDate(dateString) {
  if (!dateString) return null

  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isOverdue = date < today

  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return {
    formatted,
    isOverdue
  }
}
```

### Hint 6: Auto-save Indicator

```javascript
const isSaving = ref(false)

watch([tasks.data, projects.data], () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
  }, 500)
}, { deep: true })
```

## 🎨 Styling Tips

### Priority Badge

```css
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.priority-high {
  background: #fee;
  color: #dc3545;
}

.priority-medium {
  background: #fff8e1;
  color: #f57c00;
}

.priority-low {
  background: #e8f5e9;
  color: #28a745;
}
```

### Task Card

```css
.task-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid var(--priority-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.task-card.completed {
  opacity: 0.6;
}

.task-card.completed .task-title {
  text-decoration: line-through;
}
```

## 🏆 Bonus Challenges

Once you complete the core features:

1. **Sorting** - Sort tasks by priority, due date, or creation date
2. **Bulk Actions** - Select multiple tasks, bulk complete/delete
3. **Undo/Redo** - Implement undo for deletions
4. **Dark Mode** - Toggle theme with useToggle
5. **Export/Import** - Download/upload JSON
6. **Task Timer** - Track time spent on tasks
7. **Subtasks** - Add checklist within tasks
8. **Tags** - Additional categorization
9. **Charts** - Visualize stats with Chart.js
10. **Animations** - Smooth list transitions with Vue transitions

## ✅ Evaluation Checklist

Check your work against these criteria:

### Functionality (50%)
- [ ] Can create/edit/delete projects
- [ ] Can create/edit/delete tasks
- [ ] Can mark tasks complete/incomplete
- [ ] All filters work correctly
- [ ] Search is debounced and works
- [ ] Data persists across refreshes
- [ ] Statistics update in real-time

### Code Quality (30%)
- [ ] Components are properly structured
- [ ] Composables are used effectively
- [ ] Code is readable with good naming
- [ ] No console errors
- [ ] Proper use of refs and reactive
- [ ] Watch and computed used appropriately

### UI/UX (20%)
- [ ] Clean, intuitive interface
- [ ] Responsive layout
- [ ] Visual feedback (hover, active states)
- [ ] Empty states handled
- [ ] Form validation shows errors
- [ ] Save indicator visible

## 📖 Reference Solution

A complete reference solution is in the `solution/` folder. **Try to build it yourself first!**

To run the solution:
```bash
cd solution
npm install
npm run dev
```

## ⏱️ Time Estimate

- **Phase 1 (Setup)**: 30 minutes
- **Phase 2 (Projects)**: 1 hour
- **Phase 3 (Tasks)**: 2 hours
- **Phase 4 (Filtering)**: 1 hour
- **Phase 5 (Stats & Polish)**: 1 hour

**Total**: ~5-6 hours for core features

## 🎓 What You'll Master

By completing this exercise:

1. ✅ Building complete Vue 3 applications
2. ✅ Component composition and props/events
3. ✅ Complex form handling with validation
4. ✅ Advanced filtering and search patterns
5. ✅ Creating and using composables
6. ✅ Data persistence strategies
7. ✅ Reactive state management
8. ✅ Real-world application architecture

## 🆘 Getting Help

Stuck? Try these steps:

1. **Review the lesson** - Go back to the relevant lesson (1-6)
2. **Check the hints** - Use the code snippets above
3. **Console.log** - Debug by logging state
4. **Vue DevTools** - Inspect components and state
5. **Solution** - Check the solution folder for guidance

## 🎉 When You're Done

After completing the exercise:

1. **Test thoroughly** - Try to break it!
2. **Refactor** - Clean up any messy code
3. **Add a feature** - Pick a bonus challenge
4. **Share** - Show someone what you built
5. **Reflect** - What was easy? What was hard?

---

**Good luck, and enjoy building!** 🚀

This exercise brings together everything you've learned. Take your time, break it into small steps, and celebrate each working feature. You've got this!
