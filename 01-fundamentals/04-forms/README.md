# Forms & Validation

## What We're Building

A **Content Server Object Creator** form that demonstrates comprehensive form handling, validation, and user feedback.

This lesson builds on previous lessons to create a real-world form with multiple input types, validation rules, error handling, and success feedback.

## Key Concepts Learned

1. **v-model** - Two-way data binding on all input types
2. **Form Validation** - Client-side validation with error messages
3. **Input Types** - text, email, number, textarea, select, checkbox, radio
4. **Form Submission** - Handling submit events and preventing default behavior
5. **Error Display** - Showing validation errors to users
6. **Form State** - Managing complex form state with reactive()
7. **Async Operations** - Simulating API calls with async/await
8. **User Feedback** - Success messages and loading states

## Features

- **Multiple Input Types** - Text, email, number, textarea, select, radio, checkbox
- **Real-time Validation** - As-you-type validation for some fields
- **Error Messages** - Clear error feedback for invalid inputs
- **Form Summary** - Live preview of form data
- **Submit Handling** - Async form submission with loading state
- **Success Feedback** - Success message after submission
- **Form Reset** - Clear form and errors
- **Disabled States** - Handle disabled form state
- **Accessibility** - Proper labels, IDs, and focus management

## File Structure

```
04-forms/
├── index.html              # Entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── src/
│   ├── main.js             # App initialization
│   ├── App.vue             # Main form component
│   └── components/
│       ├── FormInput.vue       # Text/email/number input
│       ├── FormTextarea.vue    # Textarea with char count
│       ├── FormSelect.vue      # Select dropdown
│       ├── FormCheckbox.vue    # Checkbox (single or group)
│       └── FormRadio.vue       # Radio button
├── README.md               # This file
└── NOTES.md                # Deep-dive explanations
```

## How to Run

### First Time Setup
```bash
cd 01-fundamentals/04-forms
npm install
```

### Development
```bash
npm run dev
```
Opens automatically at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## What You'll Learn

### Form Concepts
- **v-model** binding on different input types
- **v-model modifiers** like `.number` for type coercion
- **Form events** like `@submit` and `@input`
- **Form state management** with reactive()
- **Field validation** at submission time

### Validation Patterns
- Required field validation
- Min/max length validation
- Email validation with regex
- Number range validation
- Custom validation logic

### Vue Patterns
- Reusable form input components
- Props for configuration (label, error, hint)
- Emits for value updates
- Computed properties for form state (valid, has data)
- Error object management

### Component Design
- Creating reusable FormInput, FormSelect, etc.
- Handling both single and grouped checkboxes
- Radio button groups
- Textarea with character counter
- Error message display patterns

## Key Code Examples

### v-model Two-way Binding
```vue
<input
  v-model="form.name"
  type="text"
  placeholder="Enter name"
/>
```

### v-model with Different Input Types
```vue
<!-- Text input -->
<input v-model="form.name" type="text" />

<!-- Number with .number modifier -->
<input v-model.number="form.priority" type="number" />

<!-- Email -->
<input v-model="form.email" type="email" />

<!-- Textarea -->
<textarea v-model="form.description"></textarea>

<!-- Select -->
<select v-model="form.type">
  <option value="document">Document</option>
  <option value="folder">Folder</option>
</select>

<!-- Checkbox (boolean) -->
<input v-model="form.agree" type="checkbox" />

<!-- Checkbox Group (array) -->
<input v-model="form.flags" type="checkbox" value="published" />
<input v-model="form.flags" type="checkbox" value="archived" />

<!-- Radio Group -->
<input v-model="form.access" type="radio" value="read" />
<input v-model="form.access" type="radio" value="write" />
```

