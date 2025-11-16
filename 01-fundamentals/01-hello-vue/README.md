# Hello Vue - Your First Vue 3 App

## What We're Building

A simple Content Server object information display that demonstrates Vue's core reactivity system.

**Features:**
- Display object properties (ID, name, type)
- Update values in real-time
- Calculate derived information
- Handle user input

## Concepts Learned

1. **Vue App Setup** - Creating a Vue application
2. **Reactive Data** - Using `ref()` and `reactive()`
3. **Template Syntax** - Displaying data with `{{ }}`
4. **Two-way Binding** - Using `v-model`
5. **Methods** - Handling user actions
6. **Computed Properties** - Derived data that auto-updates

## Files

- `index.html` - Our complete single-file app (using CDN)
- `NOTES.md` - Detailed explanations and learnings

## How to Run

Just open `index.html` in your browser! No build tools needed for this first example.

## What's Different from Vue 2?

- **Composition API**: We use `createApp()` instead of `new Vue()`
- **ref() and reactive()**: New way to create reactive data
- **setup() function**: Modern way to initialize component logic
- No more implicit `this` context in templates

## Next Steps

After mastering this example, we'll break it into components in the next lesson.
