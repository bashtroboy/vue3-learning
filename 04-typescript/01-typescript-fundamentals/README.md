# Lesson 1: TypeScript Fundamentals

## 🎯 Learning Objectives

- Understand what TypeScript is and why it's useful
- Learn basic TypeScript types
- Create interfaces and type aliases
- Use generics effectively
- Apply utility types
- Write type guards

## 📚 What You'll Build

A **Content Server Type Library** with complete type definitions for nodes, users, permissions, and API responses.

## 🔑 Key Concepts

### 1. What is TypeScript?

TypeScript = JavaScript + Static Types

```typescript
// JavaScript (no type safety)
function getNodeName(node) {
  return node.name  // What if node is undefined?
}

// TypeScript (type safe!)
interface Node {
  id: number
  name: string
}

function getNodeName(node: Node): string {
  return node.name  // ✅ Guaranteed to exist!
}
```

### 2. Basic Types

```typescript
// Primitives
let nodeName: string = 'Documents'
let nodeId: number = 123
let isFolder: boolean = true
let value: null = null
let notDefined: undefined = undefined

// Arrays
let nodeIds: number[] = [1, 2, 3]
let names: Array<string> = ['folder1', 'folder2']

// Tuples (fixed-length arrays with specific types)
let nodeInfo: [number, string] = [123, 'Documents']

// Objects
let node: { id: number; name: string } = {
  id: 123,
  name: 'Documents'
}

// Functions
function createNode(name: string, type: string): number {
  // Returns node ID
  return 123
}

// Arrow functions
const deleteNode = (id: number): void => {
  console.log(`Deleting node ${id}`)
}

// Optional parameters
function fetchNode(id: number, includeMetadata?: boolean): void {
  // includeMetadata is optional
}

// Default parameters
function listNodes(pageSize: number = 25): void {
  // pageSize defaults to 25
}
```

### 3. Interfaces

```typescript
// Basic interface
interface ContentServerNode {
  id: number
  name: string
  type: 'folder' | 'document'  // Union type
  parent_id: number | null
  created_date: string
  modified_date: string
}

// Optional properties
interface NodeOptions {
  name: string
  description?: string  // Optional
  metadata?: Record<string, unknown>
}

// Readonly properties
interface ReadonlyNode {
  readonly id: number
  readonly type: string
  name: string  // Can be modified
}

// Index signatures (for dynamic properties)
interface NodeMetadata {
  [key: string]: string | number | boolean
}

// Extending interfaces
interface Folder extends ContentServerNode {
  type: 'folder'
  child_count: number
}

interface Document extends ContentServerNode {
  type: 'document'
  file_size: number
  mime_type: string
}

// Multiple extends
interface AdminFolder extends Folder, AuditInfo {
  admin_notes: string
}
```

### 4. Type Aliases

```typescript
// Basic type alias
type NodeID = number
type NodeName = string

// Object type
type Node = {
  id: NodeID
  name: NodeName
}

// Union types
type NodeType = 'folder' | 'document' | 'shortcut'
type Status = 'active' | 'archived' | 'deleted'

// Intersection types (combine types)
type AuditInfo = {
  created_by: number
  modified_by: number
}

type AuditedNode = Node & AuditInfo

// Function types
type NodeFetcher = (id: number) => Promise<Node>
type NodeValidator = (node: Node) => boolean

// Generic type alias
type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

type NodeResponse = ApiResponse<Node>
type NodesResponse = ApiResponse<Node[]>
```

### 5. Type vs Interface

**When to use Interface:**
- Defining object shapes
- When you might extend it later
- Public APIs
- React/Vue component props

**When to use Type:**
- Unions and intersections
- Mapped types
- Tuples
- Function types
- Primitives and literal types

```typescript
// ✅ Interface for object shapes
interface User {
  id: number
  name: string
}

// ✅ Type for unions
type Role = 'admin' | 'user' | 'guest'

// ✅ Type for complex combinations
type AdminUser = User & { role: 'admin'; permissions: string[] }

// Both can be extended
interface ExtendedUser extends User {
  email: string
}

type ExtendedUser2 = User & {
  email: string
}
```

