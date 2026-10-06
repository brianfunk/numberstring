import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  {
    files: ['site/**/*.js'],
    languageOptions: { globals: { document: 'readonly', window: 'readonly', location: 'readonly', history: 'readonly' } }
  },
  {
    ignores: ['node_modules/', 'coverage/', 'archive/', 'site/lib/']
  }
];
