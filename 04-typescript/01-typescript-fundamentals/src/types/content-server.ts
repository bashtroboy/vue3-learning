/**
 * Content Server Type Definitions
 *
 * These types represent the core data structures used in Content Server applications.
 * They demonstrate TypeScript fundamentals including interfaces, type aliases,
 * unions, intersections, and utility types.
 */

// Basic primitive types
export type NodeId = number
export type NodeName = string
export type Timestamp = string // ISO 8601 format

// Union types - A value can be one of several types
export type NodeType = 'folder' | 'document' | 'link'
export type Permission = 'read' | 'write' | 'admin'

// Interface - Describes the shape of an object
export interface Node {
  id: NodeId
  name: NodeName
  type: NodeType
  parentId: NodeId | null
  createdAt: Timestamp
  modifiedAt: Timestamp
  metadata?: Record<string, unknown> // Optional property
}

// Extending interfaces
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

// Discriminated unions - Type-safe union using a discriminator field
export type AnyNode = Document | Folder | Link

// Type aliases for objects
export type User = {
  id: number
  username: string
  email: string
  permissions: Permission[]
  createdAt: Timestamp
}

// Intersection types - Combine multiple types
export type AuditedNode = Node & {
  createdBy: User['id']
  modifiedBy: User['id']
  version: number
}

// Generic type - Reusable type with type parameters
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
  timestamp: Timestamp
}

// Utility types examples
export type PartialNode = Partial<Node> // All properties optional
export type RequiredNode = Required<Node> // All properties required
export type NodeWithoutMetadata = Omit<Node, 'metadata'> // Exclude properties
export type NodeIdAndName = Pick<Node, 'id' | 'name'> // Include only specific properties
export type ReadonlyNode = Readonly<Node> // All properties readonly

// Function types
export type NodeFilter = (node: Node) => boolean
export type NodeComparator = (a: Node, b: Node) => number
export type NodeTransform<T> = (node: Node) => T

// Generic function types
export type FetchFunction<T> = (id: number) => Promise<ApiResponse<T>>
export type CreateFunction<T> = (data: Omit<T, 'id' | 'createdAt' | 'modifiedAt'>) => Promise<ApiResponse<T>>

// Tuple types - Fixed-length arrays with specific types
export type Coordinates = [number, number]
export type NodeWithParent = [Node, Node | null]

// Record type - Object with specific key and value types
export type NodeMap = Record<NodeId, Node>
export type PermissionMap = Record<Permission, boolean>

// Template literal types (TypeScript 4.1+)
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ApiEndpoint = `/api/nodes/${number}` | '/api/nodes' | `/api/users/${number}`

// Conditional types
export type IsDocument<T> = T extends Document ? true : false
export type ExtractNodeType<T> = T extends { type: infer U } ? U : never

// Mapped types
export type NodeFlags = {
  [K in keyof Node as `is${Capitalize<string & K>}`]?: boolean
}

// Index signatures
export interface SearchCriteria {
  [key: string]: string | number | boolean | undefined
}

// Const assertions and enums
export const NODE_TYPES = ['folder', 'document', 'link'] as const
export const PERMISSIONS = ['read', 'write', 'admin'] as const

// Enum alternative using object
export const NodeStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

export type NodeStatusType = typeof NodeStatus[keyof typeof NodeStatus]
