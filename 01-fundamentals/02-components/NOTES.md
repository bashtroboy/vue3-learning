# Learning Notes - Components

## Overview

This lesson takes the exact same app from Lesson 1 and breaks it into components. The functionality is identical, but the code is now modular, reusable, and maintainable.

## What Are Components?

**Components are reusable Vue instances with their own:**
- Template (HTML structure)
- Logic (setup function, data, computed properties, methods)
- Props (inputs from parent)
- Events (outputs to parent)
- Optional: Styles (we'll add this in later lessons)

Think of components like LEGO blocks - you build complex applications by combining simple, reusable pieces.

---

## Component Anatomy

### Basic Structure

```javascript
const MyComponent = {
    props: {
        // What data this component receives
    },
    emits: ['event-name'],  // What events this component can emit
    setup(props) {
        // Component logic here
        return {
            // What's available in the template
        };
    },
    template: `
        <!-- Component HTML here -->
    `
};
```

---

## 1. Creating a Simple Component: StatusBadge

```javascript
const StatusBadge = {
    props: {
        isActive: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <span :class="['status-badge', isActive ? 'active' : 'inactive']">
            {{ isActive ? 'Active' : 'Inactive' }}
        </span>
    `
};
```

**What's happening:**
- `props` defines what data this component accepts
- `isActive` is a Boolean prop that's required
- The template uses `isActive` directly (no .value needed!)
- Component name is PascalCase in JavaScript, kebab-case in templates

**Using it:**
```html
<status-badge :is-active="true"></status-badge>
<status-badge :is-active="objectData.isActive"></status-badge>
```

The `:` before `is-active` means we're binding a JavaScript expression, not passing a string.

---

## 2. Props - Passing Data to Components

### What Are Props?

Props are the way parent components pass data to child components. Think of them as function parameters for components.

### Defining Props

```javascript
props: {
    objectData: {
        type: Object,          // Type validation
        required: true,        // Must be provided
        default: () => ({})    // Default value (for non-required props)
    }
}
```

**Prop Types:**
- `String`, `Number`, `Boolean`, `Array`, `Object`, `Function`
- Can also be a custom validator function

### Accessing Props

**In setup():**
```javascript
setup(props) {
    console.log(props.objectData);  // Access as props.propName
}
```

**In template:**
```html
{{ objectData.name }}  <!-- Direct access, no 'props.' needed -->
```

### Props Are One-Way

**Important:** Props flow DOWN from parent to child. Children should NEVER modify props directly.

```javascript
// ❌ NEVER DO THIS
props.objectData.name = 'New Name';  // Mutating props is bad!

// ✅ Instead, emit an event to the parent
$emit('update:name', 'New Name');
```

---

## 3. Events (Emits) - Child to Parent Communication

### Why Events?

Since props are one-way (parent → child), we need events for child → parent communication.

### Defining Emits

```javascript
const ObjectForm = {
    emits: ['update:name', 'update:id', 'reset'],
    // ...
}
```

This declares what events the component can emit. It's optional but good practice for documentation.

### Emitting Events

**In template:**
```html
<button @click="$emit('reset')">Reset</button>

<input 
    :value="objectData.name"
    @input="$emit('update:name', $event.target.value)"
/>
```

**In setup():**
```javascript
setup(props, { emit }) {
    const handleReset = () => {
        emit('reset');
    };
    
    const updateName = (newName) => {
        emit('update:name', newName);
    };
    
    return { handleReset, updateName };
}
```

### Listening to Events

**Parent component:**
```html
<object-form
    @reset="resetObject"
    @update:name="objectData.name = $event"
