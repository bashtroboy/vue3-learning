<template>
  <div class="form-group">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
      :class="{ 'has-error': error }"
    >
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="hint" class="hint-message">{{ hint }}</p>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    },
    label: String,
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'email', 'number', 'password', 'tel'].includes(value)
    },
    placeholder: String,
    error: String,
    hint: String,
    required: Boolean,
    disabled: Boolean,
    min: [String, Number],
    max: [String, Number]
  },

  emits: ['update:modelValue'],

  setup(props) {
    const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 9)}`)

    return {
      inputId
    }
  }
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.required {
  color: #d32f2f;
  margin-left: 4px;
}

.input {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.input.has-error {
  border-color: #d32f2f;
  background: #ffebee;
}

.input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.error-message {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 2px;
}

.hint-message {
  color: #999;
  font-size: 0.85rem;
  margin-top: 2px;
}
</style>
