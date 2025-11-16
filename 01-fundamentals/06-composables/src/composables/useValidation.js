/**
 * useValidation - Reusable validation rules
 *
 * @returns {Object} Validation functions
 */
export function useValidation() {
  // Required field validation
  function required(value, fieldName = 'This field') {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`
    }
    return null
  }

  // Minimum length validation
  function minLength(value, min, fieldName = 'This field') {
    if (!value) return null // Skip if empty (use required separately)

    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`
    }
    return null
  }

  // Maximum length validation
  function maxLength(value, max, fieldName = 'This field') {
    if (!value) return null

    if (value.length > max) {
      return `${fieldName} must be at most ${max} characters`
    }
    return null
  }

  // Email validation
  function email(value, fieldName = 'Email') {
    if (!value) return null

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return `${fieldName} must be a valid email address`
    }
    return null
  }

  // Number range validation
  function numberRange(value, min, max, fieldName = 'This field') {
    if (value === null || value === undefined || value === '') return null

    const num = Number(value)
    if (isNaN(num)) {
      return `${fieldName} must be a number`
    }

    if (min !== undefined && num < min) {
      return `${fieldName} must be at least ${min}`
    }

    if (max !== undefined && num > max) {
      return `${fieldName} must be at most ${max}`
    }

    return null
  }

  // URL validation
  function url(value, fieldName = 'URL') {
    if (!value) return null

    try {
      new URL(value)
      return null
    } catch {
      return `${fieldName} must be a valid URL`
    }
  }

  // Pattern matching
  function pattern(value, regex, fieldName = 'This field', message) {
    if (!value) return null

    if (!regex.test(value)) {
      return message || `${fieldName} format is invalid`
    }
    return null
  }

  // Match another field (useful for password confirmation)
  function matches(value, otherValue, fieldName = 'This field', otherFieldName = 'the other field') {
    if (value !== otherValue) {
      return `${fieldName} must match ${otherFieldName}`
    }
    return null
  }

  // Compose multiple validators
  function validate(value, validators) {
    for (const validator of validators) {
      const error = validator(value)
      if (error) return error
    }
    return null
  }

  return {
    required,
    minLength,
    maxLength,
    email,
    numberRange,
    url,
    pattern,
    matches,
    validate
  }
}
