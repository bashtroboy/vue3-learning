<template>
  <div class="timer">Timer: {{ seconds }}s</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const seconds = ref(0)
let interval

onMounted(() => {
  interval = setInterval(() => {
    seconds.value++
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
