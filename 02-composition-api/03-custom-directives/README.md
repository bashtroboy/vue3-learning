# Lesson 3: Custom Directives in Vue 3

## Overview

Custom directives allow you to apply low-level DOM manipulation in a reusable way. While Vue's declarative rendering handles most use cases, directives give you direct access to the DOM when needed for specialized functionality like focus management, tooltips, drag-and-drop, and third-party library integration.

This lesson covers everything from basic directives to advanced patterns with lifecycle hooks, arguments, and modifiers.

## What You'll Learn

- How to create custom directives
- Directive lifecycle hooks
- Using directive arguments and modifiers
- Common directive patterns (focus, click-outside, tooltips, lazy loading)
- Advanced directives (intersection observer, permissions, syntax highlighting)
- Best practices and performance considerations

## Prerequisites

- Understanding of Vue 3 Composition API
- Basic DOM manipulation knowledge
- Familiarity with Vue lifecycle concepts

## When to Use Custom Directives

**Use directives for:**
- Low-level DOM access
- Third-party library integration (charts, maps, etc.)
- Reusable DOM manipulation patterns
- Performance-critical operations

**Don't use directives for:**
- Complex UI logic (use components instead)
- Data transformation (use computed properties)
- State management (use stores)

## Getting Started

```bash
npm install
npm run dev
```

## Basic Directive Structure

### Minimal Directive

```javascript
const vDirectiveName = {
  mounted(el, binding) {
    // el: the element the directive is bound to
    // binding: object containing directive info
  }
}
```

### Full Lifecycle Hooks

```javascript
const vMyDirective = {
  // Called before element's attributes or event listeners are applied
  created(el, binding, vnode, prevVnode) {},

  // Called right before element is inserted into DOM
  beforeMount(el, binding, vnode, prevVnode) {},

  // Called when element is mounted
  mounted(el, binding, vnode, prevVnode) {},

  // Called before parent component updates
  beforeUpdate(el, binding, vnode, prevVnode) {},

  // Called after parent component updates
  updated(el, binding, vnode, prevVnode) {},

  // Called before parent component unmounts
  beforeUnmount(el, binding, vnode, prevVnode) {},

  // Called when parent component unmounts
  unmounted(el, binding, vnode, prevVnode) {}
}
```

## The binding Object

The `binding` parameter contains:

```javascript
{
  value: any,         // Value passed to directive
  oldValue: any,      // Previous value (only in beforeUpdate/updated)
  arg: string,        // Argument (e.g., 'foo' in v-my-directive:foo)
  modifiers: object,  // Object of modifiers (e.g., {bar: true} in v-my-directive.bar)
  instance: object,   // Component instance
  dir: object         // Directive definition object
}
```

## Example Directives

### 1. v-focus - Auto Focus

Automatically focus an input when it's mounted:

```javascript
const vFocus = {
  mounted(el) {
    el.focus()
  }
}
```

**Usage:**
```vue
<input v-focus type="text" placeholder="Auto-focused!" />
```

**When to use:**
- Focus first input in forms
- Auto-focus search boxes
- Accessibility improvements

### 2. v-click-outside - Detect Outside Clicks

Close dropdowns, modals, or popups when clicking outside:

```javascript
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
    delete el._clickOutside
  }
}
```

**Usage:**
```vue
<div v-click-outside="closeDropdown">
  <p>Click outside to close</p>
</div>
```

**Key points:**
- Store handler as property on element (`el._clickOutside`)
- Clean up event listener in `unmounted`
- Check if click target is inside element

### 3. v-tooltip - Custom Tooltips

Create custom tooltips with position modifiers:

```javascript
const vTooltip = {
  mounted(el, binding) {
    const tooltip = document.createElement('div')
    tooltip.className = 'tooltip'
    tooltip.textContent = binding.value

    // Get position from modifier
    const position = Object.keys(binding.modifiers)[0] || 'top'

    el.addEventListener('mouseenter', () => {
      document.body.appendChild(tooltip)
      // Position tooltip based on modifier
      positionTooltip(tooltip, el, position)
    })

    el.addEventListener('mouseleave', () => {
      tooltip.remove()
    })
  }
}
```

**Usage:**
```vue
<button v-tooltip="'Help text'">Hover me</button>
<button v-tooltip.bottom="'Bottom text'">Bottom tooltip</button>
<button v-tooltip.left="'Left text'">Left tooltip</button>
```

### 4. v-lazy-load - Lazy Load Images

Load images only when they enter the viewport:

