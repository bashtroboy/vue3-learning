/**
 * Type Guards
 *
 * Type guards are functions that help TypeScript narrow down types.
 * They use the 'is' keyword to tell TypeScript about the type.
 */

import type { Node, Document, Folder, Link, AnyNode } from './content-server'

// Type guard for Document
export function isDocument(node: AnyNode): node is Document {
  return node.type === 'document'
}

// Type guard for Folder
export function isFolder(node: AnyNode): node is Folder {
  return node.type === 'folder'
}

// Type guard for Link
export function isLink(node: AnyNode): node is Link {
  return node.type === 'link'
}

// Generic type guard
export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj
}

// Null/undefined guards
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

// Array type guard
export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard)
}

// Example usage in a function
export function getNodeInfo(node: AnyNode): string {
  if (isDocument(node)) {
    // TypeScript knows node is Document here
    return `Document: ${node.name} (${node.size} bytes)`
  } else if (isFolder(node)) {
    // TypeScript knows node is Folder here
    return `Folder: ${node.name} (${node.children.length} items)`
  } else if (isLink(node)) {
    // TypeScript knows node is Link here
    return `Link: ${node.name} -> ${node.targetPath}`
  }

  // This should never happen with discriminated unions
  const _exhaustiveCheck: never = node
  return _exhaustiveCheck
}
