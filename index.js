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

// Re-export language functions
export { spanish, french, german, danish, chinese, hindi, russian, portuguese, japanese, korean, arabic, italian, dutch, turkish, polish, swedish, indonesian, thai, norwegian, finnish, icelandic };

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
 * Convert a number or BigInt to its English word representation
 * @param {number|bigint} n - The number to convert (0 to 10^36-1)
 * @param {Object} [opt] - Options object
 * @param {string} [opt.cap] - Capitalization: 'title', 'upper', or 'lower'
 * @param {string} [opt.punc] - Punctuation: '!', '?', or '.'
 * @returns {string|false} The word representation or false if invalid
 */
const string = (n, opt) => {
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

  if (num === 0n) {
    s = 'zero';
  } else {
    for (let i = group(num); i >= 0; i--) {
      s += hundred(hundment(num, i));
      s += ten(tenment(num, i));
      if (hundment(num, i) > 0) {
        s += `${ILLIONS[i]} `;
      }
    }
  }

  s = s.trim();

  if (opt) {
    if (opt.cap) s = cap(s, opt.cap);
    if (opt.punc !== undefined) s = punc(s, opt.punc);
  }

  return s;
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
    const cardinal = string(num);
    if (!cardinal) return false;

    const parts = cardinal.split(' ');
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
    if (isNaN(n)) return false;
    numStr = n.toString();
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

  const intNum = parseInt(intPart || '0', 10);
  const intWords = string(intNum);
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

const roman = (n, opt) => {
  if (typeof n !== 'number' || isNaN(n) || !Number.isInteger(n)) return false;
  if (n < 1 || n > 3999) return false;

  let result = '';
  let remaining = n;

  for (const [value, numeral] of ROMAN_VALUES) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
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

  for (const word of words) {
    if (Object.hasOwn(WORD_VALUES, word)) {
      const val = WORD_VALUES[word];
      if (useBigInt) {
        current += BigInt(val);
      } else {
        current += val;
      }
    } else if (word === 'hundred') {
      if (useBigInt) {
        current *= 100n;
      } else {
        current *= 100;
      }
    } else if (Object.hasOwn(SCALE_VALUES, word)) {
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
// ADDITIONAL UTILITY FUNCTIONS
// ============================================================================

const negative = (n, opt) => {
  if (typeof n === 'bigint') {
    if (n >= 0n) return string(n, opt);
    const result = string(-n, opt);
    if (result === false) return false;
    let s = `negative ${result}`;
    if (opt?.cap) s = cap(s, opt.cap);
    return s;
  }

  if (typeof n !== 'number' || isNaN(n)) return false;

  if (n >= 0) return string(n, opt);

  const result = string(Math.abs(n), opt);
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
      result = chinese(n);
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
      result = japanese(n);
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
  toWords
};
