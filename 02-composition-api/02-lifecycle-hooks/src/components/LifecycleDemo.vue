<template>
  <div class="lifecycle-demo">
    <h3>Lifecycle Demo Component</h3>
    <p>Count prop: {{ count }}</p>
    <p>Internal state: {{ internalCount }}</p>
    <button @click="internalCount++">Update Internal State</button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

const props = defineProps(['count'])
const emit = defineEmits(['log'])

const internalCount = ref(0)

emit('log', 'setup', 'Component setup() called', 'info')

onBeforeMount(() => {
  emit('log', 'onBeforeMount', 'About to mount - DOM not yet created', 'mount')
})

onMounted(() => {
  emit('log', 'onMounted', 'Component mounted - DOM is ready', 'mount')
})

onBeforeUpdate(() => {
  emit('log', 'onBeforeUpdate', 'About to update - before DOM re-render', 'update')
})

onUpdated(() => {
  emit('log', 'onUpdated', 'Component updated - DOM has been patched', 'update')
})

onBeforeUnmount(() => {
  emit('log', 'onBeforeUnmount', 'About to unmount - component still functional', 'unmount')
})

onUnmounted(() => {
  emit('log', 'onUnmounted', 'Component unmounted - cleanup complete', 'unmount')
})
</script>

<style scoped>
.lifecycle-demo {
  padding: 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 8px;
}
</style>
