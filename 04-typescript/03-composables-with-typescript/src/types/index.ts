export interface Node {
  id: number
  name: string
  type: 'folder' | 'document'
  parentId: number | null
  createdAt: string
  modifiedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}
