/**
 * German number-to-words converter
 * German reverses ones and tens (einundzwanzig = one-and-twenty)
 * @module languages/de
 */

const DE_ONES = Object.freeze(['', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun']);
const DE_ONES_PREFIX = Object.freeze(['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun']);
const DE_TENS = Object.freeze(['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig']);
const DE_TEENS = Object.freeze(['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn']);
const DE_ILLIONS = Object.freeze(['', 'tausend', 'Million', 'Milliarde', 'Billion', 'Billiarde', 'Trillion', 'Trilliarde', 'Quadrillion', 'Quadrilliarde', 'Quintillion', 'Quintilliarde']);
const DE_ILLIONS_PLURAL = Object.freeze(['', 'tausend', 'Millionen', 'Milliarden', 'Billionen', 'Billiarden', 'Trillionen', 'Trilliarden', 'Quadrillionen', 'Quadrilliarden', 'Quintillionen', 'Quintilliarden']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const tenDe = (n) => {
  if (n === 0) return '';
  if (n < 10) return DE_ONES[n];
  if (n < 20) return DE_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return DE_TENS[tensDigit];
  return `${DE_ONES_PREFIX[onesDigit]}und${DE_TENS[tensDigit]}`;
};

const hundredDe = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  return `${DE_ONES_PREFIX[h]}hundert`;
};

/**
 * Convert a number to German words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The German word representation
 *
 * @example
 * german(42) // 'zweiundvierzig'
 * german(1000) // 'eintausend'
 */
const german = (n) => {
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

  if (num === 0n) return 'null';
  if (num === 1n) return 'eins';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        if (h >= 100) s += hundredDe(h);
        const t = tenment(num, i);
        if (t > 0) s += tenDe(t);
      } else if (i === 1) {
        if (h === 1) {
          s += 'eintausend';
        } else {
          if (h >= 100) s += hundredDe(h);
          const t = tenment(num, i);
          if (t > 0) s += tenDe(t);
          s += 'tausend';
        }
      } else {
        if (h >= 100) s += hundredDe(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) {
          if (t === 1) {
            s += 'eine ';
          } else {
            s += tenDe(t) + ' ';
          }
        } else if (h < 100 && h >= 1 && h === 1) {
          s += 'eine ';
        }
        const illionWord = h === 1 ? DE_ILLIONS[i] : DE_ILLIONS_PLURAL[i];
        s += `${illionWord} `;
      }
    }
  }

  return s.trim();
};

export default german;
export { german };
