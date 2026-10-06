/*
                                   /##                                       /""               /""
                                  | ##                                      | ""              |__/
 /#######  /##   /## /######/#### | #######   /######   /######   /""""""" /""""""    /""""""  /"" /"""""""   /""""""
| ##__  ##| ##  | ##| ##_  ##_  ##| ##__  ## /##__  ## /##__  ## /""_____/|_  ""_/   /""__  ""| ""| ""__  "" /""__  ""
| ##  \ ##| ##  | ##| ## \ ## \ ##| ##  \ ##| ########| ##  \__/|  """"""   | ""    | ""  \__/| ""| ""  \ ""| ""  \ ""
| ##  | ##| ##  | ##| ## | ## | ##| ##  | ##| ##_____/| ##       \____  ""  | "" /""| ""      | ""| ""  | ""| ""  | ""
| ##  | ##|  ######/| ## | ## | ##| #######/|  #######| ##       /"""""""/  |  """"/| ""      | ""| ""  | ""|  """""""
|__/  |__/ \______/ |__/ |__/ |__/|_______/  \_______/|__/      |_______/    \___/  |__/      |__/|__/  |__/ \____  ""
                                                                                                             /""  \ ""
                                                                                                            |  """"""/
                                                                                                             \______/
*/

/**
 * numberstring - Convert numbers to their word representation
 * Supports 22 languages including English, Spanish, French, German, Danish, Chinese, Hindi, Russian, Portuguese, Japanese, Korean, Arabic, Italian, Dutch, Turkish, Polish, Swedish, Indonesian, Thai, Norwegian, Finnish, and Icelandic
 * @module numberstring
 */

// Import language functions
import { english, spanish, french, german, danish, chinese, hindi, russian, portuguese, japanese, korean, arabic, italian, dutch, turkish, polish, swedish, indonesian, thai, norwegian, finnish, icelandic, LANGUAGES } from './languages/index.js';

import { fancy, FANCY_STYLE_NAMES, egyptian, babylonian, mayan, greek, tally } from './numerals.js';

// Re-export language functions and alternative numeral systems
export { spanish, french, german, danish, chinese, hindi, russian, portuguese, japanese, korean, arabic, italian, dutch, turkish, polish, swedish, indonesian, thai, norwegian, finnish, icelandic };
export { fancy, FANCY_STYLE_NAMES, egyptian, babylonian, mayan, greek, tally };

// ============================================================================
// CONSTANTS
// ============================================================================

const ONES = Object.freeze(['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']);
const TENS = Object.freeze(['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']);
const TEENS = Object.freeze(['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']);
const ILLIONS = Object.freeze(['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion']);

// Ordinal words
const ORDINAL_ONES = Object.freeze(['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']);
const ORDINAL_TEENS = Object.freeze(['tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth']);
const ORDINAL_TENS = Object.freeze(['', '', 'twentieth', 'thirtieth', 'fortieth', 'fiftieth', 'sixtieth', 'seventieth', 'eightieth', 'ninetieth']);

// Currency configurations
const CURRENCIES = Object.freeze({
  '$': { code: 'USD', main: 'dollar', sub: 'cent', subPer: 100 },
  'USD': { code: 'USD', main: 'dollar', sub: 'cent', subPer: 100 },
  '€': { code: 'EUR', main: 'euro', sub: 'cent', subPer: 100 },
  'EUR': { code: 'EUR', main: 'euro', sub: 'cent', subPer: 100 },
  '£': { code: 'GBP', main: 'pound', sub: 'penny', subPlural: 'pence', subPer: 100 },
  'GBP': { code: 'GBP', main: 'pound', sub: 'penny', subPlural: 'pence', subPer: 100 },
  '¥': { code: 'JPY', main: 'yen', sub: null, subPer: 1 },
  'JPY': { code: 'JPY', main: 'yen', sub: null, subPer: 1 },
  '₹': { code: 'INR', main: 'rupee', sub: 'paisa', subPlural: 'paise', subPer: 100 },
  'INR': { code: 'INR', main: 'rupee', sub: 'paisa', subPlural: 'paise', subPer: 100 },
  '元': { code: 'CNY', main: 'yuan', sub: 'fen', subPer: 100 },
  'CNY': { code: 'CNY', main: 'yuan', sub: 'fen', subPer: 100 }
});

// Roman numeral mappings
const ROMAN_VALUES = Object.freeze([
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
]);

