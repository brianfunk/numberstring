/**
 * Italian number-to-words converter
 * Handles Italian elision rules and special plural forms
 * @module languages/it
 */

const IT_ONES = Object.freeze(['', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove']);
const IT_TENS = Object.freeze(['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta']);
const IT_TEENS = Object.freeze(['dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove']);
const IT_HUNDREDS = Object.freeze(['', 'cento', 'duecento', 'trecento', 'quattrocento', 'cinquecento', 'seicento', 'settecento', 'ottocento', 'novecento']);
const IT_ILLIONS = Object.freeze([
  ['', ''],           // ones
  ['mille', 'mila'],  // thousands (singular, plural)
  ['milione', 'milioni'],   // millions
  ['miliardo', 'miliardi'], // billions
  ['bilione', 'bilioni'],   // trillions
  ['biliardo', 'biliardi'], // quadrillions
  ['trilione', 'trilioni'], // quintillions
  ['triliardo', 'triliardi'], // sextillions
  ['quadrilione', 'quadrilioni'], // septillions
  ['quadriliardo', 'quadriliardi'], // octillions
  ['quintilione', 'quintilioni'], // nonillions
  ['quintiliardo', 'quintiliardi']  // decillions
]);

/** Maximum supported value (10^36 - 1, up to decillions) */
const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const hundredIt = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  // Elision: drop trailing 'o' before otto (8) and ottanta (80-89)
  if (remainder >= 80 && remainder <= 89 || remainder === 8) {
    return IT_HUNDREDS[h].slice(0, -1);
  }
  return IT_HUNDREDS[h];
};

const tenIt = (n) => {
  if (n === 0) return '';
  if (n < 10) return IT_ONES[n];
  if (n < 20) return IT_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return IT_TENS[tensDigit];
  // Elision: drop final vowel of tens before uno (1) and otto (8)
  if (onesDigit === 1 || onesDigit === 8) {
    const tensWord = IT_TENS[tensDigit].slice(0, -1);
    return `${tensWord}${IT_ONES[onesDigit]}`;
  }
  // tré gets accent in compounds
  if (onesDigit === 3) {
    return `${IT_TENS[tensDigit]}tré`;
  }
  return `${IT_TENS[tensDigit]}${IT_ONES[onesDigit]}`;
};

/**
 * Convert a number to Italian words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Italian word representation
 *
 * @example
 * italian(42) // 'quarantadue'
 * italian(1000) // 'mille'
 * italian(2000) // 'duemila'
 */
const italian = (n) => {
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

  if (num === 0n) return 'zero';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        // Units group: just hundreds + tens
        if (h >= 100) s += hundredIt(h);
        const t = tenment(num, i);
        if (t > 0) s += tenIt(t);
      } else if (i === 1) {
        // Thousands: 1000 = mille, 2000+ = [n]mila
        if (h === 1) {
          s += 'mille';
        } else {
          if (h >= 100) s += hundredIt(h);
          const t = tenment(num, i);
          if (t > 0) s += tenIt(t);
          s += 'mila';
        }
      } else {
        // Millions and above: use "un milione", "due milioni", etc.
        // These are separated by spaces
        if (h === 1) {
          s += `un ${IT_ILLIONS[i][0]} `;
        } else {
          if (h >= 100) s += hundredIt(h);
          const t = tenment(num, i);
          if (t > 0) s += tenIt(t);
          s += ` ${IT_ILLIONS[i][1]} `;
        }
      }
    }
  }

  return s.trim().replace(/\s+/g, ' ');
};

export default italian;
export { italian };
