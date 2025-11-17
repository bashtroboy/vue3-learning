<script setup lang="ts">
// Conditional Types
type IsString<T> = T extends string ? true : false
type Test1 = IsString<string>  // true
type Test2 = IsString<number>  // false

// Mapped Types
type NodeFlags = {
  [K in 'id' | 'name' | 'type']: boolean
}

// Template Literal Types
type EventName = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<EventName>}`
// Result: 'onClick' | 'onFocus' | 'onBlur'

// Discriminated Unions
interface Success {
  status: 'success'
  data: string
}

interface Error {
  status: 'error'
  error: string
}

type Result = Success | Error

function handleResult(result: Result) {
  switch (result.status) {
    case 'success':
      console.log(result.data)  // TypeScript knows result is Success
      break
    case 'error':
      console.log(result.error) // TypeScript knows result is Error
      break
  }
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>🚀 Advanced TypeScript Patterns</h1>
      <p>Master advanced type system features</p>
    </header>

    <main class="content">
      <div class="section">
        <h2>Conditional Types</h2>
        <div class="code-block">
          <pre><code>type IsString&lt;T&gt; = T extends string ? true : false

type Test1 = IsString&lt;string&gt;  // true
type Test2 = IsString&lt;number&gt;  // false</code></pre>
        </div>
      </div>

      <div class="section">
        <h2>Mapped Types</h2>
        <div class="code-block">
          <pre><code>type NodeFlags = {
  [K in 'id' | 'name' | 'type']: boolean
}
// Result: { id: boolean; name: boolean; type: boolean }</code></pre>
        </div>
      </div>

      <div class="section">
        <h2>Template Literal Types</h2>
        <div class="code-block">
          <pre><code>type EventName = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize&lt;EventName&gt;}`
// Result: 'onClick' | 'onFocus' | 'onBlur'</code></pre>
        </div>
      </div>

      <div class="section">
        <h2>Discriminated Unions</h2>
        <div class="code-block">
          <pre><code>interface Success {
  status: 'success'
  data: string
}

interface Error {
  status: 'error'
  error: string
}

type Result = Success | Error

function handle(result: Result) {
  switch (result.status) {
    case 'success':
      console.log(result.data)  // ✅ Knows it's Success
    case 'error':
      console.log(result.error) // ✅ Knows it's Error
  }
}</code></pre>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app { max-width: 1200px; margin: 0 auto; }
.header { background: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem; }
.header h1 { color: #2c3e50; font-size: 2.5rem; margin-bottom: 0.5rem; }
.header p { color: #7f8c8d; font-size: 1.1rem; }
.content { background: white; padding: 2rem; border-radius: 12px; }
.section { margin-bottom: 2rem; }
.section h2 { color: #2c3e50; margin-bottom: 1rem; }
.code-block { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 1rem; overflow-x: auto; }
.code-block pre { margin: 0; font-family: Monaco, monospace; font-size: 0.85rem; line-height: 1.6; }
</style>
