# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-02

### Added

- **Forgiving default export** - `numberstring()` now accepts negatives, decimals, numeric strings, and a `lang` option, delegating to `negative()`, `decimal()`, and `toWords()`. Invalid input still returns `false`.
- **Playground** - Static site in `site/` deployed to Netlify. Type a number, see it in 22 languages plus ordinal, Roman, year, currency, and more.
- **Per-language spot-check tests** - `test/languages.test.js` locks in tricky numbers (21, 71, 80, 91, 100, 101, 1000, 1001, 2000, 21000, 1M, 2M, 21M) for all 22 languages.
- **TypeScript declarations** - `index.d.ts` covering the default export, every helper, options, and the language functions.
- Numbers above `Number.MAX_SAFE_INTEGER` (e.g. `1e21`) are widened to BigInt and converted instead of returning `false`.
- Open Graph and Twitter card tags on the playground.
- `npm run site` and `npm run site:build` scripts.

### Fixed

- Spanish: `100` is now `cien` (was `ciento`); `uno` apocopates before scale words (`un millón`, `veintiún mil`, `ciento un millones`).
- French: `million`/`milliard` pluralize (`deux millions`); `cents` and `quatre-vingts` drop the `s` before `mille` (`deux cent mille`).
- Italian: `-uno` elides before `mila` (`ventunmila`).
- Japanese: `一千` is kept after a higher scale word (`二万一千`, was `二万千`).
- Icelandic: gender agreement for 1–4 before `hundrað`/`þúsund` (neuter: `tvö þúsund`), `milljón` (feminine: `ein milljón`, `tvær milljónir`), and singular after numbers ending in 1 (`tuttugu og ein milljón`).
- `decimal(1e21)` returned `"one"`; exponent-form integers are now expanded, exponent-form fractions return `false`.
- `decimal()` kept only 15 digits of precision for long integer parts in strings.
- `parse('nineteen eighty-four')` returned `103`; adjacent simple words other than tens + ones now return `false`.

### Changed

- The Express REST server moved to `archive/server/` and is no longer tested, linted, or maintained. The playground supersedes it.
- Removed `express` and `supertest` from devDependencies.

## [1.0.1] - 2026-02-08

### Added

- **13 New Languages** - Japanese (`ja`), Korean (`ko`), Arabic (`ar`), Italian (`it`), Dutch (`nl`), Turkish (`tr`), Polish (`pl`), Swedish (`sv`), Indonesian (`id`), Thai (`th`), Norwegian (`no`), Finnish (`fi`), Icelandic (`is`)
  - Total language support now at 22 languages
  - Full Scandinavian coverage: Danish, Swedish, Norwegian, Finnish, Icelandic
  - All new languages support BigInt up to 10^36
- 49 new tests for all new languages (265 total)

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
