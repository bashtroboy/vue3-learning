/**
 * Complete Type Definitions for Content Server
 */

// Basic types
export type NodeId = number
export type NodeType = 'folder' | 'document' | 'link'
export type Permission = 'read' | 'write' | 'admin'
export type Timestamp = string

// Node base interface
export interface Node {
  id: NodeId
  name: string
  type: NodeType
  parentId: NodeId | null
  createdAt: Timestamp
  modifiedAt: Timestamp
  metadata?: Record<string, unknown>
}

// Specific node types
export interface Document extends Node {
  type: 'document'
  content: string
  size: number
  mimeType: string
}

export interface Folder extends Node {
  type: 'folder'
  children: NodeId[]
}

export interface Link extends Node {
  type: 'link'
  targetId: NodeId
  targetPath: string
}

// Discriminated union
export type AnyNode = Document | Folder | Link

// User interface
export interface User {
  id: number
  username: string
  email: string
  role: 'user' | 'admin'
  permissions: Permission[]
  createdAt: Timestamp
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
  timestamp: Timestamp
}

// Utility types
export type CreateNodeInput = Omit<Node, 'id' | 'createdAt' | 'modifiedAt'>
export type UpdateNodeInput = Partial<Omit<Node, 'id' | 'createdAt'>>
export type NodeSummary = Pick<Node, 'id' | 'name' | 'type'>

// Type guards
export function isDocument(node: AnyNode): node is Document {
  return node.type === 'document'
}

export function isFolder(node: AnyNode): node is Folder {
  return node.type === 'folder'
}

export function isLink(node: AnyNode): node is Link {
  return node.type === 'link'
}
