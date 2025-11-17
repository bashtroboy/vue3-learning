<template>
  <div class="app">
    <h1>Lesson 3: Custom Directives</h1>
    <p class="subtitle">Learn to create and use custom directives in Vue 3</p>

    <!-- Section 1: Basic Directives -->
    <section class="demo-section">
      <h2>1. Basic Directives</h2>

      <div class="demo-card">
        <h3>v-focus - Auto Focus</h3>
        <p>Input automatically focused when rendered</p>
        <input v-focus type="text" placeholder="I'm auto-focused!" />
      </div>

      <div class="demo-card">
        <h3>v-color - Dynamic Color</h3>
        <p>Change element color dynamically</p>
        <input v-model="selectedColor" type="color" />
        <p v-color="selectedColor" class="colored-text">
          This text changes color!
        </p>
      </div>
    </section>

    <!-- Section 2: Event-Based Directives -->
    <section class="demo-section">
      <h2>2. Event-Based Directives</h2>

      <div class="demo-card">
        <h3>v-click-outside - Detect Outside Clicks</h3>
        <div
          v-click-outside="handleClickOutside"
          class="click-outside-demo"
          :class="{ active: isActive }"
        >
          <p>Click inside: {{ insideClicks }}</p>
          <p>Click outside: {{ outsideClicks }}</p>
          <button @click="insideClicks++">Click Inside</button>
        </div>
      </div>

      <div class="demo-card">
        <h3>v-longpress - Long Press Detection</h3>
        <button
          v-longpress="handleLongPress"
          class="longpress-btn"
        >
          Hold me for 1 second
        </button>
        <p>Long presses: {{ longPressCount }}</p>
      </div>
    </section>

    <!-- Section 3: DOM Manipulation Directives -->
    <section class="demo-section">
      <h2>3. DOM Manipulation Directives</h2>

      <div class="demo-card">
        <h3>v-tooltip - Custom Tooltips</h3>
        <button
          v-tooltip="'This is a helpful tooltip!'"
          class="tooltip-demo"
        >
          Hover over me
        </button>
        <button
          v-tooltip.bottom="'Bottom tooltip'"
          class="tooltip-demo"
        >
          Bottom tooltip
        </button>
        <button
          v-tooltip.left="'Left tooltip'"
          class="tooltip-demo"
        >
          Left tooltip
        </button>
      </div>

      <div class="demo-card">
        <h3>v-draggable - Make Elements Draggable</h3>
        <div
          v-draggable
          class="draggable-box"
          style="left: 50px; top: 50px;"
        >
          Drag me around!
        </div>
      </div>
    </section>

    <!-- Section 4: Advanced Directives -->
    <section class="demo-section">
      <h2>4. Advanced Directives</h2>

      <div class="demo-card">
        <h3>v-intersection - Intersection Observer</h3>
        <div class="scroll-container">
          <div class="spacer"></div>
          <div
            v-intersection="handleIntersection"
            class="intersection-box"
            :class="{ visible: isIntersecting }"
          >
            {{ isIntersecting ? 'Visible!' : 'Scroll to see me' }}
          </div>
          <div class="spacer"></div>
        </div>
      </div>

      <div class="demo-card">
        <h3>v-lazy-load - Lazy Load Images</h3>
        <div class="image-grid">
          <img
            v-for="n in 6"
            :key="n"
            v-lazy-load
            :data-src="`https://picsum.photos/200/200?random=${n}`"
            alt="Lazy loaded image"
            class="lazy-image"
          />
        </div>
      </div>
    </section>

    <!-- Section 5: Directive with Arguments & Modifiers -->
    <section class="demo-section">
      <h2>5. Directives with Arguments & Modifiers</h2>

      <div class="demo-card">
        <h3>v-highlight - Syntax Highlighting</h3>
        <pre v-highlight:javascript class="code-block">{{ codeExample }}</pre>
      </div>

      <div class="demo-card">
        <h3>v-permissions - Permission-Based Rendering</h3>
        <p>Current role: {{ currentRole }}</p>
        <select v-model="currentRole">
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div class="permissions-demo">
          <button v-permissions:admin>Admin Only Button</button>
          <button v-permissions:user>User+ Button</button>
          <button v-permissions:guest>Everyone Can See</button>
        </div>
      </div>
    </section>

    <!-- Section 6: Composable Directive Pattern -->
    <section class="demo-section">
      <h2>6. Directive Lifecycle Hooks</h2>

      <div class="demo-card">
        <h3>Understanding Directive Lifecycle</h3>
        <button @click="showLifecycleDemo = !showLifecycleDemo">
          Toggle Lifecycle Demo
        </button>

        <div v-if="showLifecycleDemo">
          <input
            v-lifecycle-logger
            v-model="lifecycleInput"
            type="text"
            placeholder="Check console for lifecycle events"
          />
          <p>Check browser console to see directive lifecycle hooks firing</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Section 1: Basic directives data