### 6. Generics

```typescript
// Generic function
function getFirstItem<T>(array: T[]): T | undefined {
  return array[0]
}

const firstNumber = getFirstItem([1, 2, 3])  // number | undefined
const firstName = getFirstItem(['a', 'b'])    // string | undefined

// Generic interface
interface ApiResponse<T> {
  data: T
  error: string | null
  loading: boolean
}

const nodeResponse: ApiResponse<Node> = {
  data: { id: 1, name: 'Doc' },
  error: null,
  loading: false
}

// Generic with constraints
interface HasId {
  id: number
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id)
}

// Multiple type parameters
function mapData<Input, Output>(
  data: Input[],
  mapper: (item: Input) => Output
): Output[] {
  return data.map(mapper)
}

// Default type parameters
interface Cache<T = unknown> {
  data: T
  timestamp: number
}
```

### 7. Union and Intersection Types

```typescript
// Union types (OR)
type Result = Success | Error

interface Success {
  type: 'success'
  data: Node
}

interface Error {
  type: 'error'
  message: string
}

function handleResult(result: Result) {
  if (result.type === 'success') {
    console.log(result.data)  // TypeScript knows it's Success
  } else {
    console.log(result.message)  // TypeScript knows it's Error
  }
}

// Intersection types (AND)
type Timestamped = {
  created_at: Date
  updated_at: Date
}

type Owner = {
  owner_id: number
  owner_name: string
}

type AuditedNode = Node & Timestamped & Owner

// Using both
type NodeOrError = Node | { error: string }
type NodeWithMetadata = Node & { metadata: Record<string, unknown> }
```

### 8. Utility Types

```typescript
interface Node {
  id: number
  name: string
  type: 'folder' | 'document'
  created_date: string
  modified_date: string
}

// Partial - Make all properties optional
type PartialNode = Partial<Node>
// { id?: number; name?: string; ... }

// Required - Make all properties required
type RequiredNode = Required<PartialNode>

// Pick - Select specific properties
type NodeIdentifier = Pick<Node, 'id' | 'name'>
// { id: number; name: string }

// Omit - Exclude specific properties
type NodeWithoutDates = Omit<Node, 'created_date' | 'modified_date'>
// { id: number; name: string; type: ... }

// Readonly - Make all properties readonly
type ImmutableNode = Readonly<Node>

// Record - Create object type with specific keys
type NodeCache = Record<number, Node>
// { [key: number]: Node }

// Extract - Extract types from union
type DocumentType = Extract<'folder' | 'document' | 'shortcut', 'document'>
// 'document'

// Exclude - Exclude types from union
type NonDocument = Exclude<'folder' | 'document' | 'shortcut', 'document'>
// 'folder' | 'shortcut'

// ReturnType - Get function return type
function fetchNode(): Promise<Node> {
  return Promise.resolve({ id: 1, name: 'Doc' } as Node)
}
type FetchNodeReturn = ReturnType<typeof fetchNode>
// Promise<Node>

// Parameters - Get function parameter types
type FetchNodeParams = Parameters<typeof fetchNode>
// []
```

### 9. Type Guards

```typescript
// typeof guards
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()  // TypeScript knows it's string
  } else {
    return value.toFixed(2)  // TypeScript knows it's number
  }
}

// instanceof guards
class FolderNode {
  children: Node[] = []
}

function processNode(node: Node | FolderNode) {
  if (node instanceof FolderNode) {
    console.log(node.children)  // TypeScript knows it's FolderNode
  }
}

// in operator guards
interface Folder {
  type: 'folder'
  children: Node[]
}

interface Document {
  type: 'document'
  file_size: number
}

function displayNode(node: Folder | Document) {
  if ('children' in node) {
    console.log(`Folder with ${node.children.length} children`)
  } else {
    console.log(`Document of size ${node.file_size}`)
  }
}

// Custom type guards
function isFolder(node: Node): node is Folder {
  return node.type === 'folder'
}

function processNode(node: Node) {
  if (isFolder(node)) {
    // TypeScript knows node is Folder
    console.log(node.children)
  }
}

// Discriminated unions
type ApiResult =
  | { status: 'success'; data: Node }
  | { status: 'error'; error: string }
  | { status: 'loading' }

function handleApiResult(result: ApiResult) {
  switch (result.status) {
    case 'success':
      console.log(result.data)  // TypeScript knows data exists
      break
    case 'error':
      console.log(result.error)  // TypeScript knows error exists
      break
    case 'loading':
      console.log('Loading...')
      break
  }
}
```

