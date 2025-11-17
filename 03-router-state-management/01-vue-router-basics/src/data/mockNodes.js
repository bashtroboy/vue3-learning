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

// Helper function to get node by ID
export function getNodeById(id) {
  return mockNodes.find(node => node.id === parseInt(id))
}

// Helper function to get child nodes
export function getChildNodes(parentId) {
  return mockNodes.filter(node => node.parent_id === parseInt(parentId))
}

// Helper function to get breadcrumb path
export function getBreadcrumbPath(nodeId) {
  const path = []
  let currentId = parseInt(nodeId)

  while (currentId) {
    const node = getNodeById(currentId)
    if (node) {
      path.unshift(node)
      currentId = node.parent_id
    } else {
      break
    }
  }

  return path
}

// Mock search function
export function searchNodes(query) {
  if (!query) return mockNodes

  const lowerQuery = query.toLowerCase()
  return mockNodes.filter(node =>
    node.name.toLowerCase().includes(lowerQuery) ||
    node.description.toLowerCase().includes(lowerQuery) ||
    node.owner.toLowerCase().includes(lowerQuery)
  )
}
