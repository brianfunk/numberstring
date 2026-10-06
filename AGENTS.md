# AI Agent Instructions for numberstring

## Overview

`numberstring` is a zero-dependency JavaScript library that converts numbers to words in 22 languages, with ordinals, decimals, currency, fractions, Roman numerals, and BigInt support up to 10^36. A static playground in `site/` is deployed to Netlify.

## Key Functions

### Main Export: `numberstring(n, options)`
- Converts a number to words; forgiving: accepts integers, negatives, decimals, numeric strings, BigInt
- Returns `string` on success, `false` on invalid input
- Options: `cap` (title, upper, lower, sentence, camel, pascal, snake, kebab, constant, dot), `punc` ('!' '?' '.'), `lang`, `point`, `and` (British), `formal` (zh/ja)

### Named Exports

English words: `ordinal`, `nth`, `decimal`, `fraction`, `percent`, `currency`, `year`, `telephone`, `negative`, `parse`, `toWords`

Spoken and coded: `nato` (aliases `icao`, `military`), `morse`

Notation: `compact`, `scientific`, `comma`, `group`, `binary`, `octal`, `hex`, `radix`, `bytes`, `bits`

Other numeral systems (`numerals.js`): `roman`, `greek`, `egyptian`, `babylonian`, `fancy`, `clock`

Languages (cardinals, non-negative integers): `spanish`, `french`, `german`, `danish`, `chinese`, `hindi`, `russian`, `portuguese`, `japanese`, `korean`, `arabic`, `italian`, `dutch`, `turkish`, `polish`, `swedish`, `indonesian`, `thai`, `norwegian`, `finnish`, `icelandic`. `chinese` and `japanese` accept `{ formal: true }`; `spanish` and `portuguese` accept `{ cap }`.

Constants: `CAP_STYLES`, `FANCY_STYLE_NAMES`

## Usage Examples

```javascript
import numberstring, { comma, group } from 'numberstring';

numberstring(42);                     // 'forty-two'
numberstring(-3.14);                  // 'negative three point one four'
numberstring('1000000');              // 'one million'
numberstring(42, { lang: 'es' });     // 'cuarenta y dos'
numberstring(100, { cap: 'title' });  // 'One Hundred'
numberstring(50, { punc: '!' });      // 'fifty!'

comma(1234567);  // '1,234,567'
group(1000000);  // 2 (millions)
```

## Important Notes

- Returns `false` for: NaN, Infinity, non-numeric strings, objects, values beyond 10^36
- Language modules handle non-negative integers only; negatives/decimals with a non-English `lang` return `false`
- Hyphenates compound numbers (e.g., "forty-two", "ninety-nine")
- This is an ESM-only package (use `import`, not `require`)

## Testing

```bash
npm test          # Run tests
npm run lint      # Run ESLint
npm run test:coverage  # Run with coverage
```

## Code Architecture

- `index.js` - English core and all public helpers (ordinal, nato, scientific, bytes, ...)
- `numerals.js` - roman-adjacent systems (egyptian, babylonian, greek), `fancy()` digit styles, `clock()`
- `languages/*.js` - one module per language; `test/languages.test.js` is the per-language spot-check table
- `test/extras.test.js` - tests for everything added in 1.2.0
- `index.d.ts` - hand-written types; check with `npx tsc --noEmit --strict index.d.ts`
- `site/` - playground; `scripts/build-site.js` stages the library into `site/lib/`
- `archive/` - unmaintained code (old Express server), excluded from tests and lint
- Pure functions, no side effects
- **Zero runtime dependencies.** Never add a package to `dependencies`.
- Only use Unicode blocks that macOS renders with system fonts (Mayan numerals and tally marks were dropped for this reason)
- Frozen arrays for immutable word lists
- Full JSDoc type documentation
