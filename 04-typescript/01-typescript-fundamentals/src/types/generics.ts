/**
 * Generic Types Examples
 *
 * Generics allow you to write reusable code that works with multiple types
 * while maintaining type safety.
 */

import type { ApiResponse, Node } from './content-server'

// Generic function
export function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

// Generic function with constraints
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// Generic interface
export interface Repository<T> {
  getAll(): Promise<T[]>
  getById(id: number): Promise<T | null>
  create(item: Omit<T, 'id'>): Promise<T>
  update(id: number, item: Partial<T>): Promise<T>
  delete(id: number): Promise<boolean>
}

// Generic class
export class DataStore<T extends { id: number }> {
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

  remove(id: number): boolean {
    return this.items.delete(id)
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate)
  }
}

// Generic with multiple type parameters
export function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}

// Generic with default type parameter
export interface Container<T = string> {
  value: T
  setValue(value: T): void
  getValue(): T
}

// Conditional generic types
export type Unwrap<T> = T extends Promise<infer U> ? U : T
export type ArrayElement<T> = T extends (infer U)[] ? U : never

// Generic utility function
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3
): Promise<ApiResponse<T>> {
  let lastError: string | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetchFn()
      if (response.success) {
        return response
      }
      lastError = response.error
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error'
    }
  }

  return {
    success: false,
    data: null,
    error: lastError || 'Failed after retries',
    timestamp: new Date().toISOString()
  }
}

// Generic builder pattern
export class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = []
  private sortFn?: (a: T, b: T) => number
  private limitValue?: number

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate)
    return this
  }

  sort(comparator: (a: T, b: T) => number): this {
    this.sortFn = comparator
    return this
  }

  limit(count: number): this {
    this.limitValue = count
    return this
  }

  execute(items: T[]): T[] {
    let result = items.filter(item =>
      this.filters.every(filter => filter(item))
    )

    if (this.sortFn) {
      result = result.sort(this.sortFn)
    }

    if (this.limitValue !== undefined) {
      result = result.slice(0, this.limitValue)
    }

    return result
  }
}
