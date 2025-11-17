// Mock user data for the admin dashboard
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    created: '2024-01-01',
    lastLogin: '2024-03-15'
  },
  {
    id: 2,
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    created: '2024-01-15',
    lastLogin: '2024-03-14'
  },
  {
    id: 3,
    username: 'janesmith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    created: '2024-02-01',
    lastLogin: '2024-03-13'
  },
  {
    id: 4,
    username: 'bobwilson',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'moderator',
    status: 'inactive',
    created: '2024-02-10',
    lastLogin: '2024-03-01'
  },
  {
    id: 5,
    username: 'alicejohnson',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    created: '2024-02-20',
    lastLogin: '2024-03-12'
  }
]

export const mockReports = [
  {
    id: 1,
    title: 'Monthly User Activity',
    type: 'usage',
    generated: '2024-03-01',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Security Audit Log',
    type: 'security',
    generated: '2024-03-05',
    status: 'completed'
  },
  {
    id: 3,
    title: 'System Performance Report',
    type: 'performance',
    generated: '2024-03-10',
    status: 'completed'
  },
  {
    id: 4,
    title: 'User Engagement Analytics',
    type: 'analytics',
    generated: '2024-03-15',
    status: 'in-progress'
  }
]
