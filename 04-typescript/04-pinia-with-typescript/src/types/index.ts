export interface Node {
  id: number
  name: string
  type: 'folder' | 'document'
  parentId: number | null
  createdAt: string
  modifiedAt: string
}

export interface User {
  id: number
  username: string
  email: string
  role: 'user' | 'admin'
}

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}
