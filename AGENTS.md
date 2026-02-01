# AI Agent Instructions for numberstring

## Overview

`numberstring` is a JavaScript library that converts numbers to their English word representation. It supports numbers from 0 to `Number.MAX_SAFE_INTEGER` (~9 quadrillion).

## Key Functions

### Main Export: `numberstring(n, options)`
- Converts a number to English words
- Returns `string` on success, `false` on invalid input
- Options: `{ cap: 'title'|'upper'|'lower', punc: '!'|'?'|'.' }`

### Named Exports
- `comma(n)` - Format number with comma separators
- `group(n)` - Get magnitude group (0=ones, 1=thousands, 2=millions, etc.)

## Usage Examples

```javascript
import numberstring, { comma, group } from 'numberstring';

numberstring(42);                     // 'forty-two'
numberstring(1000000);                // 'one million'
numberstring(100, { cap: 'title' });  // 'One Hundred'
numberstring(50, { punc: '!' });      // 'fifty!'

comma(1234567);  // '1,234,567'
group(1000000);  // 2 (millions)
```

## Important Notes

- Only accepts non-negative integers within safe integer range
- Returns `false` for: NaN, Infinity, negative numbers, strings, objects
- Hyphenates compound numbers (e.g., "forty-two", "ninety-nine")
- This is an ESM-only package (use `import`, not `require`)

## Testing

```bash
npm test          # Run tests
npm run lint      # Run ESLint
npm run test:coverage  # Run with coverage
```

## Code Architecture

- `index.js` - Single file containing all logic
- Pure functions, no side effects
- Frozen arrays for immutable word lists
- Full JSDoc type documentation