// Word to number mappings (for parse function)
const WORD_VALUES = Object.freeze({
  'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
  'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
  'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
});

const SCALE_VALUES = Object.freeze({
  'hundred': 100,
  'thousand': 1000,
  'million': 1000000,
  'billion': 1000000000,
  'trillion': 1000000000000,
  'quadrillion': 1000000000000000n,
  'quintillion': 1000000000000000000n,
  'sextillion': 1000000000000000000000n,
  'septillion': 1000000000000000000000000n,
  'octillion': 1000000000000000000000000000n,
  'nonillion': 1000000000000000000000000000000n,
  'decillion': 1000000000000000000000000000000000n
});

/** Maximum supported value (10^36 - 1, up to decillions) */
const MAX_VALUE = 10n ** 36n - 1n;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const hundred = (n) => {
  if (n < 100 || n >= 1000) return '';
  return `${ONES[Math.floor(n / 100)]} hundred `;
};

const ten = (n) => {
  if (n === 0) return '';
  if (n < 10) return `${ONES[n]} `;
  if (n < 20) return `${TEENS[n - 10]} `;
  const onesDigit = n % 10;
  if (onesDigit) return `${TENS[Math.floor(n / 10)]}-${ONES[onesDigit]} `;
  return `${TENS[Math.floor(n / 10)]} `;
};

