<template>
  <div class="radio-wrapper">
    <input
      :id="radioId"
      type="radio"
      :checked="modelValue === value"
      :value="value"
      @change="$emit('update:modelValue', value)"
      class="radio-input"
    >
    <label :for="radioId" class="radio-label">
      {{ label }}
    </label>
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
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  },

  emits: ['update:modelValue'],

  setup(props) {
    const radioId = computed(() => `radio-${Math.random().toString(36).slice(2, 9)}`)

    return {
      radioId
    }
  }
}
</script>

<style scoped>
.radio-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.radio-label {
  cursor: pointer;
  user-select: none;
  font-size: 0.95rem;
  color: #333;
}

.radio-input:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>