## 🎨 Content Server Type Library

Here's a complete example for Content Server:

```typescript
// Base types
type NodeID = number
type UserID = number
type DateString = string

// Node types
type NodeType = 'folder' | 'document' | 'shortcut' | 'custom'
type NodeStatus = 'active' | 'archived' | 'deleted'

// Base node interface
interface BaseNode {
  id: NodeID
  name: string
  type: NodeType
  parent_id: NodeID | null
  created_date: DateString
  modified_date: DateString
  created_by: UserID
  modified_by: UserID
  status: NodeStatus
}

// Specific node types
interface FolderNode extends BaseNode {
  type: 'folder'
  child_count: number
  has_children: boolean
}

interface DocumentNode extends BaseNode {
  type: 'document'
  file_size: number
  mime_type: string
  version: number
  is_checked_out: boolean
}

// Union type for all nodes
type ContentServerNode = FolderNode | DocumentNode

// Permissions
interface NodePermissions {
  can_read: boolean
  can_write: boolean
  can_delete: boolean
  can_add_items: boolean
  can_set_permissions: boolean
}

// Complete node with permissions
type FullNode = ContentServerNode & {
  permissions: NodePermissions
  metadata?: Record<string, unknown>
}

// API types
interface PaginationParams {
  page: number
  page_size: number
  sort_by?: keyof BaseNode
  sort_order?: 'asc' | 'desc'
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  has_more: boolean
}

type NodesResponse = PaginatedResponse<ContentServerNode>

// Search types
interface SearchFilters {
  type?: NodeType | NodeType[]
  status?: NodeStatus
  created_after?: DateString
  created_before?: DateString
  owner_id?: UserID
}

interface SearchParams extends PaginationParams {
  query: string
  filters?: SearchFilters
}

// User types
interface User {
  id: UserID
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  permissions: string[]
}

// API response wrapper
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  metadata?: {
    request_id: string
    timestamp: DateString
  }
}
```

## 💡 Best Practices

1. **Use strict mode** (in tsconfig.json)
2. **Avoid `any`** - Use `unknown` instead
3. **Use type inference** - Don't over-annotate
4. **Prefer interfaces for objects**
5. **Use readonly when appropriate**
6. **Create reusable types**
7. **Document complex types**

## ⚠️ Common Mistakes

1. **Overusing any**
   ```typescript
   // ❌ Bad
   const data: any = fetchData()

   // ✅ Good
   const data: Node = fetchData()
   // or
   const data: unknown = fetchData()
   ```

2. **Not using utility types**
   ```typescript
   // ❌ Bad
   interface UpdateNode {
     id?: number
     name?: string
     type?: string
   }

   // ✅ Good
   type UpdateNode = Partial<Node>
   ```

3. **Type assertions without guards**
   ```typescript
   // ❌ Unsafe
   const node = data as Node

   // ✅ Safe
   if (isNode(data)) {
     const node = data  // TypeScript knows it's Node
   }
   ```

## 🎯 Exercises

1. Create type definitions for Content Server API
2. Build a type-safe cache system
3. Create custom type guards
4. Use utility types for CRUD operations
5. Type a complete API client

## 🔗 Next Steps

- [Lesson 2: Components with TypeScript](../02-components-with-typescript/README.md)
- Read NOTES.md for advanced patterns
- Practice with exercises

---

**Time:** 2-3 hours | **Difficulty:** Beginner to Intermediate
