/**
 * French number-to-words converter
 * Handles French-specific rules (70s, 80s, 90s)
 * @module languages/fr
 */

const FR_ONES = Object.freeze(['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']);
const FR_TENS = Object.freeze(['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt']);
const FR_TEENS = Object.freeze(['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf']);
const FR_ILLIONS = Object.freeze(['', 'mille', 'million', 'milliard', 'billion', 'billiard', 'trillion', 'trilliard', 'quadrillion', 'quadrilliard', 'quintillion', 'quintilliard']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const tenFr = (n) => {
  if (n === 0) return '';
  if (n < 10) return `${FR_ONES[n]} `;
  if (n < 17) return `${FR_TEENS[n - 10]} `;
  if (n < 20) return `dix-${FR_ONES[n - 10]} `;
  if (n < 70) {
    const onesDigit = n % 10;
    const tensDigit = Math.floor(n / 10);
    if (onesDigit === 0) return `${FR_TENS[tensDigit]} `;
    if (onesDigit === 1) return `${FR_TENS[tensDigit]} et un `;
    return `${FR_TENS[tensDigit]}-${FR_ONES[onesDigit]} `;
  }
  if (n < 80) {
    if (n === 70) return 'soixante-dix ';
    if (n === 71) return 'soixante et onze ';
    return `soixante-${FR_TEENS[n - 70]} `;
  }
  if (n < 90) {
    if (n === 80) return 'quatre-vingts ';
    return `quatre-vingt-${FR_ONES[n - 80]} `;
  }
  if (n === 90) return 'quatre-vingt-dix ';
  if (n === 91) return 'quatre-vingt-onze ';
  return `quatre-vingt-${FR_TEENS[n - 90]} `;
};

const hundredFr = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  if (h === 1) return 'cent ';
  return `${FR_ONES[h]} cents `;
};

/**
 * Convert a number to French words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The French word representation
 *
 * @example
 * french(42) // 'quarante-deux'
 * french(80) // 'quatre-vingts'
 */
const french = (n) => {
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

  if (num === 0n) return 'zéro';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        s += hundredFr(h);
        s += tenFr(tenment(num, i));
      } else if (i === 1 && h === 1) {
        s += 'mille ';
      } else {
        s += hundredFr(h);
        s += tenFr(tenment(num, i));
        s += `${FR_ILLIONS[i]} `;
      }
    }
  }

  return s.trim().replace(/\s+/g, ' ');
};

export default french;
export { french };
