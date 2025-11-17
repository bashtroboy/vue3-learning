<template>
  <div class="global-demo">
    <h4>Global Properties Demo</h4>
    <p>These properties are available via <code>getCurrentInstance()</code>:</p>

    <div class="property-list">
      <div class="property">
        <strong>$toast:</strong> {{ typeof proxy.$toast }}
      </div>
      <div class="property">
        <strong>$i18n:</strong> {{ typeof proxy.$i18n }}
      </div>
      <div class="property">
        <strong>$logger:</strong> {{ typeof proxy.$logger }}
      </div>
      <div class="property">
        <strong>$http:</strong> {{ typeof proxy.$http }}
      </div>
    </div>

    <button @click="useGlobalProperties" class="btn btn-primary">
      Test Global Properties
    </button>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const proxy = instance?.proxy

const useGlobalProperties = () => {
  // Access via global properties
  proxy.$toast.info('Using global $toast property!')
  proxy.$logger.info('Using global $logger property!')

  alert('Check console and toast notifications!')
}
</script>

<style scoped>
.global-demo {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.global-demo h4 {
  margin-top: 0;
}

.property-list {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}

.property {
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.property:last-child {
  border-bottom: none;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}
</style>
