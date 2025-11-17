/**
 * Shared Types for Components
 */

export interface Node {
  id: number
  name: string
  type: 'folder' | 'document' | 'link'
  parentId: number | null
  createdAt: string
  modifiedAt: string
  metadata?: Record<string, unknown>
}

export interface Document extends Node {
  type: 'document'
  content: string
  size: number
  mimeType: string
}

export interface Folder extends Node {
  type: 'folder'
  children: number[]
}

export type AnyNode = Document | Folder

export interface User {
  id: number
  username: string
  email: string
  role: 'user' | 'admin'
}

export type SortDirection = 'asc' | 'desc'
export type ViewMode = 'list' | 'grid' | 'tree'

export interface FilterOptions {
  search?: string
  type?: Node['type']
  sortBy?: keyof Node
  sortDirection?: SortDirection
}