### Form Validation
```javascript
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  } else if (form.name.length < 3) {
    errors.name = 'Name must be at least 3 characters'
    isValid = false
  }

  // Validate email
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  return isValid
}

// Email validation with regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

### Form Submission
```javascript
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Handle success
    submitSuccess.value = true
    resetForm()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isSubmitting.value = false
  }
}
```

### Reusable FormInput Component
```vue
<FormInput
  v-model="form.name"
  label="Name"
  type="text"
  placeholder="Enter name"
  :error="errors.name"
  hint="Must be 3-100 characters"
  required
/>
```

## Form Features

### Input Types Supported
- **Text** - Basic string input
- **Email** - Built-in browser validation
- **Number** - Numeric input with min/max
- **Textarea** - Multi-line text with character counter
- **Select** - Dropdown selection
- **Checkbox** - Single or grouped
- **Radio** - Exclusive selection

### Validation Rules
- **Name** - Required, 3-100 characters
- **Email** - Required, valid email format
- **Type** - Required, select from options
- **Owner** - Required, non-empty string
- **Priority** - Optional, must be 1-5 if provided
- **Retention** - Optional, must be at least 1 day

### Error Display
- Clear error messages below each field
- Red border on error
- Form submits only if valid
- Errors cleared when form is valid

### User Feedback
- Loading state while submitting
- Success message after submission
- Form automatically resets
- Form summary shows current data

## Differences from Previous Lessons

### From Lesson 3 (Lists & Conditionals)
- **Form handling** instead of just rendering lists
- **Validation** instead of just filtering
- **User input processing** instead of just display
- **Async operations** like form submission
- **Component composition** for form fields

### Vue Features Used
- Lesson 1: Reactivity, ref(), v-model basics
- Lesson 2: Components, props, events
- Lesson 3: Lists, conditionals, computed
- **Lesson 4: Complex form state, validation, async**

## Practice Challenges

Try these enhancements:

1. **Real-time Validation** - Validate as user types (not just on submit)
2. **Field Dependencies** - Show/hide fields based on other field values
3. **Custom Validators** - Create reusable validator functions
4. **Dirty State** - Track which fields have been modified
5. **Save Draft** - Save form to localStorage
6. **Multi-step Form** - Break into multiple pages/steps
7. **Conditional Fields** - Show "Owner Email" only if "Type" is "Document"
8. **Dynamic Fields** - Add/remove form fields dynamically

## Common Patterns in Application Analyzer

This lesson teaches patterns used extensively in Application Analyzer:

1. **Filter/Search Forms** - Multi-field filtering with validation
2. **Edit Dialogs** - Object editing with form submission
3. **Bulk Operations** - Forms with multiple selections
4. **Advanced Queries** - Complex form state for WebReports
5. **Settings Panels** - Configuration forms
6. **User Preferences** - Forms with various input types
7. **Search Interfaces** - Advanced search with multiple criteria

## Next Steps

After mastering forms, you'll be ready for:
- **Lesson 5**: Deep Dive Reactivity (watchEffect, watch)
- **Lesson 6**: Composables (extract form logic into reusable functions)
- **Project 1**: Build the Content Server Node Browser

## Helpful Links

- [Vue 3 Form Input Bindings](https://vuejs.org/guide/essentials/forms.html)
- [Vue 3 Form Validation](https://vuejs.org/guide/scaling-up/state-management.html)
- [HTML Input Types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
- [Regular Expressions for Validation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

## Key Takeaways

1. **v-model works with all input types** - text, email, number, select, checkbox, radio, textarea
2. **Validation is your responsibility** - Vue doesn't enforce it, you write the rules
3. **Keep form state organized** - Use reactive() for complex forms
4. **Separate validation logic** - Create validateForm() function, don't mix with template
5. **Reusable components** - Build FormInput, FormSelect, etc. and use everywhere
6. **Clear error messaging** - Users need to understand what's wrong
7. **Async operations need loading states** - Show feedback while submitting
8. **v-model modifiers are powerful** - Use .number, .trim, etc. for data transformation

---

**Ready to dive deeper?** Check out `NOTES.md` for detailed explanations, validation patterns, and advanced form techniques.
