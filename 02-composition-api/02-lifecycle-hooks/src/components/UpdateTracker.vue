<template>
  <div class="update-tracker">
    <button @click="count++">Clicks: {{ count }}</button>
    <p>onUpdated called: {{ updateCount }} times</p>
  </div>
</template>

<script setup>
import { ref, onUpdated } from 'vue'

const count = ref(0)
const updateCount = ref(0)

onUpdated(() => {
  updateCount.value++
})
</script>
