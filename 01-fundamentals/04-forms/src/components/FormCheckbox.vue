<template>
  <div class="checkbox-wrapper">
    <input
      :id="checkboxId"
      type="checkbox"
      :checked="isChecked"
      :value="value"
      @change="handleChange"
      class="checkbox-input"
    >
    <label :for="checkboxId" class="checkbox-label">
      {{ label }}
    </label>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    modelValue: {
      type: [Boolean, Array],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      default: true
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const checkboxId = computed(() => `checkbox-${Math.random().toString(36).slice(2, 9)}`)

    // Determine if this checkbox is checked
    const isChecked = computed(() => {
      if (typeof props.modelValue === 'boolean') {
        // Single checkbox mode
        return props.modelValue
      } else if (Array.isArray(props.modelValue)) {
        // Multiple checkboxes mode (group)
        return props.modelValue.includes(props.value)
      }
      return false
    })

    // Handle checkbox change
    const handleChange = (event) => {
      if (typeof props.modelValue === 'boolean') {
        // Single checkbox: toggle boolean
        emit('update:modelValue', event.target.checked)
      } else if (Array.isArray(props.modelValue)) {
        // Multiple checkboxes: add/remove from array
        const newValue = [...props.modelValue]
        if (event.target.checked) {
          newValue.push(props.value)
        } else {
          const index = newValue.indexOf(props.value)
          if (index > -1) {
            newValue.splice(index, 1)
          }
        }
        emit('update:modelValue', newValue)
      }
    }

    return {
      checkboxId,
      isChecked,
      handleChange
    }
  }
}
</script>

<style scoped>
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-label {
  cursor: pointer;
  user-select: none;
  font-size: 0.95rem;
  color: #333;
}

.checkbox-input:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>
