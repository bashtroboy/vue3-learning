# Lesson 1: TypeScript Fundamentals - Detailed Notes

## Introduction

TypeScript is a strongly typed superset of JavaScript that adds static type checking at compile time. It helps catch errors early, improves code quality, and enhances developer experience with better IDE support.

## Why TypeScript?

### Benefits

1. **Early Error Detection** - Catch type errors before runtime
2. **Better IDE Support** - Autocomplete, refactoring, go-to-definition
3. **Self-Documenting** - Types serve as inline documentation
4. **Safer Refactoring** - Confidence when changing code
5. **Team Collaboration** - Clear contracts between code modules

### When to Use TypeScript

- Large codebases with multiple developers
- Long-term projects requiring maintainability
- Projects where reliability is critical
- When you want excellent IDE support

## Basic Types

### Primitive Types

```typescript
// String
const message: string = 'Hello'
const name: string = "Alice"
const template: string = `Welcome, ${name}`

// Number (integers and floats)
const age: number = 25
const price: number = 99.99
const hex: number = 0xf00d
const binary: number = 0b1010
const octal: number = 0o744

// Boolean
const isActive: boolean = true
const hasPermission: boolean = false

// Null and Undefined
const nullValue: null = null
const undefinedValue: undefined = undefined
```

### Arrays

```typescript
// Array syntax 1
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ['Alice', 'Bob', 'Charlie']

// Array syntax 2 (generic)
const numbers: Array<number> = [1, 2, 3]
const names: Array<string> = ['Alice', 'Bob']

// Mixed arrays with union types
const mixed: (string | number)[] = ['hello', 42, 'world', 99]
```

### Tuples

Tuples are fixed-length arrays where each element has a specific type:

```typescript
// Tuple - [x, y] coordinates
const point: [number, number] = [10, 20]

// Tuple with different types
const user: [string, number, boolean] = ['Alice', 30, true]

// Named tuples (TypeScript 4.0+)
type Point = [x: number, y: number]
const p: Point = [10, 20]

// Accessing tuple elements
const name = user[0] // string
const age = user[1]  // number

// ❌ Error: Tuple of wrong length
const invalid: [number, number] = [1, 2, 3]
```

### Any Type

The `any` type opts out of type checking. **Avoid using it!**

```typescript
let anything: any = 'hello'
anything = 42        // OK
anything = true      // OK
anything.foo.bar()   // No error, but may crash at runtime!

// When any might be acceptable:
// - Migrating JavaScript to TypeScript gradually
// - Working with truly dynamic data
// - Prototyping (but remove later!)
```

### Unknown Type

`unknown` is the type-safe counterpart of `any`:

```typescript
let value: unknown = 'hello'

// ❌ Error: Can't use unknown without checking
value.toUpperCase()

// ✅ Correct: Check type first
if (typeof value === 'string') {
  value.toUpperCase() // OK now
}
```

### Void, Never, and Undefined

```typescript
// Void - function returns nothing
function log(message: string): void {
  console.log(message)
  // No return statement
}

// Never - function never returns
function throwError(msg: string): never {
  throw new Error(msg)
}

function infiniteLoop(): never {
  while (true) {
    // ...
  }
}

// Undefined - variable might not have a value
let maybeValue: undefined = undefined
```

## Interfaces

Interfaces define the shape of objects:

```typescript
interface User {
  id: number
  name: string
  email: string
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
}

// ❌ Error: Missing required property
const invalid: User = {
  id: 1,
  name: 'Bob'
  // Missing email!
}
```

### Optional Properties

```typescript
interface Node {
  id: number
  name: string
  metadata?: Record<string, unknown> // Optional
}

const node1: Node = { id: 1, name: 'Document' } // OK
const node2: Node = {
  id: 2,
  name: 'Folder',
  metadata: { tags: ['important'] }
} // Also OK
```

### Readonly Properties

```typescript
interface Config {
  readonly apiUrl: string
  readonly timeout: number
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
}

// ❌ Error: Cannot modify readonly property
config.apiUrl = 'https://other.com'
```

### Extending Interfaces

```typescript
interface Node {
  id: number
  name: string
  type: string
}

interface Document extends Node {
  type: 'document'
  content: string
  size: number
}

const doc: Document = {
  id: 1,
  name: 'file.txt',
  type: 'document',
  content: 'Hello',
  size: 1024
}
```

## Type Aliases

Type aliases create custom type names:

```typescript
// Primitive type alias
type NodeId = number
type NodeName = string

// Object type alias
type User = {
  id: number
  name: string
  email: string
}

// Union type alias
type Status = 'pending' | 'active' | 'completed'

// Function type alias
type Validator = (value: string) => boolean
```

