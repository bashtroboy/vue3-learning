<script setup lang="ts">
interface Props {
  id: number
}

defineProps<Props>()
</script>

<template>
  <div class="view">
    <h2>Node Detail</h2>
    <p>Viewing node ID: {{ id }}</p>
  </div>
</template>

<style scoped>
.view { padding: 1rem; }
.view h2 { color: #2c3e50; margin-bottom: 1rem; }
</style>
