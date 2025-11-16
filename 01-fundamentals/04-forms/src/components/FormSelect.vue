<template>
  <div class="form-group">
    <label v-if="label" :for="selectId" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
      class="select"
      :class="{ 'has-error': error }"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
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
    options: {
      type: Array,
      required: true,
      validator: (arr) => arr.every(item => 'value' in item && 'label' in item)
    },
    error: String,
    hint: String,
    required: Boolean,
    disabled: Boolean
  },

  emits: ['update:modelValue'],

  setup(props) {
    const selectId = computed(() => `select-${Math.random().toString(36).slice(2, 9)}`)

    return {
      selectId
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

.select {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23333' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.select.has-error {
  border-color: #d32f2f;
  background-color: #ffebee;
}

.select.has-error:focus {
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
