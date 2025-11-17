<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Primitive types
const message = ref<string>('Hello TypeScript')
const count = ref<number>(42)
const isActive = ref<boolean>(true)
const nullValue = ref<null>(null)
const undefinedValue = ref<undefined>(undefined)

// Arrays
const numbers = ref<number[]>([1, 2, 3, 4, 5])
const names = ref<Array<string>>(['Alice', 'Bob', 'Charlie']) // Alternative syntax

// Tuples - Fixed-length arrays with specific types
const coordinate = ref<[number, number]>([10, 20])
const userInfo = ref<[string, number, boolean]>(['John', 30, true])

// Any - Avoid when possible!
const anything = ref<any>('Can be anything')

// Unknown - Type-safe alternative to any
const something = ref<unknown>('Must check type before use')

// Void - Function returns nothing
const logMessage = (): void => {
  console.log('This function returns nothing')
}

// Never - Function never returns
const throwError = (msg: string): never => {
  throw new Error(msg)
}

// Object types
const user = ref<{ name: string; age: number }>({
  name: 'Alice',
  age: 25
})

// Functions
const greet = (name: string): string => {
  return `Hello, ${name}!`
}

const add = (a: number, b: number): number => {
  return a + b
}

// Optional parameters
const greetOptional = (name: string, greeting?: string): string => {
  return `${greeting || 'Hello'}, ${name}!`
}

// Default parameters
const greetDefault = (name: string, greeting: string = 'Hello'): string => {
  return `${greeting}, ${name}!`
}

// Rest parameters
const sum = (...numbers: number[]): number => {
  return numbers.reduce((acc, n) => acc + n, 0)
}

const examples = ref<string[]>([])

onMounted(() => {
  examples.value = [
    `String: ${message.value}`,
    `Number: ${count.value}`,
    `Boolean: ${isActive.value}`,
    `Array: [${numbers.value.join(', ')}]`,
    `Tuple: [${coordinate.value.join(', ')}]`,
    `Function: ${greet('TypeScript')}`,
    `Optional: ${greetOptional('World')}`,
    `Default: ${greetDefault('Vue')}`,
    `Rest: ${sum(1, 2, 3, 4, 5)}`
  ]

  console.log('Basic Types Examples:', {
    message: message.value,
    count: count.value,
    isActive: isActive.value,
    numbers: numbers.value,
    names: names.value,
    coordinate: coordinate.value,
    user: user.value
  })
})
</script>

<template>
  <div class="example">
    <h2>Basic Types</h2>
    <p class="description">
      TypeScript provides several basic types for working with data.
      These are the building blocks of type-safe code.
    </p>

    <div class="section">
      <h3>Primitive Types</h3>
      <div class="code-block">
        <pre><code>const message: string = '{{ message }}'
const count: number = {{ count }}
const isActive: boolean = {{ isActive }}</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Arrays</h3>
      <div class="code-block">
        <pre><code>const numbers: number[] = [{{ numbers.join(', ') }}]
const names: Array&lt;string&gt; = [{{ names.map(n => `'${n}'`).join(', ') }}]</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Tuples</h3>
      <div class="code-block">
        <pre><code>const coordinate: [number, number] = [{{ coordinate[0] }}, {{ coordinate[1] }}]
const userInfo: [string, number, boolean] = ['{{ userInfo[0] }}', {{ userInfo[1] }}, {{ userInfo[2] }}]</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Examples Output</h3>
      <ul class="results">
        <li v-for="(example, index) in examples" :key="index">
          {{ example }}
        </li>
      </ul>
    </div>

    <div class="tips">
      <h4>💡 Tips</h4>
      <ul>
        <li>Use <code>string</code>, <code>number</code>, <code>boolean</code> (lowercase) not String, Number, Boolean</li>
        <li>Avoid <code>any</code> - it defeats the purpose of TypeScript</li>
        <li>Use <code>unknown</code> instead of <code>any</code> when you need a type-safe alternative</li>
        <li>Tuples are great for fixed-length arrays like coordinates or key-value pairs</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.example {
  padding: 1rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

.section {
  margin-bottom: 2rem;
}

.section h3 {
  color: #34495e;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.code-block code {
  color: #e83e8c;
}

.results {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  list-style: none;
}

.results li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
}

.results li:last-child {
  border-bottom: none;
}

.tips {
  background: #e7f3ff;
  border-left: 4px solid #2196F3;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  margin-top: 2rem;
}

.tips h4 {
  color: #1976D2;
  margin-bottom: 0.5rem;
}

.tips ul {
  margin-left: 1.5rem;
  color: #2c3e50;
}

.tips li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.tips code {
  background: #bbdefb;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>
