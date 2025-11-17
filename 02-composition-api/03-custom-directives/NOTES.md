# Technical Notes: Custom Directives

## Internal Implementation

### How Vue Processes Directives

When Vue encounters a directive in a template, it:

1. Parses the directive syntax during template compilation
2. Creates a directive binding object
3. Calls appropriate lifecycle hooks at render time
4. Manages cleanup when element is removed

```javascript
// Simplified internal processing
function applyDirective(el, dir, binding) {
  // Parse directive name, arg, modifiers
  const directive = resolveDirective(dir.name)

  // Call lifecycle hooks at appropriate times
  callHook(directive, 'created', el, binding)
  callHook(directive, 'beforeMount', el, binding)
  // ... mount element ...
  callHook(directive, 'mounted', el, binding)
}
```

### Directive vs Component Decision Tree

```
Need custom functionality?
    ↓
Does it need template/markup?
    ↓ YES                    ↓ NO
Use Component          Need complex state?
                            ↓ YES        ↓ NO
                       Use Component   Use Directive
```

## Deep Dive: Directive Lifecycle

### Complete Lifecycle Flow

```
Template Compilation
    ↓
created() ──────→ Element created but not inserted
    ↓
beforeMount() ──→ Element about to be inserted
    ↓
[DOM Insertion]
    ↓
mounted() ──────→ Element in DOM, safe to manipulate
    ↓
[Component Active]
    ↓
Data Changes?
    ↓
beforeUpdate() ─→ Element about to update
    ↓
[Re-render]
    ↓
updated() ──────→ Element updated
    ↓
(back to Active)
    ↓
Element Removed?
    ↓
beforeUnmount() → Element about to be removed
    ↓
[DOM Removal]
    ↓
unmounted() ────→ Cleanup complete
```

### Hook Execution Order with Components

```vue
<!-- Parent Component -->
<template>
  <div v-parent-directive>
    <ChildComponent v-child-directive />
  </div>
</template>
```

**Execution order:**
```
1. Parent directive created
2. Parent directive beforeMount
3. Child directive created
4. Child directive beforeMount
5. Child directive mounted
6. Parent directive mounted

(on update)
7. Parent directive beforeUpdate
8. Child directive beforeUpdate
9. Child directive updated
10. Parent directive updated

(on unmount)
11. Parent directive beforeUnmount
12. Child directive beforeUnmount
13. Child directive unmounted
14. Parent directive unmounted
```

## Advanced Patterns

### Pattern 1: Directive Factory

Create configurable directives:

```javascript
function createClickOutside(options = {}) {
  const { event = 'click', capture = true } = options

  return {
    mounted(el, binding) {
      const handler = (e) => {
        if (!el.contains(e.target)) {
          binding.value(e)
        }
      }

      setTimeout(() => {
        document.addEventListener(event, handler, capture)
      }, 0)

      el._clickOutsideHandler = handler
      el._clickOutsideEvent = event
      el._clickOutsideCapture = capture
    },

    unmounted(el) {
      if (el._clickOutsideHandler) {
        document.removeEventListener(
          el._clickOutsideEvent,
          el._clickOutsideHandler,
          el._clickOutsideCapture
        )
      }
    }
  }
}

// Usage
const vClickOutside = createClickOutside({ event: 'mousedown' })
const vTouchOutside = createClickOutside({ event: 'touchstart' })
```

### Pattern 2: Directive Composition

Combine multiple directives:

```javascript
function composeDirectives(...directives) {
  return {
    created(el, binding, vnode, prevVnode) {
      directives.forEach(dir =>
        dir.created?.(el, binding, vnode, prevVnode)
      )
    },
    mounted(el, binding, vnode, prevVnode) {
      directives.forEach(dir =>
        dir.mounted?.(el, binding, vnode, prevVnode)
      )
    },
    // ... other hooks
    unmounted(el, binding, vnode, prevVnode) {
      directives.forEach(dir =>
        dir.unmounted?.(el, binding, vnode, prevVnode)
      )
    }
  }
}

// Usage
const vMulti = composeDirectives(vTooltip, vDraggable)
```