const selectedColor = ref('#3498db')

// Section 2: Event-based directives data
const isActive = ref(false)
const insideClicks = ref(0)
const outsideClicks = ref(0)
const longPressCount = ref(0)

const handleClickOutside = () => {
  outsideClicks.value++
  isActive.value = false
}

const handleLongPress = () => {
  longPressCount.value++
  alert('Long press detected!')
}

// Section 4: Advanced directives data
const isIntersecting = ref(false)

const handleIntersection = (entries) => {
  isIntersecting.value = entries[0].isIntersecting
}

// Section 5: Arguments & modifiers data
const codeExample = `function greet(name) {
  console.log(\`Hello, \${name}!\`)
  return name
}`

const currentRole = ref('guest')

// Section 6: Lifecycle demo data
const showLifecycleDemo = ref(false)
const lifecycleInput = ref('')

// Directive definitions

// 1. v-focus: Auto-focus input
const vFocus = {
  mounted(el) {
    el.focus()
  }
}

// 2. v-color: Change text color
const vColor = {
  mounted(el, binding) {
    el.style.color = binding.value
  },
  updated(el, binding) {
    el.style.color = binding.value
  }
}

// 3. v-click-outside: Detect clicks outside element
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
    delete el._clickOutside
  }
}

// 4. v-longpress: Detect long press
const vLongpress = {
  mounted(el, binding) {
    let pressTimer = null

    const start = () => {
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          binding.value()
        }, 1000)
      }
    }

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    el.addEventListener('mousedown', start)
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)

    el._longpressCleanup = () => {
      el.removeEventListener('mousedown', start)
      el.removeEventListener('click', cancel)
      el.removeEventListener('mouseout', cancel)
    }
  },
  unmounted(el) {
    if (el._longpressCleanup) {
      el._longpressCleanup()
      delete el._longpressCleanup
    }
  }
}

// 5. v-tooltip: Custom tooltip
const vTooltip = {
  mounted(el, binding) {
    const tooltip = document.createElement('div')
    tooltip.className = 'custom-tooltip'
    tooltip.textContent = binding.value
    tooltip.style.position = 'absolute'
    tooltip.style.display = 'none'

    // Position based on modifier
    const position = Object.keys(binding.modifiers)[0] || 'top'
    tooltip.setAttribute('data-position', position)

    document.body.appendChild(tooltip)

    const show = () => {
      const rect = el.getBoundingClientRect()
      tooltip.style.display = 'block'

      switch (position) {
        case 'bottom':
          tooltip.style.top = `${rect.bottom + 5}px`
          tooltip.style.left = `${rect.left + rect.width / 2}px`
          tooltip.style.transform = 'translateX(-50%)'
          break
        case 'left':
          tooltip.style.top = `${rect.top + rect.height / 2}px`
          tooltip.style.left = `${rect.left - 5}px`
          tooltip.style.transform = 'translate(-100%, -50%)'
          break
        case 'right':
          tooltip.style.top = `${rect.top + rect.height / 2}px`
          tooltip.style.left = `${rect.right + 5}px`
          tooltip.style.transform = 'translateY(-50%)'
          break
        default: // top
          tooltip.style.top = `${rect.top - 5}px`
          tooltip.style.left = `${rect.left + rect.width / 2}px`
          tooltip.style.transform = 'translate(-50%, -100%)'
      }
    }

    const hide = () => {
      tooltip.style.display = 'none'
    }

    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)

    el._tooltip = tooltip
    el._tooltipCleanup = () => {
      el.removeEventListener('mouseenter', show)
      el.removeEventListener('mouseleave', hide)
    }
  },
  unmounted(el) {
    if (el._tooltip) {
      el._tooltip.remove()
      delete el._tooltip
    }
    if (el._tooltipCleanup) {
      el._tooltipCleanup()
      delete el._tooltipCleanup
    }
  }
}

// 6. v-draggable: Make element draggable
const vDraggable = {
  mounted(el) {
    el.style.position = 'absolute'
    el.style.cursor = 'move'

    let isDragging = false
    let currentX
    let currentY
    let initialX
    let initialY

    const dragStart = (e) => {
      initialX = e.clientX - el.offsetLeft
      initialY = e.clientY - el.offsetTop
      isDragging = true
    }

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault()
        currentX = e.clientX - initialX
        currentY = e.clientY - initialY
        el.style.left = currentX + 'px'
        el.style.top = currentY + 'px'
      }
    }

    const dragEnd = () => {
      isDragging = false
    }

    el.addEventListener('mousedown', dragStart)
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', dragEnd)

    el._draggableCleanup = () => {
      el.removeEventListener('mousedown', dragStart)
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', dragEnd)
    }
  },
  unmounted(el) {
    if (el._draggableCleanup) {
      el._draggableCleanup()
      delete el._draggableCleanup
    }
  }
}

