<template>
  <button class="themed-button" :style="buttonStyle" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup>
import { inject, computed } from 'vue'

defineEmits(['click'])

const theme = inject('theme')

const buttonStyle = computed(() => ({
  background: theme.colors.primary,
  color: '#ffffff'
}))
</script>

<style scoped>
.themed-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.themed-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.themed-button:active {
  transform: translateY(0);
}
</style>
