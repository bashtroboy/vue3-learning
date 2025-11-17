// Mock Content Server node data
export const mockNodes = [
  {
    id: 1,
    name: 'Root',
    type: 'folder',
    parent_id: null,
    owner: 'Admin',
    created: '2024-01-15',
    description: 'Root folder of the content server'
  },
  {
    id: 2,
    name: 'Documents',
    type: 'folder',
    parent_id: 1,
    owner: 'John Doe',
    created: '2024-01-16',
    description: 'General documents folder'
  },
  {
    id: 3,
    name: 'Projects',
    type: 'folder',
    parent_id: 1,
    owner: 'Jane Smith',
    created: '2024-01-17',
    description: 'Project files and documentation'
  },
  {
    id: 4,
    name: 'Invoice-2024.pdf',
    type: 'document',
    parent_id: 2,
    owner: 'John Doe',
    created: '2024-02-01',
    description: 'Annual invoice document',
    size: '245 KB'
  },
  {
    id: 5,
    name: 'Meeting-Notes.docx',
    type: 'document',
    parent_id: 2,
    owner: 'Jane Smith',
    created: '2024-02-05',
    description: 'Weekly meeting notes',
    size: '128 KB'
  },
  {
    id: 6,
    name: 'Project-Alpha',
    type: 'folder',
    parent_id: 3,
    owner: 'Alice Johnson',
    created: '2024-02-10',
    description: 'Alpha project workspace'
  },
  {
    id: 7,
    name: 'Presentation.pptx',
    type: 'document',
    parent_id: 6,
    owner: 'Alice Johnson',
    created: '2024-02-15',
    description: 'Project presentation slides',
    size: '3.2 MB'
  },
  {
    id: 8,
    name: 'Specifications.pdf',
    type: 'document',
    parent_id: 6,
    owner: 'Bob Wilson',
    created: '2024-02-18',
    description: 'Technical specifications',
    size: '892 KB'
  },
  {
    id: 9,
    name: 'Archive',
    type: 'folder',
    parent_id: 1,
    owner: 'Admin',
    created: '2024-01-20',
    description: 'Archived files'
  },
  {
    id: 10,
    name: 'Old-Report.xlsx',
    type: 'document',
    parent_id: 9,
    owner: 'Admin',
    created: '2023-12-15',
    description: 'Archived quarterly report',
    size: '512 KB'
  }
]

// Simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock API with authentication support
export const mockApi = {
  async getNodes(options = {}) {
    await delay(500)
    // Check auth header
    if (!options.headers?.Authorization) {
      throw new Error('Unauthorized')
    }
    return { data: [...mockNodes] }
  },

  async getNode(id, options = {}) {
    await delay(300)
    // Check auth header
    if (!options.headers?.Authorization) {
      throw new Error('Unauthorized')
    }
    const node = mockNodes.find(n => n.id === parseInt(id))
    if (!node) {
      throw new Error('Node not found')
    }
    return { data: { ...node } }
  },

  async login(username, password) {
    await delay(800)
    // Simple mock authentication
    if (username === 'demo' && password === 'demo') {
      return {
        data: {
          user: { id: 1, username: 'demo', name: 'Demo User', role: 'user' },
          token: 'mock-jwt-token-' + Date.now()
        }
      }
    }
    throw new Error('Invalid credentials')
  },

  async addFavorite(nodeId, options = {}) {
    await delay(200)
    if (!options.headers?.Authorization) {
      throw new Error('Unauthorized')
    }
    // Simulate occasional failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Failed to add favorite')
    }
    return { data: { success: true } }
  },

  async removeFavorite(nodeId, options = {}) {
    await delay(200)
    if (!options.headers?.Authorization) {
      throw new Error('Unauthorized')
    }
    return { data: { success: true } }
  }
}
