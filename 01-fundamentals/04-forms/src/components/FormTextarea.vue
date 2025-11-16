<template>
  <div class="form-group">
    <label v-if="label" :for="textareaId" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      class="textarea"
      :class="{ 'has-error': error }"
    ></textarea>
    <div class="info-row">
      <p v-if="error" class="error-message">{{ error }}</p>
      <span class="char-count">{{ modelValue.length }}/{{ maxLength }}</span>
    </div>
    <p v-if="hint" class="hint-message">{{ hint }}</p>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    modelValue: {
      type: String,
      required: true
    },
    label: String,
    placeholder: String,
    error: String,
    hint: String,
    required: Boolean,
    disabled: Boolean,
    rows: {
      type: Number,
      default: 4
    },
    maxLength: {
      type: Number,
      default: 500
    }
  },

  emits: ['update:modelValue'],

  setup(props) {
    const textareaId = computed(() => `textarea-${Math.random().toString(36).slice(2, 9)}`)

    return {
      textareaId
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

.textarea {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
}

.textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.textarea:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.textarea.has-error {
  border-color: #d32f2f;
  background: #ffebee;
}

.textarea.has-error:focus {
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
}

.error-message {
  color: #d32f2f;
}

.char-count {
  color: #999;
}

.hint-message {
  color: #999;
  font-size: 0.85rem;
}
</style>
