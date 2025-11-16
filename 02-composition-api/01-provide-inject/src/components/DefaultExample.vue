<template>
  <div class="default-example">
    <p>
      This component tries to inject a value that isn't provided.
      It uses a <strong>default value</strong> instead.
    </p>
    <div class="injected-value">
      <strong>Injected Value:</strong> {{ nonExistentValue }}
    </div>
    <div class="code-example">
      <code>const value = inject('nonExistent', 'Default Value')</code>
    </div>
    <div class="explanation">
      <p>
        Without the default value, <code>inject()</code> would return <code>undefined</code>.
        Providing defaults makes components more robust and prevents errors.
      </p>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// Try to inject something that doesn't exist, with a default
const nonExistentValue = inject('nonExistent', 'Default Value ✨')
</script>

<style scoped>
.default-example {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  line-height: 1.6;
}

.injected-value {
  margin: 15px 0;
  padding: 12px;
  background: #e7f3ff;
  border-left: 4px solid #667eea;
  border-radius: 4px;
  font-size: 0.95rem;
}

.code-example {
  margin: 15px 0;
  padding: 15px;
  background: #2d3748;
  color: #f8f8f2;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.explanation {
  margin-top: 15px;
  padding: 15px;
  background: #fff8e1;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.explanation p {
  color: #555;
  font-size: 0.9rem;
}

.explanation code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}
</style>