### Pattern 3: Async Directives

Handle async initialization:

```javascript
const vAsyncData = {
  async mounted(el, binding) {
    el.textContent = 'Loading...'

    try {
      const data = await binding.value()
      el.textContent = data
    } catch (error) {
      el.textContent = 'Error loading data'
      console.error(error)
    }
  }
}

// Usage
<div v-async-data="() => fetchUserData()"></div>
```

### Pattern 4: Directive with Options

Pass complex configuration:

```javascript
const vTooltip = {
  mounted(el, binding) {
    const options = typeof binding.value === 'string'
      ? { text: binding.value }
      : binding.value

    const {
      text,
      position = 'top',
      delay = 0,
      theme = 'dark'
    } = options

    // Create tooltip with options
    createTooltip(el, { text, position, delay, theme })
  }
}

// Usage
<button v-tooltip="'Simple'"></button>
<button v-tooltip="{ text: 'Advanced', position: 'bottom', delay: 500 }">
</button>
```

### Pattern 5: Directive State Machine

Manage complex directive states:

```javascript
const vStateful = {
  mounted(el, binding) {
    const states = {
      idle: {
        enter: () => el.classList.add('idle'),
        exit: () => el.classList.remove('idle')
      },
      active: {
        enter: () => el.classList.add('active'),
        exit: () => el.classList.remove('active')
      },
      disabled: {
        enter: () => {
          el.classList.add('disabled')
          el.setAttribute('disabled', 'true')
        },
        exit: () => {
          el.classList.remove('disabled')
          el.removeAttribute('disabled')
        }
      }
    }

    let currentState = 'idle'
    states[currentState].enter()

    const setState = (newState) => {
      if (states[currentState]) {
        states[currentState].exit()
      }
      currentState = newState
      if (states[currentState]) {
        states[currentState].enter()
      }
    }

    el._setState = setState
  },

  updated(el, binding) {
    el._setState?.(binding.value)
  }
}
```

## Performance Optimization

### 1. Debouncing Directive Updates

```javascript
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const vDebouncedColor = {
  mounted(el, binding) {
    const updateColor = debounce((color) => {
      el.style.color = color
    }, 200)

    el._updateColor = updateColor
    updateColor(binding.value)
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el._updateColor(binding.value)
    }
  }
}
```

### 2. RAF-based Updates

Use requestAnimationFrame for smooth animations:

```javascript
const vAnimatedScroll = {
  mounted(el, binding) {
    let rafId = null

    const scroll = () => {
      rafId = requestAnimationFrame(() => {
        binding.value({
          scrollTop: el.scrollTop,
          scrollLeft: el.scrollLeft
        })
        scroll()
      })
    }

    scroll()

    el._stopScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  },

  unmounted(el) {
    el._stopScroll?.()
  }
}
```

### 3. Intersection Observer Optimization

Reuse observer instances:

```javascript
// Shared observer instance
let sharedObserver = null
const observedElements = new WeakMap()

const vLazyLoad = {
  mounted(el, binding) {
    if (!sharedObserver) {
      sharedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const callback = observedElements.get(entry.target)
            callback?.()
            sharedObserver.unobserve(entry.target)
            observedElements.delete(entry.target)
          }
        })
      })
    }

    const loadImage = () => {
      el.src = el.dataset.src
    }

    observedElements.set(el, loadImage)
    sharedObserver.observe(el)
  },

  unmounted(el) {
    sharedObserver?.unobserve(el)
    observedElements.delete(el)
  }
}
```

### 4. Event Delegation

Use event delegation for better performance:

```javascript
const vDelegatedClick = {
  mounted(el, binding) {
    // Store handler on parent
    if (!el.parentElement._delegatedHandler) {
      el.parentElement._delegatedHandler = (e) => {
        const target = e.target.closest('[data-delegate-click]')
        if (target) {
          const handler = target._clickHandler
          handler?.(e)
        }
      }
      el.parentElement.addEventListener(
        'click',
        el.parentElement._delegatedHandler
      )
    }

    el.setAttribute('data-delegate-click', '')
    el._clickHandler = binding.value
  },

  unmounted(el) {
    delete el._clickHandler
  }
}
```

