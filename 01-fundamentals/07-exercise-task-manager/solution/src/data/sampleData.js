/**
 * Sample data for Task Manager Pro
 * This data will be used to initialize the app if no saved data exists
 */

export const sampleProjects = [
  {
    id: 'proj_personal',
    name: 'Personal',
    color: '#667eea',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
  },
  {
    id: 'proj_work',
    name: 'Work',
    color: '#f56565',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000 // 5 days ago
  },
  {
    id: 'proj_learning',
    name: 'Learning',
    color: '#48bb78',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago
  }
]

export const sampleTasks = [
  {
    id: 'task_1',
    title: 'Complete Vue 3 Fundamentals',
    description: 'Finish lessons 1-6 covering basics, components, reactivity, and composables',
    priority: 'high',
    status: 'completed',
    projectId: 'proj_learning',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: 'task_2',
    title: 'Build Task Manager Exercise',
    description: 'Apply all learned concepts by building a complete task management application',
    priority: 'high',
    status: 'active',
    projectId: 'proj_learning',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    completedAt: null
  },
  {
    id: 'task_3',
    title: 'Write project documentation',
    description: 'Document the architecture, components, and usage of the task manager',
    priority: 'medium',
    status: 'active',
    projectId: 'proj_learning',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    createdAt: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    completedAt: null
  },
  {
    id: 'task_4',
    title: 'Review pull requests',
    description: 'Review and merge pending pull requests from the team',
    priority: 'high',
    status: 'active',
    projectId: 'proj_work',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
    createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    completedAt: null
  },
  {
    id: 'task_5',
    title: 'Update project dependencies',
    description: 'Check for outdated packages and update to latest stable versions',
    priority: 'medium',
    status: 'active',
    projectId: 'proj_work',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    completedAt: null
  },
  {
    id: 'task_6',
    title: 'Refactor authentication module',
    description: 'Improve code structure and add comprehensive tests',
    priority: 'medium',
    status: 'completed',
    projectId: 'proj_work',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // yesterday
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 1 * 24 * 60 * 60 * 1000
  },
  {
    id: 'task_7',
    title: 'Grocery shopping',
    description: 'Buy milk, eggs, bread, vegetables, and fruits',
    priority: 'low',
    status: 'active',
    projectId: 'proj_personal',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    completedAt: null
  },
  {
    id: 'task_8',
    title: 'Plan weekend trip',
    description: 'Research destinations, book accommodation, and plan activities',
    priority: 'low',
    status: 'active',
    projectId: 'proj_personal',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    completedAt: null
  },
  {
    id: 'task_9',
    title: 'Call dentist',
    description: 'Schedule appointment for dental checkup',
    priority: 'high',
    status: 'active',
    projectId: 'proj_personal',
    dueDate: new Date(Date.now()).toISOString().split('T')[0], // today
    createdAt: Date.now() - 24 * 60 * 60 * 1000, // yesterday
    completedAt: null
  },
  {
    id: 'task_10',
    title: 'Read Vue 3 docs',
    description: 'Read through the official Vue 3 documentation for advanced patterns',
    priority: 'medium',
    status: 'active',
    projectId: 'proj_learning',
    dueDate: null, // No due date
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    completedAt: null
  }
]

/**
 * Helper function to generate unique IDs
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Priority configuration for consistent styling
 */
export const priorityConfig = {
  high: {
    color: '#dc3545',
    bg: '#fee',
    label: 'High',
    icon: '🔴'
  },
  medium: {
    color: '#f57c00',
    bg: '#fff8e1',
    label: 'Medium',
    icon: '🟡'
  },
  low: {
    color: '#28a745',
    bg: '#e8f5e9',
    label: 'Low',
    icon: '🟢'
  }
}

/**
 * Project color palette
 */
export const projectColors = [
  '#667eea', '#764ba2', '#f56565', '#ed8936',
  '#ecc94b', '#48bb78', '#38b2ac', '#4299e1',
  '#9f7aea', '#ed64a6'
]
