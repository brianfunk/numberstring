/**
 * Swedish number-to-words converter
 * Swedish uses long scale (miljon, miljard, biljon, etc.)
 * @module languages/sv
 */

const SV_ONES = Object.freeze(['', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio']);
const SV_TENS = Object.freeze(['', '', 'tjugo', 'trettio', 'fyrtio', 'femtio', 'sextio', 'sjuttio', 'åttio', 'nittio']);
const SV_TEENS = Object.freeze(['tio', 'elva', 'tolv', 'tretton', 'fjorton', 'femton', 'sexton', 'sjutton', 'arton', 'nitton']);
const SV_ILLIONS = Object.freeze(['', 'tusen', 'miljon', 'miljard', 'biljon', 'biljard', 'triljon', 'triljard', 'kvadriljon', 'kvadriljard', 'kvintiljon', 'kvintiljard']);
const SV_ILLIONS_PLURAL = Object.freeze(['', 'tusen', 'miljoner', 'miljarder', 'biljoner', 'biljarder', 'triljoner', 'triljarder', 'kvadriljoner', 'kvadriljarder', 'kvintiljoner', 'kvintiljarder']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const tenSv = (n) => {
  if (n === 0) return '';
  if (n < 10) return SV_ONES[n];
  if (n < 20) return SV_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return SV_TENS[tensDigit];
  return `${SV_TENS[tensDigit]}${SV_ONES[onesDigit]}`;
};

const hundredSv = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  if (h === 1) return 'etthundra';
  return `${SV_ONES[h]}hundra`;
};

/**
 * Convert a number to Swedish words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Swedish word representation
 *
 * @example
 * swedish(42) // 'fyrtiotvå'
 * swedish(1000) // 'ettusen'
 */
const swedish = (n) => {
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

  if (num === 0n) return 'noll';
  if (num === 1n) return 'en';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        if (h >= 100) s += hundredSv(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) s += tenSv(t);
      } else if (i === 1) {
        if (h === 1) {
          s += 'ettusen ';
        } else {
          if (h >= 100) s += hundredSv(h) + ' ';
          const t = tenment(num, i);
          if (t > 0) s += tenSv(t);
          s += 'tusen ';
        }
      } else {
        if (h >= 100) s += hundredSv(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) {
          if (t === 1) {
            s += 'en ';
          } else {
            s += tenSv(t) + ' ';
          }
        } else if (h < 100 && h >= 1 && h === 1) {
          s += 'en ';
        }
        const illionWord = h === 1 ? SV_ILLIONS[i] : SV_ILLIONS_PLURAL[i];
        s += `${illionWord} `;
      }
    }
  }

  return s.trim();
};

export default swedish;
export { swedish };
