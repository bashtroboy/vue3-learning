<template>
  <div class="symbol-example">
    <p>
      This component uses a <strong>Symbol</strong> as the injection key.
      Symbols prevent naming conflicts and provide better type safety.
    </p>
    <div class="code-example">
      <code>const ThemeSymbol = Symbol('theme')</code>
      <br />
      <code>provide(ThemeSymbol, theme)</code>
      <br />
      <code>const theme = inject(ThemeSymbol)</code>
    </div>
    <div class="benefit">
      <strong>✨ Benefits:</strong>
      <ul>
        <li>No naming conflicts (symbols are unique)</li>
        <li>Better TypeScript support</li>
        <li>Explicit dependencies</li>
        <li>Can't be overridden accidentally</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Example of using symbols (demonstrated conceptually)
// In real code, you'd export the symbol from a shared file
</script>

<style scoped>
.symbol-example {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  line-height: 1.6;
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

.benefit {
  margin-top: 15px;
  padding: 15px;
  background: #e7f3ff;
  border-left: 4px solid #667eea;
  border-radius: 4px;
}

.benefit strong {
  color: #667eea;
  display: block;
  margin-bottom: 10px;
}

.benefit ul {
  margin-left: 20px;
}

.benefit li {
  margin: 5px 0;
  color: #555;
}
</style>