```javascript
const vLazyLoad = {
  mounted(el) {
    const loadImage = () => {
      const imageUrl = el.getAttribute('data-src')
      if (imageUrl) {
        el.src = imageUrl
        el.removeAttribute('data-src')
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    })

    observer.observe(el)
    el._lazyObserver = observer
  },
  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
    }
  }
}
```

**Usage:**
```vue
<img v-lazy-load data-src="/path/to/image.jpg" alt="Lazy loaded" />
```

### 5. v-intersection - Intersection Observer

Trigger callbacks when elements enter/exit viewport:

```javascript
const vIntersection = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      binding.value(entries)
    }, {
      threshold: binding.arg || 0.5
    })

    observer.observe(el)
    el._observer = observer
  },
  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect()
    }
  }
}
```

**Usage:**
```vue
<div v-intersection:0.8="handleIntersection">
  Content here
</div>
```

### 6. v-draggable - Make Elements Draggable

Simple drag-and-drop functionality:

```javascript
const vDraggable = {
  mounted(el) {
    el.style.position = 'absolute'
    el.style.cursor = 'move'

    let isDragging = false
    let startX, startY, initialX, initialY

    const dragStart = (e) => {
      isDragging = true
      startX = e.clientX
      startY = e.clientY
      initialX = el.offsetLeft
      initialY = el.offsetTop
    }

    const drag = (e) => {
      if (!isDragging) return
      e.preventDefault()

      const dx = e.clientX - startX
      const dy = e.clientY - startY

      el.style.left = (initialX + dx) + 'px'
      el.style.top = (initialY + dy) + 'px'
    }

    const dragEnd = () => {
      isDragging = false
    }

    el.addEventListener('mousedown', dragStart)
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', dragEnd)

    el._cleanup = () => {
      el.removeEventListener('mousedown', dragStart)
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', dragEnd)
    }
  },
  unmounted(el) {
    el._cleanup?.()
  }
}
```

**Usage:**
```vue
<div v-draggable class="box">Drag me!</div>
```

### 7. v-longpress - Long Press Detection

Detect and handle long press events:

```javascript
const vLongpress = {
  mounted(el, binding) {
    let pressTimer = null

    const start = () => {
      pressTimer = setTimeout(() => {
        binding.value()
      }, 1000)
    }

    const cancel = () => {
      clearTimeout(pressTimer)
    }

    el.addEventListener('mousedown', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)

    el._cleanup = () => {
      cancel()
      el.removeEventListener('mousedown', start)
      el.removeEventListener('mouseup', cancel)
      el.removeEventListener('mouseleave', cancel)
    }
  },
  unmounted(el) {
    el._cleanup?.()
  }
}
```

**Usage:**
```vue
<button v-longpress="handleLongPress">Hold me</button>
```

### 8. v-permissions - Permission-Based Rendering

Show/hide elements based on user permissions:

```javascript
const vPermissions = {
  mounted(el, binding) {
    const requiredRole = binding.arg
    const currentRole = getCurrentUserRole()

    if (!hasPermission(currentRole, requiredRole)) {
      el.style.display = 'none'
      el.setAttribute('disabled', 'true')
    }
  },
  updated(el, binding) {
    // Re-check permissions on updates
    const requiredRole = binding.arg
    const currentRole = getCurrentUserRole()

    if (!hasPermission(currentRole, requiredRole)) {
      el.style.display = 'none'
      el.setAttribute('disabled', 'true')
    } else {
      el.style.display = ''
      el.removeAttribute('disabled')
    }
  }
}
```

**Usage:**
```vue
<button v-permissions:admin>Admin Only</button>
<button v-permissions:user>Users+</button>
```

## Directive Arguments and Modifiers

### Arguments

Pass named parameters to directives using `:`:

```vue
<div v-directive:argument="value"></div>
```

Access via `binding.arg`:

```javascript
const vDirective = {
  mounted(el, binding) {
    console.log(binding.arg) // 'argument'
  }
}
```

### Modifiers

Use modifiers with `.` syntax:

```vue
<div v-directive.modifier1.modifier2="value"></div>
```

Access via `binding.modifiers`:

```javascript
const vDirective = {
  mounted(el, binding) {
    console.log(binding.modifiers)
    // { modifier1: true, modifier2: true }
  }
}
```

### Combined Example

```vue
<button v-color:background.important="'red'">
  Styled Button
</button>
```

```javascript
const vColor = {
  mounted(el, binding) {
    const target = binding.arg || 'color' // 'background'
    const isImportant = binding.modifiers.important // true

    el.style[target] = binding.value
    if (isImportant) {
      el.style.fontWeight = 'bold'
    }
  }
}
```

## Common Patterns

### Pattern 1: Resource Cleanup

