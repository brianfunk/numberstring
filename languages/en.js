/**
 * English number-to-words converter
 * This serves as the reference implementation for other languages
 * @module languages/en
 */

const ONES = Object.freeze(['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']);
const TENS = Object.freeze(['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']);
const TEENS = Object.freeze(['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']);
const ILLIONS = Object.freeze(['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion']);

/** Maximum supported value (10^36 - 1, up to decillions) */
const MAX_VALUE = 10n ** 36n - 1n;

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

/**
 * Convert a number to English words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The English word representation
 *
 * @example
 * english(42) // 'forty-two'
 * english(1000) // 'one thousand'
 */
const english = (n) => {
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
    s += hundred(hundment(num, i));
    s += ten(tenment(num, i));
    if (hundment(num, i) > 0) {
      s += `${ILLIONS[i]} `;
    }
  }

  return s.trim();
};

export default english;
export { english, ONES, TENS, TEENS, ILLIONS, MAX_VALUE };