## Edge Cases and Solutions

### 1. Directive on Component Root

Directives on component root elements need special handling:

```vue
<!-- ParentComponent.vue -->
<template>
  <ChildComponent v-my-directive="value" />
</template>

<!-- ChildComponent.vue -->
<template>
  <!-- Directive applies to this root div -->
  <div>Content</div>
</template>
```

**Important**: With multi-root components, directives require explicit fallthrough:

```vue
<!-- Won't work automatically -->
<template>
  <div>First</div>
  <div>Second</div>
</template>

<!-- Need to bind manually -->
<template>
  <div v-bind="$attrs">First</div>
  <div>Second</div>
</template>
```

### 2. Dynamic Directives

Conditionally apply directives:

```vue
<script setup>
import { computed } from 'vue'

const shouldApplyDirective = ref(true)

// ❌ Can't conditionally define directive
// if (shouldApplyDirective.value) {
//   const vDirective = { ... }
// }

// ✅ Use dynamic component or v-if
</script>

<template>
  <!-- Option 1: Conditional rendering -->
  <div v-if="shouldApplyDirective" v-my-directive>Content</div>
  <div v-else>Content</div>

  <!-- Option 2: Directive handles conditional logic -->
  <div v-my-directive="shouldApplyDirective">Content</div>
</template>
```

### 3. SSR Considerations

Directives don't run during SSR:

```javascript
const vClientOnly = {
  mounted(el, binding) {
    // Safe: only runs on client
    if (typeof window === 'undefined') return

    // Client-only code
    el.style.transform = 'rotate(45deg)'
  }
}
```

### 4. TypeScript Support

Type-safe directive definitions:

```typescript
import type { Directive } from 'vue'

interface TooltipOptions {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const vTooltip: Directive<HTMLElement, TooltipOptions> = {
  mounted(el, binding) {
    const { text, position = 'top', delay = 0 } = binding.value
    // TypeScript knows the structure
  }
}
```

## Security Considerations

### 1. XSS Prevention

Always sanitize user input:

```javascript
import DOMPurify from 'dompurify'

const vSafeHtml = {
  mounted(el, binding) {
    // ❌ DANGEROUS: XSS vulnerability
    // el.innerHTML = binding.value

    // ✅ SAFE: Sanitized HTML
    el.innerHTML = DOMPurify.sanitize(binding.value)
  },

  updated(el, binding) {
    el.innerHTML = DOMPurify.sanitize(binding.value)
  }
}
```

### 2. Event Listener Safety

Prevent event listener injection:

```javascript
const vUnsafeEvent = {
  mounted(el, binding) {
    // ❌ DANGEROUS: Code injection
    // el.setAttribute('onclick', binding.value)

    // ✅ SAFE: Proper event binding
    el.addEventListener('click', binding.value)
  }
}
```

### 3. URL Validation

Validate URLs before use:

```javascript
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

const vSafeLink = {
  mounted(el, binding) {
    if (isValidUrl(binding.value)) {
      el.href = binding.value
    } else {
      console.warn('Invalid URL:', binding.value)
      el.href = '#'
    }
  }
}
```

## Testing Strategies

### Unit Testing Directives

```javascript
import { describe, it, expect, vi } from 'vitest'
import { vClickOutside } from './directives'

describe('vClickOutside', () => {
  it('calls handler on outside click', async () => {
    const handler = vi.fn()
    const el = document.createElement('div')
    document.body.appendChild(el)

    // Mount directive
    vClickOutside.mounted(el, { value: handler })

    // Simulate outside click
    document.body.click()

    expect(handler).toHaveBeenCalled()

    // Cleanup
    vClickOutside.unmounted(el)
    el.remove()
  })

  it('does not call handler on inside click', () => {
    const handler = vi.fn()
    const el = document.createElement('div')

    vClickOutside.mounted(el, { value: handler })

    el.click()

    expect(handler).not.toHaveBeenCalled()

    vClickOutside.unmounted(el)
  })
})
```