### Interface vs Type Alias

**Use Interfaces when:**
- Defining object shapes
- You might extend/merge later
- Public API definitions

**Use Type Aliases when:**
- Defining unions
- Defining primitives, tuples, functions
- Complex type transformations

```typescript
// Interface - can be extended
interface User {
  name: string
}

interface Admin extends User {
  permissions: string[]
}

// Type - more flexible
type StringOrNumber = string | number
type Coordinates = [number, number]
type Callback = () => void
```

## Union Types

Union types allow a value to be one of several types:

```typescript
// Simple union
type StringOrNumber = string | number

let value: StringOrNumber
value = 'hello' // OK
value = 42      // OK
value = true    // ❌ Error

// Union with null
type NullableString = string | null

// Multiple types
type ID = string | number | symbol

// Function parameter union
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}
```

### Discriminated Unions

A powerful pattern using a common property to distinguish between types:

```typescript
interface Circle {
  kind: 'circle'
  radius: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

type Shape = Circle | Rectangle

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      // TypeScript knows shape is Circle
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      // TypeScript knows shape is Rectangle
      return shape.width * shape.height
    default:
      // Exhaustiveness check
      const _exhaustive: never = shape
      return _exhaustive
  }
}
```

## Intersection Types

Intersection types combine multiple types:

```typescript
type Person = {
  name: string
  age: number
}

type Employee = {
  employeeId: number
  department: string
}

// Intersection combines both
type EmployeePerson = Person & Employee

const employee: EmployeePerson = {
  name: 'Alice',
  age: 30,
  employeeId: 12345,
  department: 'Engineering'
}
```

## Generics

Generics allow you to write reusable code that works with multiple types:

### Generic Functions

```typescript
// Generic identity function
function identity<T>(value: T): T {
  return value
}

const num = identity<number>(42)      // number
const str = identity<string>('hello') // string
const auto = identity(true)           // boolean (inferred)

// Generic with array
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const firstNum = first([1, 2, 3])        // number | undefined
const firstName = first(['a', 'b', 'c']) // string | undefined
```

### Generic Interfaces

```typescript
interface Box<T> {
  value: T
}

const numberBox: Box<number> = { value: 42 }
const stringBox: Box<string> = { value: 'hello' }

// Generic with multiple parameters
interface Pair<T, U> {
  first: T
  second: U
}

const pair: Pair<string, number> = {
  first: 'age',
  second: 30
}
```

### Generic Constraints

```typescript
// Constraint: T must have length property
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length)
}

logLength('hello')     // OK: string has length
logLength([1, 2, 3])   // OK: array has length
logLength({ length: 10 }) // OK: object has length
// logLength(42)       // ❌ Error: number doesn't have length

// Constraint: T must be a key of U
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { id: 1, name: 'Alice' }
const id = getProperty(user, 'id')     // number
const name = getProperty(user, 'name') // string
// getProperty(user, 'age')            // ❌ Error: 'age' doesn't exist
```

### Generic Classes

```typescript
class DataStore<T extends { id: number }> {
  private items: Map<number, T> = new Map()

  add(item: T): void {
    this.items.set(item.id, item)
  }

  get(id: number): T | undefined {
    return this.items.get(id)
  }

  getAll(): T[] {
    return Array.from(this.items.values())
  }
}

interface Node {
  id: number
  name: string
}

const nodeStore = new DataStore<Node>()
nodeStore.add({ id: 1, name: 'Document' })
```

## Utility Types

TypeScript provides built-in utility types for common transformations:

### Partial<T>

Makes all properties optional:

```typescript
interface Node {
  id: number
  name: string
  type: string
}

type PartialNode = Partial<Node>
// Result:
// {
//   id?: number
//   name?: string
//   type?: string
// }

function updateNode(id: number, updates: Partial<Node>) {
  // Can update any subset of properties
}

updateNode(1, { name: 'New Name' }) // OK
```

### Required<T>

Makes all properties required:

```typescript
interface Config {
  apiUrl?: string
  timeout?: number
}

type RequiredConfig = Required<Config>
// Result:
// {
//   apiUrl: string
//   timeout: number
// }
```

### Readonly<T>

Makes all properties readonly:

```typescript
interface User {
  name: string
  age: number
}

type ReadonlyUser = Readonly<User>
// Result:
// {
//   readonly name: string
//   readonly age: number
// }

const user: ReadonlyUser = { name: 'Alice', age: 30 }
// user.name = 'Bob' // ❌ Error
```

### Pick<T, K>

Select specific properties:

