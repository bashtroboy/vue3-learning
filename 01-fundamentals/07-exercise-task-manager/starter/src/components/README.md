# Components to Build

Create these components to complete the exercise:

## Required Components

### 1. ProjectCard.vue
- Display project name with color indicator
- Show task count for this project
- Delete button
- Emit events for selection and deletion

### 2. ProjectList.vue
- Render list of ProjectCard components
- Project creation form
- Handle project CRUD operations

### 3. TaskCard.vue
- Display task details (title, description, priority, due date)
- Complete/incomplete checkbox
- Edit and delete buttons
- Priority badge with color
- Due date (highlight if overdue)
- Emit events for actions

### 4. TaskForm.vue
- Form for creating/editing tasks
- Fields: title, description, priority, project, due date
- Validation using useValidation
- Submit and cancel buttons
- Mode prop: 'create' | 'edit'

### 5. TaskList.vue
- Render filtered list of TaskCard components
- Empty state when no tasks
- Sort options (optional)

### 6. FilterBar.vue
- Search input (debounced)
- Status filter buttons (All/Active/Completed)
- Priority dropdown
- Project dropdown
- Clear filters button

## Optional Components

### 7. StatisticsPanel.vue
- Display computed statistics
- Charts or visualizations (bonus)

### 8. Modal.vue
- Reusable modal for confirmations
- Delete confirmations

## Component Communication

Use props and events for parent-child communication:

```javascript
// Parent
<TaskCard
  :task="task"
  @toggle-complete="toggleComplete"
  @edit="editTask"
  @delete="deleteTask"
/>

// Child
const emit = defineEmits(['toggle-complete', 'edit', 'delete'])
```

Good luck building! 🚀