### Integration Testing

```javascript
import { mount } from '@vue/test-utils'

describe('Directive Integration', () => {
  it('works in component', async () => {
    const handler = vi.fn()

    const wrapper = mount({
      directives: { clickOutside: vClickOutside },
      template: '<div v-click-outside="handler">Content</div>',
      setup() {
        return { handler }
      }
    })

    document.body.click()

    expect(handler).toHaveBeenCalled()
  })
})
```

## Migration from Vue 2

### Vue 2 Directive Hooks

```javascript
// Vue 2
Vue.directive('my-directive', {
  bind(el, binding, vnode) {},
  inserted(el, binding, vnode) {},
  update(el, binding, vnode, oldVnode) {},
  componentUpdated(el, binding, vnode, oldVnode) {},
  unbind(el, binding, vnode) {}
})
```

### Vue 3 Equivalent

```javascript
// Vue 3
app.directive('my-directive', {
  created(el, binding, vnode, prevVnode) {},   // new
  beforeMount(el, binding, vnode, prevVnode) {}, // bind
  mounted(el, binding, vnode, prevVnode) {},     // inserted
  beforeUpdate(el, binding, vnode, prevVnode) {}, // new
  updated(el, binding, vnode, prevVnode) {},     // componentUpdated
  beforeUnmount(el, binding, vnode, prevVnode) {}, // new
  unmounted(el, binding, vnode, prevVnode) {}    // unbind
})
```

### Migration Mapping

| Vue 2 | Vue 3 | Notes |
|-------|-------|-------|
| `bind` | `beforeMount` | Same timing |
| `inserted` | `mounted` | Same timing |
| `update` | Removed | Use `beforeUpdate` or `updated` |
| `componentUpdated` | `updated` | Same timing |
| `unbind` | `unmounted` | Renamed for consistency |
| N/A | `created` | New hook |
| N/A | `beforeUpdate` | New hook |
| N/A | `beforeUnmount` | New hook |

## Real-World Examples

### Complex Tooltip Directive

Full-featured tooltip implementation:

```javascript
const vTooltip = {
  mounted(el, binding) {
    const config = {
      text: '',
      position: 'top',
      delay: 0,
      offset: 10,
      theme: 'dark',
      ...(typeof binding.value === 'string'
        ? { text: binding.value }
        : binding.value)
    }

    const tooltip = createTooltipElement(config)
    let showTimeout

    const show = () => {
      showTimeout = setTimeout(() => {
        positionTooltip(tooltip, el, config)
        document.body.appendChild(tooltip)
      }, config.delay)
    }

    const hide = () => {
      clearTimeout(showTimeout)
      tooltip.remove()
    }

    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)
    el.addEventListener('click', hide)

    el._tooltip = {
      element: tooltip,
      show,
      hide,
      cleanup: () => {
        hide()
        el.removeEventListener('mouseenter', show)
        el.removeEventListener('mouseleave', hide)
        el.removeEventListener('click', hide)
      }
    }
  },

  updated(el, binding) {
    // Update tooltip text if changed
    if (binding.value !== binding.oldValue) {
      const text = typeof binding.value === 'string'
        ? binding.value
        : binding.value.text

      if (el._tooltip) {
        el._tooltip.element.textContent = text
      }
    }
  },

  unmounted(el) {
    el._tooltip?.cleanup()
    delete el._tooltip
  }
}
```

## Summary

Key takeaways:

1. **Directives are for DOM manipulation**, not business logic
2. **Always clean up** resources in `unmounted`
3. **Use element properties** to store directive state
4. **Optimize performance** with debouncing, RAF, and observer reuse
5. **Security matters**: Sanitize input, validate URLs
6. **Test thoroughly**: Unit and integration tests
7. **Migration is straightforward** from Vue 2 to Vue 3
8. **Prefer components** for complex UI logic
9. **Leverage arguments and modifiers** for flexibility
10. **Consider SSR** implications for client-only directives
