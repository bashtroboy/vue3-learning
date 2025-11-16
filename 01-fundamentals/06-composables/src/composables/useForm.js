import { reactive, computed } from 'vue'

/**
 * useForm - Reusable form state management
 *
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form utilities
 */
export function useForm(initialValues = {}) {
  const formData = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})

  // Mark a field as touched
  function setFieldTouched(field, isTouched = true) {
    touched[field] = isTouched
  }

  // Set a field value
  function setFieldValue(field, value) {
    formData[field] = value
    setFieldTouched(field)
  }

  // Set an error for a field
  function setFieldError(field, error) {
    if (error) {
      errors[field] = error
    } else {
      delete errors[field]
    }
  }

  // Clear all errors
  function clearErrors() {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  // Reset form to initial values
  function resetForm() {
    Object.keys(formData).forEach(key => {
      formData[key] = initialValues[key]
    })
    clearErrors()
    Object.keys(touched).forEach(key => delete touched[key])
  }

  // Check if form has any errors
  const hasErrors = computed(() => Object.keys(errors).length > 0)

  // Check if form is valid
  const isValid = computed(() => !hasErrors.value)

  // Get all form values
  const values = computed(() => ({ ...formData }))

  return {
    formData,
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
    setFieldError,
    clearErrors,
    resetForm,
    hasErrors,
    isValid,
    values
  }
}
