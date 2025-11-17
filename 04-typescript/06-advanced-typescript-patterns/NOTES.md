# Lesson 6: Advanced TypeScript Patterns

## Overview

Master advanced TypeScript features for production-grade applications.

## Conditional Types

```typescript
type IsArray<T> = T extends any[] ? true : false
type ExtractArrayType<T> = T extends (infer U)[] ? U : T
```

## Mapped Types

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type Partial<T> = {
  [K in keyof T]?: T[K]
}
```

## Template Literal Types

```typescript
type HTTPMethod = 'GET' | 'POST'
type Endpoint = 'users' | 'posts'
type APIRoute = `/${Lowercase<HTTPMethod>}/${Endpoint}`
// Result: '/get/users' | '/get/posts' | '/post/users' | '/post/posts'
```

## Module Augmentation

```typescript
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
  }
}
```

## Declaration Merging

```typescript
interface Window {
  myCustomProperty: string
}

window.myCustomProperty = 'value'
```

## Resources

- [TypeScript Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
