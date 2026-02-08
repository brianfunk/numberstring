# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-01

### Breaking Changes

- **Node.js 18+ required** - Dropped support for older Node.js versions
- **ESM only** - Package now uses ES modules (`import`/`export`). Use `import numberstring from 'numberstring'` instead of `require('numberstring')`
- **Quadrillion bug fix** - Numbers ≥10^15 now correctly output "quadrillion" instead of skipping directly to "quintillion". This changes output for numbers in the quadrillion range.

### Added

- **9 Language Support** - English, Spanish, French, German, Danish, Chinese, Hindi, Russian, Portuguese
  - Modular language files in `languages/` folder for easy community contributions
  - `toWords(n, { lang: 'es' })` for multi-language conversion
- **New Functions**
  - `ordinal(n)` - Convert to ordinal words (first, second, twenty-first)
  - `decimal(n)` - Convert decimals (3.14 → "three point one four")
  - `currency(amount)` - Currency to words ($123.45 → "one hundred twenty-three dollars...")
  - `roman(n)` - Convert to Roman numerals (42 → "XLII")
  - `parse(str)` - Parse words back to numbers ("forty-two" → 42)
  - `negative(n)` - Handle negative numbers
  - `fraction(num, denom)` - Convert fractions (1/2 → "one half")
  - `year(y)` - Year formatting (1984 → "nineteen eighty-four")
  - `telephone(phone)` - Phone numbers to words
  - `percent(pct)` - Percentages to words
- **BigInt support** - Handle numbers up to decillions (10^36)!
- Full JSDoc documentation with TypeScript-compatible types
- GitHub Actions CI (replaces Travis CI)
- Vitest test framework with 174 tests
- ESLint 9 with flat config
- PR and issue templates

### Fixed

- Added missing "quadrillion" to number scale (was skipping from trillion to quintillion)
- `punc()` no longer crashes when passed `null` or `undefined`
- Fixed `ordinal()` function - now uses word replacement instead of broken string slicing

### Changed

- Complete ES2022+ rewrite (const/let, arrow functions, template literals)
- Migrated from Mocha/Chai to Vitest
- Updated all development dependencies

### Removed

- Travis CI configuration
- CodeClimate, Codacy, and BitHound integrations
- codecov.yml
- npm-shrinkwrap.json
- CommonJS support (`require()`)

## [0.2.0] - 2016

- Initial public release
