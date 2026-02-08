/**
 * Indonesian number-to-words converter
 * Very regular with "se-" prefix replacing "satu" for puluh, ratus, ribu
 * @module languages/id
 */

const ID_ONES = Object.freeze(['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']);
const ID_TENS = Object.freeze(['', 'sepuluh', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh']);
const ID_TEENS = Object.freeze(['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas']);
const ID_ILLIONS = Object.freeze(['', 'ribu', 'juta', 'miliar', 'triliun', 'kuadriliun', 'kuintiliun', 'sekstiliun', 'septiliun', 'oktiliun', 'noniliun', 'desiliun']);

/** Maximum supported value (10^36 - 1, up to decillions) */
const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const hundredId = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  // 1 before ratus uses "se-" prefix: seratus
  if (h === 1) return 'seratus';
  return `${ID_ONES[h]} ratus`;
};

const tenId = (n) => {
  if (n === 0) return '';
  if (n < 10) return ID_ONES[n];
  // 10-19 are special: sebelas for 11, [ones] belas for 12-19, sepuluh for 10
  if (n < 20) return ID_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return ID_TENS[tensDigit];
  return `${ID_TENS[tensDigit]} ${ID_ONES[onesDigit]}`;
};

/**
 * Convert a number to Indonesian words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Indonesian word representation
 *
 * @example
 * indonesian(42) // 'empat puluh dua'
 * indonesian(1000) // 'seribu'
 * indonesian(1000000) // 'satu juta'
 */
const indonesian = (n) => {
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

  if (num === 0n) return 'nol';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h === 0) continue;

    if (i === 0) {
      // Ones group: no scale word
      const hund = hundredId(h);
      if (hund) s += hund + ' ';
      const t = tenment(num, i);
      const tenWord = tenId(t);
      if (tenWord) s += tenWord + ' ';
    } else if (i === 1) {
      // Thousands: 1 before ribu uses "se-" prefix: seribu
      if (h === 1) {
        s += 'seribu ';
      } else {
        const hund = hundredId(h);
        if (hund) s += hund + ' ';
        const t = tenment(num, i);
        const tenWord = tenId(t);
        if (tenWord) s += tenWord + ' ';
        s += 'ribu ';
      }
    } else {
      // Millions and above: "satu" is used (no se- prefix)
      const hund = hundredId(h);
      if (hund) s += hund + ' ';
      const t = tenment(num, i);
      const tenWord = tenId(t);
      if (tenWord) s += tenWord + ' ';
      s += `${ID_ILLIONS[i]} `;
    }
  }

  return s.trim();
};

export default indonesian;
export { indonesian, ID_ONES, ID_TENS, ID_TEENS, ID_ILLIONS, MAX_VALUE };
