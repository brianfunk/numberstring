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

Transform any number into beautiful words. From `42` to `"forty-two"`, from `1000000` to `"one million"`. Supports **8 languages**, ordinals, currency, Roman numerals, and more!

## Why numberstring?

- **Zero dependencies** - Lightweight and fast
- **9 languages** - English, Spanish, French, German, Danish, Chinese, Hindi, Russian, Portuguese
- **Huge range** - Supports 0 to decillions (10^36) with BigInt
- **Feature-rich** - Ordinals, decimals, currency, fractions, years, phone numbers
- **Roman numerals** - Convert to and from Roman numerals
- **Well tested** - 216 tests with 90%+ coverage
- **Modern ES modules** - Tree-shakeable, TypeScript-friendly

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
numberstring(123, { cap: 'title' }); // 'One Hundred Twenty-Three'
```

## API Reference

### Core Functions

#### `numberstring(n, [options])`

Convert a number to English words.

```javascript
numberstring(42);                    // 'forty-two'
numberstring(100, { cap: 'title' }); // 'One Hundred'
numberstring(100, { punc: '!' });    // 'one hundred!'
```

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

Convert to Roman numerals.

```javascript
import { roman } from 'numberstring';

roman(42);                   // 'XLII'
roman(1999);                 // 'MCMXCIX'
roman(4, { lower: true });   // 'iv'
```

#### `parse(str)`

Parse English words back to a number.

```javascript
import { parse } from 'numberstring';

parse('forty-two');        // 42
parse('one thousand');     // 1000
parse('one quintillion');  // 1000000000000000000n (BigInt)
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

telephone('555-1234');  // 'five five five one two three four'
telephone(8675309);     // 'eight six seven five three zero nine'
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

numberstring supports 9 languages! Each language is in a separate file for easy tree-shaking.

```javascript
import { toWords, spanish, french, german, danish, chinese, hindi, russian, portuguese } from 'numberstring';

// Using toWords with lang option
toWords(42, { lang: 'es' });  // 'cuarenta y dos'
toWords(42, { lang: 'fr' });  // 'quarante-deux'
toWords(42, { lang: 'de' });  // 'zweiundvierzig'
toWords(42, { lang: 'da' });  // 'toogfyrre'
toWords(42, { lang: 'zh' });  // '四十二'
toWords(42, { lang: 'hi' });  // 'बयालीस'
toWords(42, { lang: 'ru' });  // 'сорок два'
toWords(42, { lang: 'pt' });  // 'quarenta e dois'

// Or use language functions directly
spanish(1000);    // 'mil'
french(80);       // 'quatre-vingts'
german(21);       // 'einundzwanzig'
chinese(10000);   // '一万'
russian(2000);    // 'две тысячи'
portuguese(100);  // 'cem'
```

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
| `lang` | `string` | Language code for `toWords()` |
| `point` | `string` | Word for decimal point (default: `'point'`) |
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

## REST API Server

numberstring includes a ready-to-use REST API server!

```bash
cd server
npm install
npm start
# Server running at http://localhost:3456
```

### Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /convert/:n` | Number to words | `/convert/42` → `"forty-two"` |
| `GET /convert/:n?lang=es` | Multi-language | `/convert/42?lang=es` → `"cuarenta y dos"` |
| `GET /ordinal/:n` | Ordinal words | `/ordinal/3` → `"third"` |
| `GET /decimal/:n` | Decimal words | `/decimal/3.14` → `"three point one four"` |
| `GET /currency/:amt` | Currency words | `/currency/$99.99` → `"ninety-nine dollars..."` |
| `GET /roman/:n` | Roman numerals | `/roman/2024` → `"MMXXIV"` |
| `GET /parse/:words` | Words to number | `/parse/forty-two` → `42` |
| `GET /comma/:n` | Format with commas | `/comma/1000000` → `"1,000,000"` |
| `GET /languages` | List languages | Returns supported language codes |

### Example

```bash
curl http://localhost:3456/convert/1000000000000000
# {"input":"1000000000000000","output":"one quadrillion","lang":"en"}

curl "http://localhost:3456/convert/42?lang=fr"
# {"input":"42","output":"quarante-deux","lang":"fr"}
```

## Development

```bash
npm install        # Install dependencies
npm test           # Run tests
npm run lint       # Run linter
npm run test:coverage  # Test with coverage
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