></object-form>
```

**What's `$event`?**
- It's the value passed when emitting: `emit('update:name', 'New Value')`
- In the parent, `$event` contains `'New Value'`

---

## 4. Component Composition

### Nested Components

Components can use other components! This is how you build complex UIs.

```javascript
const InfoCard = {
    components: {
        StatusBadge  // Register StatusBadge for use in this component
    },
    template: `
        <div>
            <status-badge :is-active="objectData.isActive"></status-badge>
        </div>
    `
};
```

### Registering Components

**Local Registration (component-specific):**
```javascript
const InfoCard = {
    components: {
        StatusBadge  // Only available in InfoCard
    }
};
```

**Global Registration (app-wide):**
```javascript
createApp({
    components: {
        ObjectForm,    // Available everywhere in this app
        InfoCard
    }
});
```

---

## 5. Computed Properties in Components

Components can have their own computed properties!

```javascript
const ComputedInfo = {
    props: {
        objectData: Object
    },
    setup(props) {
        const fullDescription = computed(() => {
            return `${props.objectData.type} "${props.objectData.name}"`;
        });
        
        return { fullDescription };
    }
};
```

**Key point:** Access props via `props.propName` in computed functions.

---

## 6. Component Communication Patterns

### Pattern 1: Props Down, Events Up

```
Parent Component (has data)
    ↓ props
Child Component (displays/edits data)
    ↑ events
Parent Component (updates data)
```

This is the fundamental Vue pattern.

### Pattern 2: v-model Pattern

For two-way binding, Vue has a special pattern:

```html
<!-- Instead of this: -->
<input 
    :value="name" 
    @input="name = $event.target.value"
/>

<!-- We can use v-model: -->
<input v-model="name" />
```

For custom components, we emit `update:modelValue`:

```javascript
// Child component
emit('update:modelValue', newValue);

// Parent can use v-model
<my-component v-model="myData"></my-component>
```

---

## 7. Component Design Principles

### Single Responsibility

Each component should do ONE thing well.

**Good:**
- `StatusBadge` - displays status
- `ObjectForm` - edits object
- `InfoCard` - displays info

**Bad:**
- `ObjectFormAndInfoCardAndEverythingElse` - does too much

### Reusability

Design components to be reusable with different data.

```javascript
// ✅ Reusable - works with any object
<info-card :object-data="anyObject"></info-card>

// ❌ Not reusable - hardcoded to specific data
<info-card></info-card>  // Gets data from global variable
```

### Clear Interfaces

Props and events define your component's API. Make them clear:

```javascript
props: {
    objectData: Object,    // Clear: expects object data
    isActive: Boolean,     // Clear: expects boolean
    userId: Number         // Clear: expects number
}

emits: ['update:name', 'delete', 'save']  // Clear: these events can happen
```

---

## 8. Common Component Patterns

### Display Component (No State)

```javascript
const StatusBadge = {
    props: { isActive: Boolean },
    template: `<span>{{ isActive ? 'Active' : 'Inactive' }}</span>`
};
```

Receives data, displays it. No internal state.

### Form Component (Emits Changes)

```javascript
const ObjectForm = {
    props: { objectData: Object },
    emits: ['update:name'],
    template: `
        <input 
            :value="objectData.name"
            @input="$emit('update:name', $event.target.value)"
        />
    `
};
```

Receives data, lets user edit, emits changes.

### Container Component (Manages State)

```javascript
createApp({
    setup() {
        const objectData = ref({ name: 'Test' });
        return { objectData };
    },
    template: `
        <object-form :object-data="objectData" @update:name="objectData.name = $event">
        </object-form>
    `
});
```

Owns the data, passes to children, handles updates.

---

## 9. Component vs Single-File Structure

### Lesson 1 (Single File)

```javascript
setup() {
    const objectName = ref('...');
    const objectId = ref('...');
    const objectType = ref('...');
    
    const fullDescription = computed(() => ...);
    const objectPath = computed(() => ...);
    
    const resetObject = () => { ... };
    
    return { objectName, objectId, ... };  // Lots to return!
}
```

### Lesson 2 (Components)

```javascript
setup() {
    const objectData = ref({ ... });  // One object
    const resetObject = () => { ... };
    return { objectData, resetObject };  // Much simpler!
}
```

Components let us split complex UIs into manageable pieces.

---

## 10. Debugging Components

### Vue DevTools

Install Vue DevTools browser extension to:
- Inspect component hierarchy
- See props and data
- Track events
- Time travel through state changes

### Console Logging

```javascript
setup(props) {
    console.log('Component mounted with props:', props);
    
    const handleEvent = () => {
        console.log('Event triggered');
    };
}
```

### Common Issues

**1. Prop not showing up:**
- Did you bind it with `:`? (`:prop="value"` not `prop="value"`)
- Is it spelled correctly? (camelCase in JS, kebab-case in HTML)

**2. Event not firing:**
- Did you declare it in `emits`?
- Are you listening with `@event-name`?
- Check the event name spelling

**3. Component not rendering:**
- Did you register it in `components`?
- Is the name correct in the template?

---

## Comparing to Lesson 1

### Before (Lesson 1):
```javascript
// Everything in one place
setup() {
    const objectName = ref('...');
    const objectId = ref('...');
    // ... 50 more lines ...
}
```

### After (Lesson 2):
```javascript
// Main app - simple coordination
setup() {
    const objectData = ref({ ... });
    return { objectData };
}