Always clean up resources in `unmounted`:

```javascript
const vDirective = {
  mounted(el) {
    // Store cleanup function on element
    const cleanup = () => {
      // Remove listeners, observers, etc.
    }
    el._cleanup = cleanup
  },
  unmounted(el) {
    el._cleanup?.()
    delete el._cleanup
  }
}
```

### Pattern 2: Dynamic Updates

Respond to directive value changes:

```javascript
const vColor = {
  mounted(el, binding) {
    el.style.color = binding.value
  },
  updated(el, binding) {
    // Only update if value changed
    if (binding.value !== binding.oldValue) {
      el.style.color = binding.value
    }
  }
}
```

### Pattern 3: Third-Party Library Integration

```javascript
const vChart = {
  mounted(el, binding) {
    el._chart = new Chart(el, binding.value)
  },
  updated(el, binding) {
    el._chart.update(binding.value)
  },
  unmounted(el) {
    el._chart?.destroy()
    delete el._chart
  }
}
```

## Best Practices

### 1. Always Clean Up

```javascript
// ❌ BAD: Memory leak
const vBad = {
  mounted(el) {
    window.addEventListener('scroll', handler)
  }
}

// ✅ GOOD: Proper cleanup
const vGood = {
  mounted(el) {
    el._handler = () => console.log('scroll')
    window.addEventListener('scroll', el._handler)
  },
  unmounted(el) {
    window.removeEventListener('scroll', el._handler)
    delete el._handler
  }
}
```

### 2. Use Element Properties for Data

Store directive-specific data on the element:

```javascript
el._myData = { /* ... */ }
el._myHandler = () => { /* ... */ }
el._myObserver = new Observer()
```

### 3. Defensive Programming

Check for element and binding validity:

```javascript
const vDirective = {
  mounted(el, binding) {
    if (!el || typeof binding.value !== 'function') {
      console.warn('Invalid directive usage')
      return
    }
    // Safe to proceed
  }
}
```

### 4. Performance Considerations

Avoid expensive operations in `updated`:

```javascript
// ❌ BAD: Runs on every update
const vBad = {
  updated(el, binding) {
    // Expensive operation runs every update
    heavyComputation()
  }
}

// ✅ GOOD: Only run when necessary
const vGood = {
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      heavyComputation()
    }
  }
}
```

### 5. Naming Conventions

- Prefix with `v` (e.g., `vMyDirective`)
- Use camelCase in JavaScript
- Use kebab-case in templates

```javascript
const vMyDirective = { /* ... */ }
```

```vue
<div v-my-directive="value"></div>
```

## Registering Directives

### Local Registration

In component:

```vue
<script setup>
const vFocus = {
  mounted(el) {
    el.focus()
  }
}
</script>

<template>
  <input v-focus />
</template>
```

### Global Registration

In main app file:

```javascript
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

app.mount('#app')
```

## Testing Directives

```javascript
import { mount } from '@vue/test-utils'
import { vMyDirective } from './directives'

describe('vMyDirective', () => {
  it('applies directive correctly', () => {
    const wrapper = mount({
      directives: { myDirective: vMyDirective },
      template: '<div v-my-directive="value"></div>',
      setup() {
        return { value: 'test' }
      }
    })

    const el = wrapper.element
    // Assert directive behavior
    expect(el.textContent).toBe('test')
  })

  it('cleans up on unmount', () => {
    const wrapper = mount(/* ... */)
    wrapper.unmount()

    // Assert cleanup happened
    expect(/* cleanup assertion */).toBe(true)
  })
})
```

## Common Pitfalls

### 1. Forgetting to Clean Up

Memory leaks from event listeners:

```javascript
// ❌ Listener never removed
mounted(el) {
  document.addEventListener('click', handler)
}
```

### 2. Modifying Reactive State

Don't modify component state from directives:

```javascript
// ❌ BAD: Side effects in directive
mounted(el, binding) {
  binding.instance.someData = 'new value'
}
```

### 3. Using Refs Instead

If you need access to component context, use refs:

```vue
<!-- Use ref instead of directive -->
<input ref="inputRef" />

<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)

onMounted(() => {
  inputRef.value.focus()
})
</script>
```

## Summary

Custom directives are powerful for:
- DOM manipulation
- Third-party integrations
- Reusable low-level features
- Performance optimizations

Key points:
- Use lifecycle hooks appropriately
- Always clean up resources
- Store data on elements
- Leverage arguments and modifiers
- Prefer components for complex UI logic

## Next Steps

- **Lesson 4**: Teleport & Suspense
- **Lesson 5**: Plugin System
- **Lesson 6**: Advanced Composable Patterns
