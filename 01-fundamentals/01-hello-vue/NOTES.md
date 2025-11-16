# Learning Notes - Hello Vue

## Overview
This app demonstrates the core concepts of Vue 3's reactivity system. Every time you type in an input or change a value, Vue automatically updates the display. This is **reactivity** in action.

## Key Concepts Explained

### 1. Creating a Vue App

```javascript
const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // ... our code
    }
}).mount('#app');
```

**What's happening:**
- `createApp()` creates a new Vue application instance
- `setup()` is where we initialize our reactive data and logic
- `.mount('#app')` attaches the Vue app to the HTML element with id="app"

**Vue 2 Difference:** In Vue 2, we used `new Vue({ el: '#app' })`. Vue 3's approach is more flexible.

---

### 2. Reactive Data with `ref()`

```javascript
const objectName = ref('Enterprise Workspace');
const objectId = ref(2000);
```

**What is `ref()`?**
- Creates a reactive reference to a value
- When the value changes, any template using it automatically updates
- Access the value with `.value` in JavaScript, but NOT in templates

**Example:**
```javascript
// In setup() function:
objectName.value = 'New Name';  // Need .value

// In template:
{{ objectName }}  // NO .value needed
```

**Why ref() instead of regular variables?**
Regular JavaScript variables aren't reactive. Vue can't detect when they change:
```javascript
let name = 'Test';  // Vue won't know when this changes
name = 'New';       // Template won't update!

const name = ref('Test');  // Vue CAN detect this
name.value = 'New';        // Template WILL update!
```

---

### 3. Two-Way Binding with `v-model`

```html
<input v-model="objectName" type="text" />
```

**What it does:**
- Binds the input value to our reactive data
- Changes in the input update the data
- Changes in the data update the input
- It's "two-way" because data flows both directions

**Without v-model, you'd need:**
```html
<input 
    :value="objectName" 
    @input="objectName = $event.target.value"
/>
```

**Modifiers:**
- `v-model.number` - converts input to number automatically
- `v-model.trim` - removes whitespace
- `v-model.lazy` - updates on change, not input

---

### 4. Computed Properties

```javascript
const fullDescription = computed(() => {
    return `${objectType.value} "${objectName.value}" (ID: ${objectId.value})`;
});
```

**What are computed properties?**
- Functions that automatically recalculate when their dependencies change
- Cached - only recalculate when needed
- Perfect for derived data

**When to use computed vs methods?**

**Use computed for:**
- Calculations based on reactive data
- Formatting or transforming data
- Anything that should update automatically

**Use methods for:**
- Event handlers
- Actions with side effects
- Operations not based on reactive data

**Example difference:**
```javascript
// Computed - recalculates automatically
const upperName = computed(() => objectName.value.toUpperCase());

// Method - must call explicitly
const toUpperCase = () => objectName.value.toUpperCase();
```

---

### 5. Template Syntax

**Interpolation:**
```html
{{ objectName }}  <!-- Displays the value -->
```

**Binding Attributes:**
```html
<span :class="['status', isActive ? 'active' : 'inactive']">
```
The `:` is shorthand for `v-bind:`

**Event Handling:**
```html
<button @click="resetObject">
```
The `@` is shorthand for `v-on:`

**Conditional Display:**
```html
{{ objectName || '(not set)' }}  <!-- Fallback value -->
```

---

### 6. Methods

```javascript
const resetObject = () => {
    objectName.value = 'Enterprise Workspace';
    objectId.value = 2000;
    // ...
};
```

**Key points:**
- Regular JavaScript functions
- Can modify reactive data
- Can be called from templates
- Remember to use `.value` when accessing refs!

---

### 7. Returning from setup()

```javascript
return {
    objectName,
    objectId,
    fullDescription,
    resetObject
};
```

**Important:**
- Only returned items are available in the template
- If you forget to return something, you'll get "undefined" errors
- This is Vue 3's way of explicitly declaring what's public

---

## Common Mistakes to Avoid

### 1. Forgetting .value in JavaScript
```javascript
// ❌ Wrong
objectName = 'New Name';

// ✅ Correct
objectName.value = 'New Name';
```

### 2. Using .value in templates
```html
<!-- ❌ Wrong -->
{{ objectName.value }}

<!-- ✅ Correct -->
{{ objectName }}
```

### 3. Forgetting to return from setup()
```javascript
// ❌ Won't work in template
setup() {
    const name = ref('Test');
    // Forgot to return!
}

// ✅ Correct
setup() {
    const name = ref('Test');
    return { name };
}
```

---

## Reactivity in Action

**Try this in the app:**

1. Type in the "Object Name" field
2. Watch how "Full Description" updates immediately
3. Change the "Object Type" dropdown
4. Notice how "Object Path" changes automatically
5. Uncheck "Object is Active"
6. See how "Can Edit" updates

**What you're seeing:**
- Vue tracks which computed properties depend on which reactive data
- When reactive data changes, Vue updates only what needs updating
- This happens automatically - you don't manage it!

---

## Vue 2 vs Vue 3 Comparison

| Concept | Vue 2 | Vue 3 |
|---------|-------|-------|
| App Creation | `new Vue({})` | `createApp({})` |
| Reactive Data | `data() { return {} }` | `ref()` or `reactive()` |
| Accessing Data | `this.objectName` | `objectName.value` |
| Template Access | `{{ objectName }}` | `{{ objectName }}` (same!) |
| Computed | `computed: {}` | `computed(() => {})` |
| Methods | `methods: {}` | Regular functions |

---

## Exercises to Try

1. **Add a new field:** Create a "Created Date" field with a date input
2. **Add validation:** Show a warning if objectId is less than 1000
3. **Add more computed properties:** Calculate "Days Since Creation"
4. **Add a counter:** Track how many times the reset button is clicked

---

## Next Steps

Now that you understand:
- How to create reactive data with `ref()`
- How to bind data with `v-model`
- How to create computed properties
- How to handle events with methods

You're ready for **Lesson 2: Components!**

In the next lesson, we'll break this single-file app into reusable components.
