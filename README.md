[![numberstring](https://img.shields.io/badge/numberstring-%23%20%22%20%22-brightgreen.svg)](https://github.com/brianfunk/numberstring)
[![npm version](https://img.shields.io/npm/v/numberstring.svg)](https://www.npmjs.com/package/numberstring)
[![npm downloads](https://img.shields.io/npm/dm/numberstring.svg)](https://www.npmjs.com/package/numberstring)
[![CI](https://github.com/brianfunk/numberstring/actions/workflows/ci.yml/badge.svg)](https://github.com/brianfunk/numberstring/actions/workflows/ci.yml)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)
[![Semver](https://img.shields.io/badge/SemVer-2.0-blue.svg)](http://semver.org/spec/v2.0.0.html)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![LinkedIn](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/brianrandyfunk)

# numberstring

> Number One Way to Makes Words from Numbers

Transform any number into beautiful words. From `42` to `"forty-two"`, from `1000000` to `"one million"`. Supports **22 languages**, ordinals, currency, Roman numerals, Egyptian hieroglyphs, Babylonian cuneiform, circled digits, and more!

**Try it:** [numberstring.netlify.app](https://numberstring.netlify.app) — type a number, see it in 22 languages. Runs entirely in your browser.

## Why numberstring?

- **Zero dependencies** - Lightweight and fast
- **22 languages** - English, Spanish, French, German, Danish, Chinese, Hindi, Russian, Portuguese, Japanese, Korean, Arabic, Italian, Dutch, Turkish, Polish, Swedish, Indonesian, Thai, Norwegian, Finnish, Icelandic
- **Huge range** - Supports 0 to decillions (10^36) with BigInt
- **Feature-rich** - Ordinals, decimals, currency, fractions, years, phone numbers, NATO/ICAO radio numerals, Morse code
- **Roman numerals** - Classic and vinculum notation to 3,999,999,999
- **Ancient and alternative numerals** - Egyptian hieroglyphs, Babylonian cuneiform, Greek letters, Chinese/Japanese financial forms
- **Unicode digit styles** - ④② ⁴² ４２ 𝟜𝟚 4️⃣2️⃣ ⠼⠙⠃
- **Forgiving input** - Integers, negatives, decimals, numeric strings, BigInt. It just works
- **Well tested** - 700+ tests with 90%+ coverage, including per-language spot checks
- **Modern ES modules** - Tree-shakeable, with bundled TypeScript declarations

## Installation

```bash
npm install numberstring
```

## Quick Start

```javascript
import numberstring from 'numberstring';

numberstring(42);                    // 'forty-two'
numberstring(1000000);               // 'one million'
numberstring(10n ** 18n);            // 'one quintillion' (BigInt!)
numberstring(-3.14);                 // 'negative three point one four'
numberstring('1000');                // 'one thousand'
numberstring(42, { lang: 'es' });    // 'cuarenta y dos'
numberstring(123, { and: true });    // 'one hundred and twenty-three'
numberstring(123, { cap: 'title' }); // 'One Hundred Twenty-Three'
```

## API Reference

### Core Functions

#### `numberstring(n, [options])`

Convert a number to words. Forgiving by design: accepts integers, negatives, decimals, numeric strings, and BigInt, and honors `lang`. Returns `false` for anything it cannot say.

```javascript
numberstring(42);                    // 'forty-two'
numberstring(-7);                    // 'negative seven'
numberstring(2.5);                   // 'two point five'
numberstring('1000000');             // 'one million'
numberstring(42, { lang: 'fr' });    // 'quarante-deux'
numberstring(100, { cap: 'title' }); // 'One Hundred'
numberstring(100, { punc: '!' });    // 'one hundred!'
numberstring('abc');                 // false
```

Negatives and decimals are English-only; with another `lang` they return `false` rather than falling back to English. Pass `and: true` for British style ("one hundred and one", "one thousand and one").

#### `ordinal(n, [options])`

Convert to ordinal words (first, second, etc.).

```javascript
import { ordinal } from 'numberstring';

ordinal(1);   // 'first'
ordinal(2);   // 'second'
ordinal(21);  // 'twenty-first'
ordinal(100); // 'one hundredth'
```

#### `decimal(n, [options])`

Convert decimal numbers to words.

```javascript
import { decimal } from 'numberstring';

decimal(3.14);   // 'three point one four'
decimal(0.5);    // 'zero point five'
decimal(-3.14);  // 'negative three point one four'
```

#### `currency(amount, [options])`

Convert currency amounts to words.

```javascript
import { currency } from 'numberstring';

currency('$123.45');  // 'one hundred twenty-three dollars and forty-five cents'
currency('€50');      // 'fifty euros'
currency('£1.01');    // 'one pound and one penny'
currency('¥1000');    // 'one thousand yen'
currency('₹100.50');  // 'one hundred rupees and fifty paise'
```

Supported currencies: `$` `€` `£` `¥` `₹` `元` (USD, EUR, GBP, JPY, INR, CNY)

#### `roman(n, [options])`

Convert to Roman numerals. Above 3999, vinculum notation puts a bar over a group to multiply it by 1000 (two bars for a million), reaching 3,999,999,999.

```javascript
import { roman } from 'numberstring';

roman(42);                   // 'XLII'
roman(1999);                 // 'MCMXCIX'
roman(4, { lower: true });   // 'iv'
roman(4000);                 // 'I̅V̅'
roman(8675309);              // 'V̿I̿I̿I̿D̅C̅L̅X̅X̅V̅CCCIX'
```

#### `parse(str)`

Parse English words back to a number.

```javascript
import { parse } from 'numberstring';

parse('forty-two');        // 42
parse('one thousand');     // 1000
parse('one quintillion');  // 1000000000000000000n (BigInt)
```

#### `nth(n)`

Numeric ordinal suffix.

```javascript
import { nth } from 'numberstring';

nth(1);    // '1st'
nth(22);   // '22nd'
nth(113);  // '113th'
```

#### `compact(n, [options])`

Compact notation.

```javascript
import { compact } from 'numberstring';

compact(1500);                     // '1.5K'
compact(2300000000);               // '2.3B'
compact(999950);                   // '1M'
compact(1234567, { digits: 2 });   // '1.23M'
compact(1500000, { long: true });  // '1.5 million'
```

#### `fancy(n, [style])`

Digits in a Unicode style: `circled` (default), `superscript`, `subscript`, `fullwidth`, `bold`, `doublestruck`, `sans`, `monospace`, `keycap`, `braille`.

```javascript
import { fancy } from 'numberstring';

fancy(42);                   // '④②'
fancy(42, 'superscript');    // '⁴²'
fancy(42, 'doublestruck');   // '𝟜𝟚'
fancy(42, 'keycap');         // '4️⃣2️⃣'
fancy(-3.5, 'braille');      // '⠼⠤⠉⠨⠑'
```

### Ancient and Alternative Numerals

All render with Unicode glyphs, so they need a font that covers the block (most modern systems do).

```javascript
import { egyptian, babylonian, greek } from 'numberstring';

egyptian(42);     // '𓎆𓎆𓎆𓎆𓏺𓏺'       additive, 1 to 9,999,999
babylonian(42);   // '𒌋𒌋𒌋𒌋𒐕𒐕'       base 60, places separated by spaces
babylonian(3600); // '𒐕 𒑊 𒑊'
greek(42);        // 'μβʹ'             Ionic letters, 1 to 9999
greek(1999);      // '͵αϡϟθʹ'
```

Chinese and Japanese also have the anti-fraud financial forms used on cheques:

```javascript
import { chinese, japanese } from 'numberstring';

chinese(1001, { formal: true });   // '壹仟零壹'  (大写)
japanese(1001, { formal: true });  // '壱千壱'    (大字)
```

### Utility Functions

#### `negative(n, [options])`

Handle negative numbers.

```javascript
import { negative } from 'numberstring';

negative(-42);  // 'negative forty-two'
negative(42);   // 'forty-two'
```

#### `fraction(numerator, denominator, [options])`

Convert fractions to words.

```javascript
import { fraction } from 'numberstring';

fraction(1, 2);  // 'one half'
fraction(3, 4);  // 'three quarters'
fraction(5, 8);  // 'five eighths'
```

#### `year(y, [options])`

Convert years to spoken form.

```javascript
import { year } from 'numberstring';

year(1984);  // 'nineteen eighty-four'
year(2000);  // 'two thousand'
year(2024);  // 'twenty twenty-four'
```

#### `telephone(phone, [options])`

Convert phone numbers to words.

```javascript
import { telephone } from 'numberstring';

telephone('555-1234');              // 'five five five one two three four'
telephone(8675309);                 // 'eight six seven five three zero nine'
telephone(8675309, { oh: true });   // 'eight six seven five three oh nine'
```

#### `nato(n, [options])`

ICAO / NATO radiotelephony numerals, the way pilots and air traffic control read numbers. Also exported as `icao` and `military`.

```javascript
import { nato } from 'numberstring';

nato(1984);                   // 'wun niner ait fower'
nato(2500);                   // 'too tousand fife hundred'
nato('121.5');                // 'wun too wun decimal fife'
nato(2500, { digits: true }); // 'too fife zero zero'
```

#### `morse(n)`

International Morse code for the digits.

```javascript
import { morse } from 'numberstring';

morse(42);   // '....- ..---'
morse(3.1);  // '...-- .-.-.- .----'
```

#### `percent(pct, [options])`

Convert percentages to words.

```javascript
import { percent } from 'numberstring';

percent(50);     // 'fifty percent'
percent('25%');  // 'twenty-five percent'
percent(3.5);    // 'three point five percent'
```

#### `comma(n)`

Format a number with comma separators.

```javascript
import { comma } from 'numberstring';

comma(1234567);  // '1,234,567'
```

## Multi-Language Support

numberstring supports 22 languages! Each language is in a separate file for easy tree-shaking.

```javascript
import { toWords } from 'numberstring';

// Using toWords with lang option
toWords(42, { lang: 'es' });  // 'cuarenta y dos'
toWords(42, { lang: 'fr' });  // 'quarante-deux'
toWords(42, { lang: 'de' });  // 'zweiundvierzig'
toWords(42, { lang: 'da' });  // 'toogfyrre'
toWords(42, { lang: 'zh' });  // '四十二'
toWords(42, { lang: 'hi' });  // 'बयालीस'
toWords(42, { lang: 'ru' });  // 'сорок два'
toWords(42, { lang: 'pt' });  // 'quarenta e dois'
toWords(42, { lang: 'ja' });  // '四十二'
toWords(42, { lang: 'ko' });  // '사십이'
toWords(42, { lang: 'ar' });  // 'اثنان وأربعون'
toWords(42, { lang: 'it' });  // 'quarantadue'
toWords(42, { lang: 'nl' });  // 'tweeënveertig'
toWords(42, { lang: 'tr' });  // 'kırk iki'
toWords(42, { lang: 'pl' });  // 'czterdzieści dwa'
toWords(42, { lang: 'sv' });  // 'fyrtiotvå'
toWords(42, { lang: 'id' });  // 'empat puluh dua'
toWords(42, { lang: 'th' });  // 'สี่สิบสอง'
toWords(42, { lang: 'no' });  // 'førtito'
toWords(42, { lang: 'fi' });  // 'neljäkymmentäkaksi'
toWords(42, { lang: 'is' });  // 'fjörutíu og tveir'
```

### Supported Languages

| Code | Language | Example (42) |
|------|----------|-------------|
| `en` | English | forty-two |
| `es` | Spanish | cuarenta y dos |
| `fr` | French | quarante-deux |
| `de` | German | zweiundvierzig |
| `da` | Danish | toogfyrre |
| `zh` | Chinese | 四十二 |
| `hi` | Hindi | बयालीस |
| `ru` | Russian | сорок два |
| `pt` | Portuguese | quarenta e dois |
| `ja` | Japanese | 四十二 |
| `ko` | Korean | 사십이 |
| `ar` | Arabic | اثنان وأربعون |
| `it` | Italian | quarantadue |
| `nl` | Dutch | tweeënveertig |
| `tr` | Turkish | kırk iki |
| `pl` | Polish | czterdzieści dwa |
| `sv` | Swedish | fyrtiotvå |
| `id` | Indonesian | empat puluh dua |
| `th` | Thai | สี่สิบสอง |
| `no` | Norwegian | førtito |
| `fi` | Finnish | neljäkymmentäkaksi |
| `is` | Icelandic | fjörutíu og tveir |

### Adding a New Language

Languages are modular! To add a new language:

1. Create `languages/xx.js` following the pattern in `languages/en.js`
2. Export your conversion function
3. Add to `languages/index.js`
4. Submit a PR!

## Options

| Option | Type | Description |
|--------|------|-------------|
| `cap` | `string` | Capitalization: `'title'`, `'upper'`, or `'lower'` |
| `punc` | `string` | Punctuation: `'!'`, `'?'`, or `'.'` |
| `lang` | `string` | Language code for `numberstring()` and `toWords()` |
| `point` | `string` | Word for decimal point (default: `'point'`) |
| `and` | `boolean` | British style: `one hundred and one` |
| `formal` | `boolean` | Chinese/Japanese financial numerals |
| `lower` | `boolean` | Lowercase Roman numerals |

## Supported Scales

| Scale | Power | Example |
|-------|-------|---------|
| Ones | 10^0 | `five` |
| Thousands | 10^3 | `five thousand` |
| Millions | 10^6 | `five million` |
| Billions | 10^9 | `five billion` |
| Trillions | 10^12 | `five trillion` |
| Quadrillions | 10^15 | `five quadrillion` |
| **Quintillions** | 10^18 | `five quintillion` *(BigInt)* |
| **Sextillions** | 10^21 | `five sextillion` *(BigInt)* |
| **Septillions** | 10^24 | `five septillion` *(BigInt)* |
| **Octillions** | 10^27 | `five octillion` *(BigInt)* |
| **Nonillions** | 10^30 | `five nonillion` *(BigInt)* |
| **Decillions** | 10^33 | `five decillion` *(BigInt)* |

## Playground

The playground at [numberstring.netlify.app](https://numberstring.netlify.app) is a single static page in `site/` that imports the library directly. No framework, no backend.

```bash
npm run site     # stage the library into site/lib and serve at http://localhost:8080
```

The former Express REST server lives in `archive/server/`, unmaintained.

## Development

```bash
npm install        # Install dependencies
npm test           # Run tests
npm run lint       # Run linter
npm run test:coverage  # Test with coverage
npm run site           # Run the playground locally
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process for submitting pull requests.

We especially welcome contributions for new languages! See the Contributing guide for details.

## Versioning

This project uses [Semantic Versioning 2.0](http://semver.org/spec/v2.0.0.html).

## Requirements

- Node.js 18+
- ES modules (`import`/`export`)

## License

MIT

### # " "
