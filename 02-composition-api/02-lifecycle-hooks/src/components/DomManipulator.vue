<template>
  <div class="dom-manipulator">
    <div ref="boxRef" class="box">I will change color!</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const boxRef = ref(null)

onMounted(() => {
  if (boxRef.value) {
    boxRef.value.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
})
</script>

<style scoped>
.box {
  padding: 20px;
  border-radius: 6px;
  color: white;
  text-align: center;
}
</style>
