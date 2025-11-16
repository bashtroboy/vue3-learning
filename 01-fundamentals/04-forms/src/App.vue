<template>
  <div class="app">
    <header class="header">
      <h1>Content Server Object Creator</h1>
      <p class="subtitle">Learn Forms, Validation, and v-model</p>
    </header>

    <main class="container">
      <!-- Success Message -->
      <div v-if="submitSuccess" class="alert alert-success">
        <strong>Success!</strong> Object created successfully.
        <button class="close-btn" @click="submitSuccess = false">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="form">
        <!-- Object Name (Required Text Input) -->
        <FormInput
          v-model="form.name"
          label="Object Name"
          type="text"
          placeholder="Enter object name"
          :error="errors.name"
          required
        />

        <!-- Description (Textarea) -->
        <FormTextarea
          v-model="form.description"
          label="Description"
          placeholder="Describe this object..."
          rows="4"
          :error="errors.description"
        />

        <!-- Object Type (Select) -->
        <FormSelect
          v-model="form.type"
          label="Object Type"
          :options="objectTypes"
          :error="errors.type"
          required
        />

        <!-- Owner (Required Text Input) -->
        <FormInput
          v-model="form.owner"
          label="Owner"
          type="text"
          placeholder="e.g., John Doe"
          :error="errors.owner"
          required
        />

        <!-- Owner Email (Email Input with Validation) -->
        <FormInput
          v-model="form.ownerEmail"
          label="Owner Email"
          type="email"
          placeholder="owner@example.com"
          :error="errors.ownerEmail"
          required
        />

        <!-- Access Level (Radio Buttons) -->
        <div class="form-group">
          <label class="form-label">Access Level</label>
          <div class="radio-group">
            <FormRadio
              v-for="level in accessLevels"
              :key="level.value"
              v-model="form.accessLevel"
              :label="level.label"
              :value="level.value"
            />
          </div>
          <p v-if="errors.accessLevel" class="error-message">
            {{ errors.accessLevel }}
          </p>
        </div>

        <!-- Status Checkboxes -->
        <div class="form-group">
          <label class="form-label">Status Flags</label>
          <div class="checkbox-group">
            <FormCheckbox
              v-model="form.flags"
              label="Published"
              value="published"
            />
            <FormCheckbox
              v-model="form.flags"
              label="Archived"
              value="archived"
            />
            <FormCheckbox
              v-model="form.flags"
              label="Locked"
              value="locked"
            />
          </div>
        </div>

        <!-- Priority (Number Input with Validation) -->
        <FormInput
          v-model.number="form.priority"
          label="Priority (1-5)"
          type="number"
          min="1"
          max="5"
          :error="errors.priority"
        />

        <!-- Retention Days (Number Input) -->
        <FormInput
          v-model.number="form.retentionDays"
          label="Retention Days"
          type="number"
          min="1"
          :error="errors.retentionDays"
        />

        <!-- Enable Notifications (Single Checkbox) -->
        <FormCheckbox
          v-model="form.enableNotifications"
          label="Enable notifications for this object"
        />

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create Object' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="resetForm">
            Clear Form
          </button>
        </div>

        <!-- Form State Debug Info (Development Only) -->
        <div v-if="showDebugInfo" class="debug-info">
          <h4>Form State (Debug)</h4>
          <pre>{{ JSON.stringify(form, null, 2) }}</pre>
        </div>
      </form>

      <!-- Form Summary -->
      <div v-if="hasFormData" class="summary">
        <h3>Form Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Name:</span>
            <span class="value">{{ form.name || '(empty)' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Type:</span>
            <span class="value">{{ form.type || '(not selected)' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Access:</span>
            <span class="value">{{ form.accessLevel }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Flags:</span>
            <span class="value">{{ form.flags.length ? form.flags.join(', ') : '(none)' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Notifications:</span>
            <span class="value">{{ form.enableNotifications ? 'Enabled' : 'Disabled' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Form Valid:</span>
            <span class="value" :class="{ 'is-valid': isFormValid, 'is-invalid': !isFormValid }">
              {{ isFormValid ? '✓ Valid' : '✗ Invalid' }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import FormInput from './components/FormInput.vue'
import FormTextarea from './components/FormTextarea.vue'
import FormSelect from './components/FormSelect.vue'
import FormCheckbox from './components/FormCheckbox.vue'
import FormRadio from './components/FormRadio.vue'

export default {
  components: {
    FormInput,
    FormTextarea,
    FormSelect,
    FormCheckbox,
    FormRadio
  },

  setup() {
    // ==================== STATE ====================

    const form = reactive({
      name: '',
      description: '',
      type: '',
      owner: '',
      ownerEmail: '',
      accessLevel: 'read',
      flags: [],
      priority: 3,
      retentionDays: 365,
      enableNotifications: false
    })

    const errors = reactive({
      name: '',
      description: '',
      type: '',
      owner: '',
      ownerEmail: '',
      accessLevel: '',
      priority: '',
      retentionDays: ''
    })

    const submitSuccess = ref(false)
    const isSubmitting = ref(false)
    const showDebugInfo = ref(false)

    // ==================== OPTIONS ====================

    const objectTypes = [
      { value: '', label: 'Select a type' },
      { value: 'document', label: 'Document' },
      { value: 'folder', label: 'Folder' },
      { value: 'category', label: 'Category' },
      { value: 'custom', label: 'Custom Object' }
    ]

    const accessLevels = [
      { value: 'read', label: 'Read-only' },
      { value: 'write', label: 'Read & Write' },
      { value: 'admin', label: 'Admin' }
    ]

    // ==================== COMPUTED PROPERTIES ====================

    const hasFormData = computed(() => {
      return form.name || form.description || form.type || form.owner
    })

    const isFormValid = computed(() => {
      return !!(
        form.name &&
        form.type &&
        form.owner &&
        form.ownerEmail &&
        !errors.name &&
        !errors.ownerEmail &&
        !errors.priority &&
        !errors.retentionDays
      )
    })

    // ==================== VALIDATION ====================

    const validateForm = () => {
      // Clear previous errors
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      let isValid = true

      // Name validation
      if (!form.name.trim()) {
        errors.name = 'Name is required'
        isValid = false
      } else if (form.name.length < 3) {
        errors.name = 'Name must be at least 3 characters'
        isValid = false
      } else if (form.name.length > 100) {
        errors.name = 'Name must not exceed 100 characters'
        isValid = false
      }

      // Type validation
      if (!form.type) {
        errors.type = 'Object type is required'
        isValid = false
      }

      // Owner validation
      if (!form.owner.trim()) {
        errors.owner = 'Owner is required'
        isValid = false
      }

      // Email validation
      if (!form.ownerEmail.trim()) {
        errors.ownerEmail = 'Email is required'
        isValid = false
      } else if (!isValidEmail(form.ownerEmail)) {
        errors.ownerEmail = 'Please enter a valid email address'
        isValid = false
      }

      // Description validation (optional but if provided, min length)
      if (form.description && form.description.length > 500) {
        errors.description = 'Description must not exceed 500 characters'
        isValid = false
      }

      // Priority validation
      if (form.priority && (form.priority < 1 || form.priority > 5)) {
        errors.priority = 'Priority must be between 1 and 5'
        isValid = false
      }

      // Retention days validation
      if (form.retentionDays && form.retentionDays < 1) {
        errors.retentionDays = 'Retention days must be at least 1'
        isValid = false
      }

      return isValid
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    // ==================== METHODS ====================

    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      isSubmitting.value = true

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('Form submitted:', form)
      submitSuccess.value = true
      isSubmitting.value = false

      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm()
      }, 2000)
    }

    const resetForm = () => {
      form.name = ''
      form.description = ''
      form.type = ''
      form.owner = ''
      form.ownerEmail = ''
      form.accessLevel = 'read'
      form.flags = []
      form.priority = 3
      form.retentionDays = 365
      form.enableNotifications = false
      submitSuccess.value = false

      // Clear errors
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
    }

    return {
      form,
      errors,
      submitSuccess,
      isSubmitting,
      showDebugInfo,
      objectTypes,
      accessLevels,
      hasFormData,
      isFormValid,
      handleSubmit,
      resetForm
    }
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: white;
  padding: 40px 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert {
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.3s ease;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  padding: 0;
}

.form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-message {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #ddd;
  color: #333;
}

.btn-secondary:hover {
  background: #ccc;
}

.summary {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary h3 {
  margin-bottom: 16px;
  color: #333;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.summary-item .label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.summary-item .value {
  color: #333;
  font-size: 0.95rem;
  word-break: break-word;
}

.summary-item .value.is-valid {
  color: #4caf50;
  font-weight: 600;
}

.summary-item .value.is-invalid {
  color: #f44336;
}

.debug-info {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid #667eea;
  margin-top: 20px;
}

.debug-info h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 0.9rem;
}

.debug-info pre {
  background: white;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.75rem;
  color: #666;
  margin: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }

  .form {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