// ObjectForm - handles form logic
// InfoCard - handles display logic
// StatusBadge - handles status display
// ComputedInfo - handles calculations
```

**Benefits:**
- ✅ Each component has a single responsibility
- ✅ Components can be reused in other parts of the app
- ✅ Easier to test individual pieces
- ✅ Multiple developers can work on different components
- ✅ Changes are isolated to specific components

---

## Real-World Application: Application Analyzer

The Application Analyzer likely has components like:

```
AppAnalyzer (root)
├── NavigationBar
├── SidebarMenu
│   ├── MenuItem (reused multiple times)
│   └── SubMenuItem
├── ContentArea
│   ├── TreeView
│   │   └── TreeNode (reused recursively)
│   ├── DataTable
│   │   ├── TableHeader
│   │   ├── TableRow (reused for each row)
│   │   └── TableCell
│   └── DetailsPanel
│       ├── PropertyList
│       └── ActionButtons
└── FooterBar
```

Each component has a clear purpose and can be developed/tested independently.

---

## Exercises

### 1. Add a New Component
Create a `TypeBadge` component that displays the object type with different colors:
- Folder: blue
- Document: green  
- Category: orange
- Workflow: purple

### 2. Extract More Components
Break `InfoCard` into smaller components:
- `InfoRow` - for each row of information
- Use it multiple times in `InfoCard`

### 3. Add Validation
Make `ObjectForm` show an error if:
- Name is empty
- ID is less than 1000

Emit a `validation-error` event when invalid.

### 4. Create a Counter Component
Build a simple counter that:
- Has + and - buttons
- Emits `increment` and `decrement` events
- Displays the current count (passed as prop)

---

## Key Takeaways

1. **Components are reusable Vue instances** with their own logic and templates
2. **Props pass data down** from parent to child (one-way)
3. **Events communicate up** from child to parent
4. **Component composition** lets you build complex UIs from simple pieces
5. **Single responsibility** - each component should do one thing well
6. **Clear interfaces** - well-defined props and events make components easy to use

---

## Next Steps

After mastering components, you're ready for:
- **Lesson 3: Lists & Conditionals** - v-for, v-if, filtering, sorting
- **Lesson 4: Forms** - Complex form handling and validation

Then we'll move to building real Content Server tools using everything you've learned!

---

## Vue 2 vs Vue 3 Components

| Feature | Vue 2 | Vue 3 |
|---------|-------|-------|
| Definition | `Vue.component()` or object | Same object structure |
| Template | `template: '...'` | Same |
| Props | `props: []` or `props: {}` | Same |
| Events | `this.$emit()` | `emit()` from setup context |
| Data | `data() { return {} }` | `ref()` or `reactive()` in setup |
| Computed | `computed: {}` | `computed(() => {})` in setup |
| Methods | `methods: {}` | Regular functions in setup |

The biggest difference: Vue 3 uses the Composition API with `setup()` instead of Options API.
