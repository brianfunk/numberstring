# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-10-06

### Added

- **Casing styles** - `cap` now also accepts `sentence`, `camel`, `pascal`, `snake`, `kebab` (alias `hyphen`), `constant` (alias `screaming`), and `dot`: `numberstring(123, { cap: 'snake' })` → `one_hundred_twenty_three`. Exported as `CAP_STYLES`.
- **British `and` option** - `numberstring(123, { and: true })` → "one hundred and twenty-three", `numberstring(1001, { and: true })` → "one thousand and one". Also honored by `ordinal()`.
- **`nth(n)`** - Numeric ordinal suffix: `1st`, `22nd`, `113th`.
- **`compact(n, opt)`** - `1.5K`, `2.3B`, `1Sx`, with `digits` and `long` ("1.5 million") options.
- **`fancy(n, style)`** - Digits in Unicode styles: circled ④②, superscript ⁴², subscript, fullwidth, bold, doublestruck 𝟜𝟚, sans, monospace, keycap 4️⃣2️⃣, braille ⠼⠙⠃.
- **Alternative numeral systems** in `numerals.js`: `egyptian()` hieroglyphs (to 9,999,999), `babylonian()` base-60 cuneiform, `greek()` Ionic letters (to 9999). Mayan numerals and tally marks were tried and dropped: no system font on macOS.
- **Financial numerals** - `chinese(n, { formal: true })` → 壹仟零壹 (大写), `japanese(n, { formal: true })` → 壱千壱 (大字). Also via `toWords(n, { lang: 'zh', formal: true })`.
- **`nato(n)`** (aliases `icao`, `military`) - ICAO radiotelephony numerals: `1984` → "wun niner ait fower", `2500` → "too tousand fife hundred", `121.5` → "wun too wun decimal fife".
- **`morse(n)`** - International Morse code digits.
- `telephone(n, { oh: true })` says "oh" for zero.
- **`scientific(n)`** - Exact-mantissa scientific notation: `1984` → "1.984 × 10³", with `caret`, `e`, and `words` formats and a `digits` option.
- **`binary()`, `octal()`, `hex()`, `radix(n, base)`** - Other bases with `prefix`, `upper`, `pad` options.
- **`bytes(n)`** and **`bits(n)`** - `1.5 KB`, `1.5 KiB`, `1.5 Mb`, or "one point five kilobytes".
- **`clock(time)`** - Clock-face emoji for an hour or `H:MM`.
- `fancy()` accepts `emoji` as an alias for `keycap`, and a `clock` style that turns each digit into a clock face (814 → 🕗🕐🕓).
- `roman()` now supports vinculum notation above 3999 (a bar multiplies by 1000, two bars by a million), up to 3,999,999,999.
- Open Graph and Twitter card tags on the playground, with a PNG preview image (`site/og.png`, rendered from `site/og.svg`).
- `comma()` keeps decimals (`1,234,567.89`) and accepts numeric strings.
- Fuzz test (`test/fuzz.test.js`) proves every public function returns a value, never throws, for hostile inputs and options.
- `year()` accepts years beyond 9999 (read as cardinals) and BigInt.
- `bahasa` accepted as an alias for Indonesian.

### Fixed

- Playground: ASCII art header restored to the exact index.js block and no longer skewed by per-line centering; a malformed URL hash no longer breaks the page.
- Type declarations: per-language converters no longer advertise a `cap` option they ignore (use `toWords()` for that); Spanish and Portuguese keep it, Chinese and Japanese gain `formal`.

### Changed

- Still zero runtime dependencies.

## [1.1.0] - 2026-10-02

### Added

- **Forgiving default export** - `numberstring()` now accepts negatives, decimals, numeric strings, and a `lang` option, delegating to `negative()`, `decimal()`, and `toWords()`. Invalid input still returns `false`.
- **Playground** - Static site in `site/` deployed to Netlify. Type a number, see it in 22 languages plus ordinal, Roman, year, currency, and more.
- **Per-language spot-check tests** - `test/languages.test.js` locks in tricky numbers (21, 71, 80, 91, 100, 101, 1000, 1001, 2000, 21000, 1M, 2M, 21M) for all 22 languages.
- **TypeScript declarations** - `index.d.ts` covering the default export, every helper, options, and the language functions.
- Numbers above `Number.MAX_SAFE_INTEGER` (e.g. `1e21`) are widened to BigInt and converted instead of returning `false`.
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