// 7. v-intersection: Intersection Observer
const vIntersection = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      binding.value(entries)
    }, {
      threshold: 0.5
    })

    observer.observe(el)
    el._intersectionObserver = observer
  },
  unmounted(el) {
    if (el._intersectionObserver) {
      el._intersectionObserver.disconnect()
      delete el._intersectionObserver
    }
  }
}

// 8. v-lazy-load: Lazy load images
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
      delete el._lazyObserver
    }
  }
}

// 9. v-highlight: Syntax highlighting
const vHighlight = {
  mounted(el, binding) {
    const language = binding.arg || 'javascript'
    el.classList.add(`language-${language}`)

    // Simple syntax highlighting (in real app, use library like Prism.js)
    const code = el.textContent
    const highlighted = code
      .replace(/\b(function|const|let|var|return|if|else)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
      .replace(/(["'`])(.*?)\1/g, '<span class="string">$1$2$1</span>')

    el.innerHTML = highlighted
  }
}

// 10. v-permissions: Permission-based rendering
const vPermissions = {
  mounted(el, binding) {
    const requiredRole = binding.arg
    const roleHierarchy = { guest: 0, user: 1, admin: 2 }

    const checkPermission = () => {
      const userLevel = roleHierarchy[currentRole.value] || 0
      const requiredLevel = roleHierarchy[requiredRole] || 0

      if (userLevel < requiredLevel) {
        el.style.display = 'none'
        el.setAttribute('disabled', 'true')
      } else {
        el.style.display = ''
        el.removeAttribute('disabled')
      }
    }

    checkPermission()
    el._permissionChecker = checkPermission

    // Watch for role changes
    const interval = setInterval(checkPermission, 100)
    el._permissionInterval = interval
  },
  updated(el) {
    if (el._permissionChecker) {
      el._permissionChecker()
    }
  },
  unmounted(el) {
    if (el._permissionInterval) {
      clearInterval(el._permissionInterval)
      delete el._permissionInterval
    }
    delete el._permissionChecker
  }
}

// 11. v-lifecycle-logger: Log directive lifecycle
const vLifecycleLogger = {
  created(el, binding, vnode) {
    console.log('Directive created:', el)
  },
  beforeMount(el) {
    console.log('Directive beforeMount:', el)
  },
  mounted(el) {
    console.log('Directive mounted:', el)
  },
  beforeUpdate(el) {
    console.log('Directive beforeUpdate:', el)
  },
  updated(el) {
    console.log('Directive updated:', el)
  },
  beforeUnmount(el) {
    console.log('Directive beforeUnmount:', el)
  },
  unmounted(el) {
    console.log('Directive unmounted:', el)
  }
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 40px;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h2 {
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.demo-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.demo-card h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
}

.demo-card p {
  color: #7f8c8d;
  margin-bottom: 15px;
}

/* Basic Directives */
input[type="text"],
input[type="color"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 10px;
}

.colored-text {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
}

/* Event-Based Directives */
.click-outside-demo {
  padding: 20px;
  background: #ecf0f1;
  border: 2px dashed #95a5a6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.click-outside-demo.active {
  background: #3498db;
  color: white;
  border-color: #2980b9;
}

.longpress-btn {
  padding: 12px 24px;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.longpress-btn:active {
  background: #8e44ad;
}

/* DOM Manipulation Directives */
.tooltip-demo {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.draggable-box {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  user-select: none;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Advanced Directives */
.scroll-container {
  height: 300px;
  overflow-y: scroll;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.spacer {
  height: 400px;
}

.intersection-box {
  height: 100px;
  background: #e74c3c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.5s;
  opacity: 0.3;
  transform: scale(0.8);
}

.intersection-box.visible {
  background: #27ae60;
  opacity: 1;
  transform: scale(1);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.lazy-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  background: #ecf0f1;
}

/* Arguments & Modifiers */
.code-block {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.permissions-demo {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.permissions-demo button {
  padding: 10px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.permissions-demo button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
</style>

<style>
/* Global tooltip styles */
.custom-tooltip {
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* Syntax highlighting */
.keyword {
  color: #c678dd;
  font-weight: bold;
}

.number {
  color: #d19a66;
}

.string {
  color: #98c379;
}
</style>
