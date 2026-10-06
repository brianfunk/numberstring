import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', 'archive/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: ['vitest.config.js', 'eslint.config.js', 'archive/**', 'site/**', 'scripts/**', 'demo.js']
    }
  }
});