const cap = (str, style) => {
  switch (style) {
    case 'title':
      return str.replace(/\w([^-\s]*)/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    case 'upper':
      return str.toUpperCase();
    case 'lower':
      return str.toLowerCase();
    default:
      return str;
  }
};

const punc = (str, p) => {
  if (p == null) return str;
  if (/[!?.]/.test(p)) return str + p;
  return str;
};

const comma = (n) => {
  if (typeof n === 'bigint') {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  if (isNaN(n)) return false;
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// ============================================================================
// MAIN CONVERSION FUNCTION
// ============================================================================

/**
 * Convert a non-negative integer (number or BigInt) to English words.
 * Internal: the public `string()` normalizes input and delegates here.
 * @param {number|bigint} n - The number to convert (0 to 10^36-1)
 * @param {Object} [opt] - Options object
 * @param {boolean} [opt.and] - British "and" after hundreds / before a final group under 100
 * @returns {string|false} The word representation or false if invalid
 */
const cardinal = (n, opt) => {
  let num;

  if (typeof n === 'bigint') {
    if (n < 0n || n > MAX_VALUE) return false;
    num = n;
  } else if (typeof n === 'number') {
    if (isNaN(n) || n < 0 || !Number.isInteger(n)) return false;
    if (n > Number.MAX_SAFE_INTEGER) return false;
    num = BigInt(n);
  } else {
    return false;
  }

  let s = '';

  const useAnd = opt?.and === true;

  if (num === 0n) {
    s = 'zero';
  } else {
    for (let i = group(num); i >= 0; i--) {
      const h = hundment(num, i);
      if (h === 0) continue;
      const t = tenment(num, i);
      s += hundred(h);
      // British style: "one hundred and one", "one thousand and one"
      if (useAnd && t > 0 && (h >= 100 || (i === 0 && s))) s += 'and ';
      s += ten(t);
      s += `${ILLIONS[i]} `;
    }
  }

  s = s.trim();

  if (opt) {
    if (opt.cap) s = cap(s, opt.cap);
    if (opt.punc !== undefined) s = punc(s, opt.punc);
  }

  return s;
};

/**
 * Convert a number to its word representation.
 *
 * Forgiving by design: accepts integers, negatives, decimals, numeric strings,
 * and BigInt, and honors `opt.lang` for any of the 22 supported languages.
 * Invalid input returns `false`.
 *
 * @param {number|bigint|string} n - The number to convert
 * @param {Object} [opt] - Options object
 * @param {string} [opt.cap] - Capitalization: 'title', 'upper', or 'lower'
 * @param {string} [opt.punc] - Punctuation: '!', '?', or '.'
 * @param {string} [opt.lang] - Language code (default 'en')
 * @param {string} [opt.point] - Word for the decimal point (default 'point')
 * @param {boolean} [opt.and] - British style: 'one hundred and twenty-three'
 * @returns {string|false} The word representation or false if invalid
 *
 * @example
 * numberstring(42)                  // 'forty-two'
 * numberstring(123, { and: true })  // 'one hundred and twenty-three'
 * numberstring(-5)                  // 'negative five'
 * numberstring(3.14)                // 'three point one four'
 * numberstring('1000')              // 'one thousand'
 * numberstring(42, { lang: 'es' })  // 'cuarenta y dos'
 */
const string = (n, opt) => {
  let value = n;
  // Delegates apply `cap` themselves; `punc` is applied once in finish()
  const inner = opt ? { ...opt, punc: undefined } : opt;
  const lang = opt?.lang?.toLowerCase();
  const foreign = Boolean(lang && LANGUAGES[lang] && LANGUAGES[lang] !== 'english');

  if (typeof value === 'string') {
    const str = value.trim();
    if (!/^-?\d+(\.\d+)?$/.test(str)) return false;
    // Other languages only cover non-negative integers; don't fall back to English
    if (str.includes('.')) return foreign ? false : finish(decimal(str, inner), opt);
    const digits = str.replace('-', '');
    value = digits.length <= 15 ? Number(str) : BigInt(str);
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return false;
    if (!Number.isInteger(value)) return foreign ? false : finish(decimal(value, inner), opt);
    // 1e21 is an integer too; widen to BigInt rather than rejecting it
    if (Math.abs(value) > Number.MAX_SAFE_INTEGER) value = BigInt(value);
  }

  if (typeof value === 'number') {
    if (value < 0) return foreign ? false : finish(negative(value, inner), opt);
  } else if (typeof value === 'bigint') {
    if (value < 0n) return foreign ? false : finish(negative(value, inner), opt);
  } else {
    return false;
  }

  if (foreign) return finish(toWords(value, inner), opt);
  return cardinal(value, opt);
};

/** Apply `punc` to a delegated result (helpers already apply `cap`). */
const finish = (result, opt) => {
  if (result === false) return false;
  if (opt?.punc !== undefined) return punc(result, opt.punc);
  return result;
};

// ============================================================================
// ORDINAL FUNCTION
// ============================================================================

const ordinal = (n, opt) => {
  let num;

  if (typeof n === 'bigint') {
    if (n <= 0n || n > MAX_VALUE) return false;
    num = Number(n);
    if (n > BigInt(Number.MAX_SAFE_INTEGER)) return false;
  } else if (typeof n === 'number') {
    if (isNaN(n) || n <= 0 || !Number.isInteger(n)) return false;
    if (n > Number.MAX_SAFE_INTEGER) return false;
    num = n;
  } else {
    return false;
  }

  let s;

  if (num <= 9) {
    s = ORDINAL_ONES[num];
  } else if (num <= 19) {
    s = ORDINAL_TEENS[num - 10];
  } else if (num <= 99) {
    const onesDigit = num % 10;
    const tensDigit = Math.floor(num / 10);
    if (onesDigit === 0) {
      s = ORDINAL_TENS[tensDigit];
    } else {
      s = `${TENS[tensDigit]}-${ORDINAL_ONES[onesDigit]}`;
    }
  } else {
    const base = cardinal(num, { and: opt?.and });
    if (!base) return false;

    const parts = base.split(' ');
    const lastPart = parts[parts.length - 1];
    const hyphenParts = lastPart.split('-');
    const lastWord = hyphenParts[hyphenParts.length - 1];

    const ordinalMap = {
      'one': 'first', 'two': 'second', 'three': 'third', 'four': 'fourth',
      'five': 'fifth', 'six': 'sixth', 'seven': 'seventh', 'eight': 'eighth',
      'nine': 'ninth', 'ten': 'tenth', 'eleven': 'eleventh', 'twelve': 'twelfth',
      'thirteen': 'thirteenth', 'fourteen': 'fourteenth', 'fifteen': 'fifteenth',
      'sixteen': 'sixteenth', 'seventeen': 'seventeenth', 'eighteen': 'eighteenth',
      'nineteen': 'nineteenth', 'twenty': 'twentieth', 'thirty': 'thirtieth',
      'forty': 'fortieth', 'fifty': 'fiftieth', 'sixty': 'sixtieth',
      'seventy': 'seventieth', 'eighty': 'eightieth', 'ninety': 'ninetieth',
      'hundred': 'hundredth', 'thousand': 'thousandth', 'million': 'millionth',
      'billion': 'billionth', 'trillion': 'trillionth', 'quadrillion': 'quadrillionth',
      'quintillion': 'quintillionth'
    };

    const ordinalWord = ordinalMap[lastWord] || (lastWord + 'th');

    if (hyphenParts.length > 1) {
      hyphenParts[hyphenParts.length - 1] = ordinalWord;
      parts[parts.length - 1] = hyphenParts.join('-');
    } else {
      parts[parts.length - 1] = ordinalWord;
    }

    s = parts.join(' ');
  }

  if (opt?.cap) s = cap(s, opt.cap);
  return s;
};

// ============================================================================
// DECIMAL FUNCTION
// ============================================================================

const decimal = (n, opt) => {
  let numStr;

  if (typeof n === 'number') {
    if (!Number.isFinite(n)) return false;
    numStr = n.toString();
    if (numStr.includes('e')) {
      if (!Number.isInteger(n)) return false;
      numStr = BigInt(n).toString();
    }
  } else if (typeof n === 'string') {
    numStr = n.trim();
    if (!/^-?\d+\.?\d*$/.test(numStr) && !/^-?\d*\.?\d+$/.test(numStr)) {
      return false;
    }
  } else {
    return false;
  }

  const isNegative = numStr.startsWith('-');
  if (isNegative) numStr = numStr.slice(1);

  const pointWord = opt?.point || 'point';
  const [intPart, decPart] = numStr.split('.');

  const intDigits = intPart || '0';
  const intNum = intDigits.length <= 15 ? parseInt(intDigits, 10) : BigInt(intDigits);
  const intWords = cardinal(intNum);
  if (intWords === false) return false;

  let result = isNegative ? 'negative ' : '';
  result += intWords;

  if (decPart) {
    result += ` ${pointWord}`;
    for (const digit of decPart) {
      const digitWord = digit === '0' ? 'zero' : ONES[parseInt(digit, 10)];
      result += ` ${digitWord}`;
    }
  }

  if (opt?.cap) result = cap(result, opt.cap);
  return result;
};

// ============================================================================
// CURRENCY FUNCTION
// ============================================================================

const currency = (amount, opt) => {
  let numStr = String(amount).trim();
  let currencyKey = opt?.currency;

  const symbolMatch = numStr.match(/^([$€£¥₹元])/);
  if (symbolMatch) {
    currencyKey = currencyKey || symbolMatch[1];
    numStr = numStr.slice(1).trim();
  }

  const codeMatch = numStr.match(/\s*(USD|EUR|GBP|JPY|INR|CNY)$/i);
  if (codeMatch) {
    currencyKey = currencyKey || codeMatch[1].toUpperCase();
    numStr = numStr.slice(0, -codeMatch[0].length).trim();
  }

  if (!currencyKey) return false;

  const currConfig = CURRENCIES[currencyKey];
  if (!currConfig) return false;

  const num = parseFloat(numStr);
  if (isNaN(num) || num < 0) return false;

  const mainUnits = Math.floor(num);
  const subUnits = Math.round((num - mainUnits) * currConfig.subPer);

  let result = '';

  if (mainUnits > 0 || (mainUnits === 0 && subUnits === 0)) {
    const mainWords = string(mainUnits);
    if (mainWords === false) return false;

    const noPlural = ['yen', 'yuan'];
    const mainName = mainUnits === 1 || noPlural.includes(currConfig.main)
      ? currConfig.main
      : currConfig.main + 's';
    result = `${mainWords} ${mainName}`;
  }

  if (subUnits > 0 && currConfig.sub) {
    const subWords = string(subUnits);
    if (subWords === false) return false;

    let subName;
    if (subUnits === 1) {
      subName = currConfig.sub;
    } else {
      subName = currConfig.subPlural || currConfig.sub + 's';
    }

    if (result) {
      result += ` and ${subWords} ${subName}`;
    } else {
      result = `${subWords} ${subName}`;
    }
  }

  if (opt?.cap) result = cap(result, opt.cap);
  return result;
};

// ============================================================================
// ROMAN NUMERAL FUNCTION
// ============================================================================

/** Classic Roman numerals for 1-3999 */
const romanBase = (n) => {
  let result = '';
  let remaining = n;
  for (const [value, numeral] of ROMAN_VALUES) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
};

/** Combining marks for vinculum notation: one bar = x1000, two bars = x1000000 */
const ROMAN_BARS = Object.freeze(['', '\u0305', '\u033F']);

/** Maximum value expressible with a double vinculum (3,999,999,999) */
const ROMAN_MAX = 3999999999;

/**
 * Convert to Roman numerals. Classic numerals cover 1-3999; above that,
 * vinculum notation places a bar over a group to multiply it by 1000, so
 * 4000 is I̅V̅ and 8675309 is V̿I̿I̿I̿D̅C̅L̅X̅X̅V̅CCCIX.
 * @param {number} n - Integer from 1 to 3,999,999,999
 * @param {Object} [opt] - Options object
 * @param {boolean} [opt.lower] - Return lowercase numerals
 * @returns {string|false} The Roman numeral or false if out of range
 */
const roman = (n, opt) => {
  if (typeof n !== 'number' || isNaN(n) || !Number.isInteger(n)) return false;
  if (n < 1 || n > ROMAN_MAX) return false;

  let result = '';
  let remaining = n;
  let level = 0;

  while (remaining > 0) {
    // The topmost group keeps the classic form up to 3999; lower groups are 0-999
    const groupValue = remaining < 4000 ? remaining : remaining % 1000;
    const bar = ROMAN_BARS[level];
    const letters = romanBase(groupValue);
    const barred = bar ? [...letters].map((ch) => ch + bar).join('') : letters;
    result = barred + result;
    remaining = (remaining - groupValue) / 1000;
    level++;
  }

  return opt?.lower ? result.toLowerCase() : result;
};

// ============================================================================
// PARSE FUNCTION (Reverse: words to number)
// ============================================================================

const parse = (str) => {
  if (typeof str !== 'string') return false;

  const normalized = str.toLowerCase().trim();
  if (normalized === 'zero') return 0;

  const words = normalized.split(/[\s-]+/).filter(w => w);
  if (words.length === 0) return false;

  let useBigInt = false;
  for (const word of words) {
    const scale = SCALE_VALUES[word];
    if (typeof scale === 'bigint') {
      useBigInt = true;
      break;
    }
  }

  let result = useBigInt ? 0n : 0;
  let current = useBigInt ? 0n : 0;
  let lastSimple = null;

  for (const word of words) {
    if (Object.hasOwn(WORD_VALUES, word)) {
      const val = WORD_VALUES[word];
      // Only "tens + ones" (twenty two) may follow a simple word directly;
      // "nineteen eighty" is a year, not a cardinal
      const tensThenOnes = lastSimple >= 20 && lastSimple % 10 === 0 && val >= 1 && val <= 9;
      if (lastSimple !== null && !tensThenOnes) return false;
      lastSimple = val;
      if (useBigInt) {
        current += BigInt(val);
      } else {
        current += val;
      }
    } else if (word === 'hundred') {
      lastSimple = null;
      if (useBigInt) {
        current *= 100n;
      } else {
        current *= 100;
      }
    } else if (Object.hasOwn(SCALE_VALUES, word)) {
      lastSimple = null;
      const scale = SCALE_VALUES[word];
      if (useBigInt) {
        const bigScale = typeof scale === 'bigint' ? scale : BigInt(scale);
        current *= bigScale;
        result += current;
        current = 0n;
      } else {
        current *= scale;
        result += current;
        current = 0;
      }
    } else if (word === 'and') {
      continue;
    } else {
      return false;
    }
  }

  result += current;
  return result;
};

// ============================================================================
// NTH (numeric ordinal suffix)
// ============================================================================

/**
 * Append the English ordinal suffix to a number: 1st, 2nd, 3rd, 4th, 11th, 112th.
 * @param {number|bigint|string} n - Integer (negatives keep their sign)
 * @returns {string|false}
 *
 * @example
 * nth(1)    // '1st'
 * nth(22)   // '22nd'
 * nth(113)  // '113th'
 */
const nth = (n) => {
  let value;
  if (typeof n === 'bigint') value = n;
  else if (typeof n === 'number' && Number.isInteger(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER) value = BigInt(n);
  else if (typeof n === 'string' && /^-?\d+$/.test(n.trim())) value = BigInt(n.trim());
  else return false;

  const abs = value < 0n ? -value : value;
  const mod100 = Number(abs % 100n);
  const mod10 = Number(abs % 10n);
  let suffix = 'th';
  if (mod100 < 11 || mod100 > 13) {
    if (mod10 === 1) suffix = 'st';
    else if (mod10 === 2) suffix = 'nd';
    else if (mod10 === 3) suffix = 'rd';
  }
  return `${value}${suffix}`;
};

// ============================================================================
// COMPACT (1.5K, 2.3M)
// ============================================================================

/** Short suffixes aligned with ILLIONS: thousand, million, billion, ... */
const COMPACT_SUFFIXES = Object.freeze(['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']);

/**
 * Compact notation: 1500 → '1.5K', 2300000 → '2.3M'.
 * @param {number|bigint|string} n - The number
 * @param {Object} [opt] - Options object
 * @param {number} [opt.digits=1] - Maximum decimal places
 * @param {boolean} [opt.long] - Spell the scale: '1.5 thousand'
 * @returns {string|false}
 *
 * @example
 * compact(1500)                   // '1.5K'
 * compact(2300000000)             // '2.3B'
 * compact(999950)                 // '1M'
 * compact(1500000, { long: true }) // '1.5 million'
 */
const compact = (n, opt) => {
  let str;
  if (typeof n === 'bigint') str = n.toString();
  else if (typeof n === 'number') {
    if (!Number.isFinite(n)) return false;
    str = Number.isInteger(n) ? BigInt(n).toString() : n.toString();
    if (str.includes('e')) return false;
  } else if (typeof n === 'string' && /^-?\d+(\.\d+)?$/.test(n.trim())) str = n.trim();
  else return false;

  const negative = str.startsWith('-');
  if (negative) str = str.slice(1);
  const [intPart, fracPart = ''] = str.split('.');
  const digits = Math.max(0, Math.min(opt?.digits ?? 1, 6));

  if (intPart.length < 4) {
    const small = Number(`${intPart}.${fracPart || '0'}`);
    const rounded = Number(small.toFixed(digits));
    return `${negative ? '-' : ''}${rounded}`;
  }

  let g = Math.floor((intPart.length - 1) / 3);
  if (g >= COMPACT_SUFFIXES.length) return false;
  // Value / 10^(3g) as a float; precision loss is irrelevant at <= 6 decimals
  const scaled = Number(`${intPart.slice(0, intPart.length - 3 * g)}.${intPart.slice(intPart.length - 3 * g)}${fracPart}`);
  let value = Number(scaled.toFixed(digits));
  if (value >= 1000) {
    g++;
    if (g >= COMPACT_SUFFIXES.length) return false;
    value = Number((value / 1000).toFixed(digits));
  }

  const scale = opt?.long ? ` ${ILLIONS[g]}` : COMPACT_SUFFIXES[g];
  return `${negative ? '-' : ''}${value}${scale}`;
};

// ============================================================================
// ADDITIONAL UTILITY FUNCTIONS
// ============================================================================

const negative = (n, opt) => {
  if (typeof n === 'bigint') {
    if (n >= 0n) return cardinal(n, opt);
    const result = cardinal(-n, opt);
    if (result === false) return false;
    let s = `negative ${result}`;
    if (opt?.cap) s = cap(s, opt.cap);
    return s;
  }

  if (typeof n !== 'number' || isNaN(n)) return false;

  if (n >= 0) return cardinal(n, opt);

  const result = cardinal(Math.abs(n), opt);
  if (result === false) return false;
  let s = `negative ${result}`;
  if (opt?.cap) s = cap(s, opt.cap);
  return s;
};

const fraction = (numerator, denominator, opt) => {
  if (typeof numerator !== 'number' || typeof denominator !== 'number') return false;
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) return false;
  if (denominator === 0) return false;
  if (numerator < 0 || denominator < 0) return false;

  const numWord = string(numerator);
  if (numWord === false) return false;

  const specialDenoms = {
    2: ['half', 'halves'],
    3: ['third', 'thirds'],
    4: ['quarter', 'quarters'],
    5: ['fifth', 'fifths'],
    6: ['sixth', 'sixths'],
    7: ['seventh', 'sevenths'],
    8: ['eighth', 'eighths'],
    9: ['ninth', 'ninths'],
    10: ['tenth', 'tenths'],
    12: ['twelfth', 'twelfths'],
    16: ['sixteenth', 'sixteenths'],
    20: ['twentieth', 'twentieths'],
    100: ['hundredth', 'hundredths']
  };

  let denomWord;
  if (specialDenoms[denominator]) {
    denomWord = numerator === 1 ? specialDenoms[denominator][0] : specialDenoms[denominator][1];
  } else {
    const ordinalDenom = ordinal(denominator);
    if (ordinalDenom === false) return false;
    denomWord = numerator === 1 ? ordinalDenom : ordinalDenom + 's';
  }

  let result = `${numWord} ${denomWord}`;
  if (opt?.cap) result = cap(result, opt.cap);
  return result;
};

const year = (y, opt) => {
  if (typeof y !== 'number' || isNaN(y) || !Number.isInteger(y)) return false;
  if (y < 0 || y > 9999) return false;

  let result;

  if (y === 0) {
    result = 'zero';
  } else if (y < 100) {
    result = string(y);
  } else if (y < 1000) {
    result = string(y);
  } else if (y >= 1000 && y <= 9999) {
    const century = Math.floor(y / 100);
    const remainder = y % 100;

    if (remainder === 0) {
      if (century % 10 === 0) {
        result = string(century / 10) + ' thousand';
      } else {
        result = string(century) + ' hundred';
      }
    } else if (y >= 2000 && y < 2010) {
      result = string(2000) + ' ' + string(remainder);
    } else {
      result = string(century) + ' ' + string(remainder);
    }
  } else {
    result = string(y);
  }

  if (result === false) return false;
  if (opt?.cap) result = cap(result, opt.cap);
  return result;
};

const telephone = (phone, opt) => {
  const phoneStr = String(phone).replace(/\D/g, '');
  if (!phoneStr) return false;

  const digitWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const words = phoneStr.split('').map(d => digitWords[parseInt(d, 10)]);

  let result = words.join(' ');
  if (opt?.cap) result = cap(result, opt.cap);
  return result;
};

const percent = (pct, opt) => {
  const numStr = String(pct).replace(/%/g, '').trim();
  const num = parseFloat(numStr);

  if (isNaN(num)) return false;

  let result;
  if (Number.isInteger(num) && num >= 0) {
    result = string(num);
  } else {
    result = decimal(num);
  }

  if (result === false) return false;
  result += ' percent';

  if (opt?.cap) result = cap(result, opt.cap);
  return result;
};

// ============================================================================
// MULTI-LANGUAGE FUNCTION
// ============================================================================

/**
 * Convert a number to words in a specified language
 * @param {number|bigint} n - The number to convert
 * @param {Object} [opt] - Options object
 * @param {string} [opt.lang] - Language code: 'en', 'es', 'fr', 'de', 'da', 'zh', 'hi', 'ru', 'pt', 'ja', 'ko', 'ar', 'it', 'nl', 'tr', 'pl', 'sv', 'id', 'th', 'no', 'fi', 'is'
 * @returns {string|false} The word representation
 */
const toWords = (n, opt) => {
  const lang = opt?.lang?.toLowerCase() || 'en';
  const langKey = LANGUAGES[lang] || 'english';

  let result;
  switch (langKey) {
    case 'english':
      result = english(n);
      break;
    case 'spanish':
      result = spanish(n);
      break;
    case 'french':
      result = french(n);
      break;
    case 'german':
      result = german(n);
      break;
    case 'danish':
      result = danish(n);
      break;
    case 'chinese':
      result = chinese(n, opt);
      break;
    case 'hindi':
      result = hindi(n);
      break;
    case 'russian':
      result = russian(n);
      break;
    case 'portuguese':
      result = portuguese(n);
      break;
    case 'japanese':
      result = japanese(n, opt);
      break;
    case 'korean':
      result = korean(n);
      break;
    case 'arabic':
      result = arabic(n);
      break;
    case 'italian':
      result = italian(n);
      break;
    case 'dutch':
      result = dutch(n);
      break;
    case 'turkish':
      result = turkish(n);
      break;
    case 'polish':
      result = polish(n);
      break;
    case 'swedish':
      result = swedish(n);
      break;
    case 'indonesian':
      result = indonesian(n);
      break;
    case 'thai':
      result = thai(n);
      break;
    case 'norwegian':
      result = norwegian(n);
      break;
    case 'finnish':
      result = finnish(n);
      break;
    case 'icelandic':
      result = icelandic(n);
      break;
    default:
      result = english(n);
  }

  if (result === false) return false;
  if (opt?.cap) result = cap(result, opt.cap);
  return result;
};

// ESM exports
export default string;
export {
  comma,
  group,
  ordinal,
  decimal,
  currency,
  roman,
  parse,
  negative,
  fraction,
  year,
  telephone,
  percent,
  nth,
  compact,
  toWords
};