```typescript
interface Node {
  id: number
  name: string
  type: string
  createdAt: string
  modifiedAt: string
}

type NodeSummary = Pick<Node, 'id' | 'name' | 'type'>
// Result:
// {
//   id: number
//   name: string
//   type: string
// }
```

### Omit<T, K>

Exclude specific properties:

```typescript
type CreateNodeData = Omit<Node, 'id' | 'createdAt' | 'modifiedAt'>
// Result:
// {
//   name: string
//   type: string
// }

function createNode(data: CreateNodeData): Node {
  return {
    ...data,
    id: Math.random(),
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  }
}
```

### Record<K, T>

Create object type with specific keys and values:

```typescript
type NodeMap = Record<number, Node>
// Equivalent to: { [id: number]: Node }

const nodes: NodeMap = {
  1: { id: 1, name: 'First', ... },
  2: { id: 2, name: 'Second', ... }
}

type Permissions = Record<'read' | 'write' | 'admin', boolean>
const perms: Permissions = {
  read: true,
  write: false,
  admin: false
}
```

### Exclude<T, U>

Remove types from union:

```typescript
type AllTypes = 'folder' | 'document' | 'link'
type NoLink = Exclude<AllTypes, 'link'>
// Result: 'folder' | 'document'
```

### Extract<T, U>

Extract types from union:

```typescript
type AllTypes = 'folder' | 'document' | 'link' | 'other'
type OnlyDocs = Extract<AllTypes, 'document' | 'link'>
// Result: 'document' | 'link'
```

### NonNullable<T>

Remove null and undefined:

```typescript
type NullableString = string | null | undefined
type DefiniteString = NonNullable<NullableString>
// Result: string
```

### ReturnType<T>

Get function return type:

```typescript
function getUser() {
  return { id: 1, name: 'Alice' }
}

type User = ReturnType<typeof getUser>
// Result: { id: number; name: string }
```

## Type Guards

Type guards help TypeScript narrow types:

### typeof

```typescript
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}
```

### instanceof

```typescript
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.log(error.message)
  }
}
```

### Custom Type Guards

```typescript
interface Document {
  type: 'document'
  content: string
}

function isDocument(obj: any): obj is Document {
  return obj && obj.type === 'document'
}

function processNode(node: unknown) {
  if (isDocument(node)) {
    // TypeScript knows node is Document
    console.log(node.content)
  }
}
```

### in operator

```typescript
interface Dog {
  bark(): void
}

interface Cat {
  meow(): void
}

type Pet = Dog | Cat

function speak(pet: Pet) {
  if ('bark' in pet) {
    pet.bark()
  } else {
    pet.meow()
  }
}
```

## Best Practices

### 1. Enable Strict Mode

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 2. Avoid `any`

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value
}

// ✅ Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value
  }
}

// ✅ Even Better
interface DataWithValue {
  value: string
}

function processData(data: DataWithValue) {
  return data.value
}
```

### 3. Use Type Inference

```typescript
// ❌ Over-annotated
const name: string = 'Alice'
const age: number = 30
const items: string[] = ['a', 'b', 'c']

// ✅ Let TypeScript infer
const name = 'Alice'       // string
const age = 30             // number
const items = ['a', 'b', 'c'] // string[]
```

### 4. Prefer Interfaces for Objects

```typescript
// ✅ Good
interface User {
  id: number
  name: string
}

// Also OK for simple cases
type User = {
  id: number
  name: string
}
```

### 5. Use Utility Types

```typescript
// ❌ Repetitive
interface CreateUserData {
  name: string
  email: string
}

interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

// ✅ DRY with utility types
interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

type CreateUserData = Omit<User, 'id' | 'createdAt'>
```

## Common Patterns

### API Response Type

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
  timestamp: string
}

// Usage
type NodeResponse = ApiResponse<Node>
type NodesResponse = ApiResponse<Node[]>
```

### Builder Pattern

```typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = []

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate)
    return this
  }

  execute(items: T[]): T[] {
    return items.filter(item =>
      this.filters.every(filter => filter(item))
    )
  }
}
```

### Discriminated Unions

```typescript
type AnyNode = Document | Folder | Link

function processNode(node: AnyNode) {
  switch (node.type) {
    case 'document':
      // node is Document
      return node.content
    case 'folder':
      // node is Folder
      return node.children
    case 'link':
      // node is Link
      return node.targetPath
  }
}
```

## Next Steps

- **Lesson 2:** Learn how to use TypeScript with Vue 3 components
- **Lesson 3:** Create type-safe composables
- **Lesson 4:** Type Pinia stores
- **Practice:** Try converting JavaScript code to TypeScript
- **Explore:** TypeScript playground (typescriptlang.org/play)

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Vue TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
