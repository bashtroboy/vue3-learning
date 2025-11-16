# Lesson 4 - Deep Dive Notes

## Table of Contents
1. [v-model Fundamentals](#v-model-fundamentals)
2. [v-model with Different Input Types](#v-model-with-different-input-types)
3. [Form Validation](#form-validation)
4. [Error Handling and Display](#error-handling-and-display)
5. [Form Submission](#form-submission)
6. [Reusable Form Components](#reusable-form-components)
7. [Form State Management](#form-state-management)
8. [Common Patterns](#common-patterns)

---

## v-model Fundamentals

### What is v-model?

v-model is Vue's syntax for **two-way data binding** on form elements. It automatically:
1. Updates the model when user inputs change
2. Updates the input when the model changes

### Behind the Scenes

v-model is shorthand that combines `:value` (prop) and `@input` (event):

```vue
<!-- This: -->
<input v-model="message" />

<!-- Is equivalent to: -->
<input
  :value="message"
  @input="message = $event.target.value"
/>
```

So v-model does two things:
1. **Binds the value** - Shows current model state
2. **Listens for changes** - Updates model on user input

### Example Flow

```javascript
const form = reactive({
  name: 'John'
})
```

```vue
<input v-model="form.name" />
```

**Initial render:**
- Input shows value: "John"

**User types "Jane":**
- @input event fires
- form.name = "Jane"
- Input re-renders with new value

**Parent changes form.name to "Bob":**
- Binding updates
- Input re-renders showing "Bob"

---

## v-model with Different Input Types

### Text Input
```vue
<input v-model="form.name" type="text" />
```

```javascript
const form = reactive({
  name: ''  // String
})
```

The `.value` is the text content.

### Email Input
```vue
<input v-model="form.email" type="email" />
```

Same as text, but browser provides built-in validation.

### Number Input
```vue
<input v-model.number="form.age" type="number" />
```

⚠️ **Important**: Without `.number` modifier, the value is a string "25", not the number 25.

**Why use .number?**
```javascript
// Without .number
const age = ref("25")  // String!
age.value + 5  // "255" (string concatenation, not addition)

// With .number
const age = ref(25)  // Number
age.value + 5  // 30 (numeric addition)
```

### Textarea
```vue
<textarea v-model="form.description"></textarea>
```

Works the same as text input, but for multi-line text.

```javascript
const form = reactive({
  description: ''
})
```

### Select Dropdown
```vue
<select v-model="form.type">
  <option value="document">Document</option>
  <option value="folder">Folder</option>
  <option value="category">Category</option>
</select>
```

The value comes from the option's `value` attribute:

```javascript
const form = reactive({
  type: ''  // Empty initially
})

// When user selects "Document":
// form.type = "document"
```

### Checkbox (Single)

For a single checkbox, the value is boolean:

```vue
<input v-model="form.agree" type="checkbox" />
```

```javascript
const form = reactive({
  agree: false  // Boolean
})

// When user checks: form.agree = true
// When user unchecks: form.agree = false
```

### Checkbox Group (Array)

Multiple checkboxes can share the same `v-model` with an array:

```vue
<div class="checkbox-group">
  <input v-model="form.flags" type="checkbox" value="published" />
  <input v-model="form.flags" type="checkbox" value="archived" />
  <input v-model="form.flags" type="checkbox" value="locked" />
</div>
```

```javascript
const form = reactive({
  flags: []  // Array!
})

// When user checks "published":
// form.flags = ["published"]

// When user also checks "locked":
// form.flags = ["published", "locked"]

// When user unchecks "published":
// form.flags = ["locked"]
```

How it works internally:
```javascript
// On change to "published" checkbox:
if (checkbox.checked) {
  form.flags.push("published")  // Add if checked
} else {
  const idx = form.flags.indexOf("published")
  if (idx > -1) {
    form.flags.splice(idx, 1)  // Remove if unchecked
  }
}
```

### Radio Button Group

Radio buttons are mutually exclusive - only one can be selected:

```vue
<div class="radio-group">
  <input v-model="form.access" type="radio" value="read" />
  <input v-model="form.access" type="radio" value="write" />
  <input v-model="form.access" type="radio" value="admin" />
</div>
```

```javascript
const form = reactive({
  access: 'read'  // String - initial value
})

// When user clicks "write" radio:
// form.access = "write"

// When user clicks "admin" radio:
// form.access = "admin"
```

### v-model Modifiers

Modifiers process the input value automatically:

#### .number - Convert to number
```vue
<input v-model.number="form.age" type="number" />
```

Without `.number`:
```javascript
form.age = "25"  // String
```

With `.number`:
```javascript
form.age = 25    // Number
```

#### .trim - Remove whitespace
```vue
<input v-model.trim="form.name" />
```

User types: `"  John  "`
Result: `form.name = "John"`

#### .lazy - Update on change, not input
```vue
<input v-model.lazy="form.name" />
```

Without `.lazy`: Updates on every keystroke (input event)
With `.lazy`: Updates only when user leaves field (change event)

**Use case:**
- `.lazy` is more efficient for expensive operations
- `.lazy` gives a better user experience for real-time validation

#### Combining Modifiers
```vue
<input v-model.number.lazy="form.count" />
```

---

## Form Validation

### Why Validate?

Validation ensures:
1. **Data Quality** - Correct data types and formats
2. **User Feedback** - Tell users what's wrong
3. **Business Rules** - Enforce constraints
4. **API Requirements** - Server expects certain formats

### Types of Validation

#### 1. Built-in HTML Validation
```vue
<input
  type="email"
  required
  minlength="5"
  maxlength="50"
/>
```

Browser shows native error messages. **Limitations:**
- Limited control over error messages
- Inconsistent across browsers
- Can't implement complex custom logic

#### 2. Real-time Validation (As-you-type)

Validate while user is typing:

```javascript
const form = reactive({
  email: ''
})

const emailError = computed(() => {
  if (!form.email) return ''
  if (!isValidEmail(form.email)) {
    return 'Invalid email format'
  }
  return ''
})

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
```

```vue
<input v-model="form.email" type="email" />
<p v-if="emailError" class="error">{{ emailError }}</p>
```

**Pros:**
- Immediate feedback
- Better UX

**Cons:**
- More expensive (validation runs frequently)
- Can be annoying (errors while typing)

#### 3. Validation on Submit

Validate only when form is submitted:

```javascript
const handleSubmit = () => {
  if (!validateForm()) {
    return  // Don't submit if invalid
  }

  // Submit form
}

const validateForm = () => {
  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Run all validators
  if (!form.name) {
    errors.name = 'Name required'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Email required'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Invalid email'
    isValid = false
  }

  return isValid
}
```

**Pros:**
- Less frequent validation
- Shows all errors at once
- Better performance

**Cons:**
- Delayed feedback
- All errors show together (can be overwhelming)

**Best practice:** Combine both!
```javascript
// Real-time for expensive fields (email, username)
const emailError = computed(() => {...})

// On submit for everything
const handleSubmit = () => {
  validateForm()  // Validates all
}
```

### Common Validation Rules

#### Required Fields
```javascript
if (!form.name.trim()) {
  errors.name = 'Name is required'
  return false
}
```

#### String Length
```javascript
if (form.name.length < 3) {
  errors.name = 'Name must be at least 3 characters'
  return false
}

if (form.name.length > 100) {
  errors.name = 'Name must not exceed 100 characters'
  return false
}
```

#### Email Format
```javascript
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

if (!isValidEmail(form.email)) {
  errors.email = 'Invalid email format'
  return false
}
```

#### Number Range
```javascript
if (form.priority < 1 || form.priority > 5) {
  errors.priority = 'Priority must be between 1 and 5'
  return false
}
```

#### Pattern Matching
```javascript
// Phone number (basic)
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/
if (!phoneRegex.test(form.phone)) {
  errors.phone = 'Phone must be in format: 123-456-7890'
  return false
}

// URL
const urlRegex = /^https?:\/\/.+/
if (!urlRegex.test(form.website)) {
  errors.website = 'Must be a valid URL'
  return false
}
```

#### Cross-field Validation
```javascript
// Password and confirm must match
if (form.password !== form.confirmPassword) {
  errors.confirmPassword = 'Passwords do not match'
  return false
}

// Require password if not using social login
if (!form.useSocialLogin && !form.password) {
  errors.password = 'Password required'
  return false
}
```

---

## Error Handling and Display

### Error Object Structure

Keep errors in an object parallel to form:

```javascript
const form = reactive({
  name: '',
  email: '',
  type: '',
  priority: 1
})

const errors = reactive({
  name: '',
  email: '',
  type: '',
  priority: ''
})
```

This makes it easy to find/update errors.

### Clearing Errors

Always clear previous errors before validation:

```javascript
const validateForm = () => {
  // Clear ALL errors first
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Then run validation...
}
```

### Displaying Errors in Template

```vue
<div>
  <input v-model="form.name" />
  <p v-if="errors.name" class="error">
    {{ errors.name }}
  </p>
</div>
```

### Visual Error Indicators

```vue
<input
  v-model="form.name"
  :class="{ 'has-error': errors.name }"
/>

<style>
.has-error {
  border-color: red;
  background: #ffe0e0;
}
</style>
```

### Multiple Errors Per Field

Sometimes you need multiple error messages:

```javascript
const validateEmail = () => {
  const fieldErrors = []

  if (!form.email) {
    fieldErrors.push('Email is required')
  } else {
    if (!form.email.includes('@')) {
      fieldErrors.push('Email must contain @')
    }
    if (!form.email.includes('.')) {
      fieldErrors.push('Email must contain a domain')
    }
  }

  errors.email = fieldErrors.length > 0 ? fieldErrors[0] : ''
  return fieldErrors.length === 0
}
```

Or show all errors:

```vue
<ul v-if="emailErrors.length > 0" class="error-list">
  <li v-for="error in emailErrors" :key="error">
    {{ error }}
  </li>
</ul>
```

---

## Form Submission

### Preventing Default Behavior

Use `@submit.prevent` to stop page reload:

```vue
<form @submit.prevent="handleSubmit">
  <!-- form fields -->
  <button type="submit">Submit</button>
</form>
```

The `.prevent` modifier is equivalent to:
```javascript
event.preventDefault()
```

### Async Form Submission

Handle loading state while submitting:

```javascript
const isSubmitting = ref(false)
const submitSuccess = ref(false)

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Call API
    await api.createObject(form)

    // Success
    submitSuccess.value = true
    resetForm()
  } catch (error) {
    // Handle error
    errors.submit = error.message
  } finally {
    isSubmitting.value = false
  }
}
```

```vue
<button type="submit" :disabled="isSubmitting">
  {{ isSubmitting ? 'Creating...' : 'Create' }}
</button>
```

### Form Reset

Clear form to initial state:

```javascript
const resetForm = () => {
  form.name = ''
  form.email = ''
  form.type = ''
  // ... reset all fields

  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  submitSuccess.value = false
}
```

Or use HTML reset:
```vue
<form ref="formElement">
  <!-- fields -->
  <button type="reset">Clear</button>
</form>
```

```javascript
const formElement = ref(null)

const resetForm = () => {
  formElement.value.reset()
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}
```

---

## Reusable Form Components

### FormInput Component Pattern

Create a reusable component:

```vue
<!-- FormInput.vue -->
<template>
  <div class="form-group">
    <label :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="{ 'has-error': error }"
    />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, required: true },
    label: String,
    type: { type: String, default: 'text' },
    error: String
  },
  emits: ['update:modelValue']
}
</script>
```

Use it:
```vue
<FormInput
  v-model="form.name"
  label="Name"
  type="text"
  :error="errors.name"
/>
```

### FormSelect Component Pattern

```vue
<!-- FormSelect.vue -->
<template>
  <div class="form-group">
    <label :for="selectId">{{ label }}</label>
    <select
      :id="selectId"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, required: true },
    label: String,
    options: { type: Array, required: true },
    error: String
  },
  emits: ['update:modelValue']
}
</script>
```

Use it:
```vue
<FormSelect
  v-model="form.type"
  label="Type"
  :options="typeOptions"
  :error="errors.type"
/>
```

### Checkbox Array Handling

Checkboxes require special handling for arrays:

```vue
<!-- FormCheckbox.vue -->
<template>
  <input
    type="checkbox"
    :checked="isChecked"
    @change="handleChange"
    :value="value"
  />
  <label>{{ label }}</label>
</template>

<script>
export default {
  props: {
    modelValue: { type: [Boolean, Array], required: true },
    label: String,
    value: String
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const isChecked = computed(() => {
      if (typeof props.modelValue === 'boolean') {
        return props.modelValue
      } else if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(props.value)
      }
    })

    const handleChange = (event) => {
      if (typeof props.modelValue === 'boolean') {
        emit('update:modelValue', event.target.checked)
      } else if (Array.isArray(props.modelValue)) {
        const newValue = [...props.modelValue]
        if (event.target.checked) {
          newValue.push(props.value)
        } else {
          const idx = newValue.indexOf(props.value)
          if (idx > -1) newValue.splice(idx, 1)
        }
        emit('update:modelValue', newValue)
      }
    }

    return { isChecked, handleChange }
  }
}
</script>
```

---

## Form State Management

### Computed Properties for Form State

```javascript
const hasFormData = computed(() => {
  return form.name || form.email || form.type
})

const isFormValid = computed(() => {
  return (
    form.name &&
    form.email &&
    form.type &&
    !errors.name &&
    !errors.email &&
    !errors.type
  )
})

const isFormDirty = computed(() => {
  // Compare with initial state
  return JSON.stringify(form) !== JSON.stringify(initialForm)
})
```

### Complex Form State

For large forms, organize state by sections:

```javascript
const form = reactive({
  // Basic info
  name: '',
  description: '',

  // Classification
  type: '',
  category: '',

  // Access
  owner: '',
  ownerEmail: '',
  accessLevel: 'read',

  // Metadata
  tags: [],
  priority: 1,
  retentionDays: 365,

  // Flags
  flags: [],
  enableNotifications: false
})

const errors = reactive({
  basic: { name: '', description: '' },
  classification: { type: '', category: '' },
  access: { owner: '', ownerEmail: '' },
  metadata: { priority: '', retentionDays: '' }
})
```

---

## Common Patterns

### Pattern 1: Form with Real-time and Submit Validation

```javascript
// Real-time validation for expensive fields
const emailError = computed(() => {
  if (!form.email) return ''
  return isValidEmail(form.email) ? '' : 'Invalid email'
})

// Complete validation on submit
const handleSubmit = () => {
  if (!validateForm()) return
  // Submit...
}

const validateForm = () => {
  // Validates all fields, not just expensive ones
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Validate each field...

  return isValid
}
```

### Pattern 2: Conditional Field Visibility

```javascript
// Only show email if type is 'document'
const showEmail = computed(() => {
  return form.type === 'document'
})
```

```vue
<FormInput
  v-if="showEmail"
  v-model="form.email"
  label="Email"
  :error="errors.email"
/>
```

### Pattern 3: Dynamic Form Fields

Allow adding/removing fields:

```javascript
const form = reactive({
  name: '',
  tags: []  // Array of objects
})

const addTag = () => {
  form.tags.push({ value: '' })
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}
```

```vue
<div v-for="(tag, index) in form.tags" :key="index">
  <input v-model="tag.value" />
  <button @click="removeTag(index)">Remove</button>
</div>
<button @click="addTag">Add Tag</button>
```

### Pattern 4: Save Draft to LocalStorage

```javascript
const saveDraft = () => {
  localStorage.setItem('formDraft', JSON.stringify(form))
}

const loadDraft = () => {
  const draft = localStorage.getItem('formDraft')
  if (draft) {
    Object.assign(form, JSON.parse(draft))
  }
}

// Auto-save on any field change
watch(form, saveDraft, { deep: true })

// Load on mount
onMounted(loadDraft)
```

### Pattern 5: Form Validation Library

For complex apps, use a library:

```javascript
// Example with VeeValidate (popular Vue validation library)
import { useForm, useField } from 'vee-validate'

const { handleSubmit, values } = useForm({
  validationSchema: {
    name: 'required|min:3|max:100',
    email: 'required|email',
    type: 'required'
  }
})

const { value: name, errors: nameErrors } = useField('name')
```

---

## Relationship to Application Analyzer

These form patterns are essential for Application Analyzer:

1. **Filter Forms** - Multi-field forms for searching/filtering
2. **Edit Dialogs** - Forms for editing object properties
3. **Advanced Search** - Complex forms with many criteria
4. **WebReports Queries** - Building queries with forms
5. **Bulk Operations** - Forms selecting objects and actions
6. **Settings** - Configuration forms with many options
7. **User Preferences** - Personal settings forms

Understanding form handling is critical for working with Application Analyzer's forms!

---

## Practice Exercises

### Exercise 1: Add Real-time Email Validation
```javascript
const emailError = computed(() => {
  if (!form.email) return ''
  if (form.email.length < 5) return 'Email too short'
  if (!isValidEmail(form.email)) return 'Invalid email format'
  return ''
})
```

### Exercise 2: Add Conditional Fields
```javascript
const showOwnerEmail = computed(() => {
  return form.type === 'document'
})
```

Show the email field only when type is document.

### Exercise 3: Add Dynamic Fields
```javascript
const form = reactive({
  name: '',
  tags: []  // Array of tag objects
})

const addTag = () => {
  form.tags.push({ value: '', category: '' })
}
```

### Exercise 4: Add Draft Saving
```javascript
const saveDraft = () => {
  localStorage.setItem('form', JSON.stringify(form))
}

// Auto-save
watch(form, saveDraft, { deep: true })
```

### Exercise 5: Add Field Dependencies
```javascript
// Priority shows only if type is 'document'
// Retention shows only if type is 'folder'

const showPriority = computed(() => form.type === 'document')
const showRetention = computed(() => form.type === 'folder')
```

---

## Key Takeaways

1. **v-model is two-way binding** - Updates both ways automatically
2. **v-model works with all input types** - text, email, select, checkbox, radio, textarea
3. **Use .number and .trim modifiers** - They save you validation code
4. **Validate on submit, not just in real-time** - Better performance and UX
5. **Keep errors organized** - Parallel object to form for easy lookup
6. **Create reusable form components** - DRY principle applies to forms too
7. **Handle loading and error states** - Show feedback to users
8. **Separate validation logic** - validateForm() function, not inline
9. **Clear errors before validation** - Fresh start each time
10. **Save drafts** - Better UX for complex forms

Forms are one of the most important parts of any web app. Master these patterns and you'll be able to build anything!
