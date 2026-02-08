/**
 * Turkish number-to-words converter
 * Turkish is very regular with simple concatenation rules
 * @module languages/tr
 */

const TR_ONES = Object.freeze(['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz']);
const TR_TENS = Object.freeze(['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan']);
const TR_ILLIONS = Object.freeze(['', 'bin', 'milyon', 'milyar', 'trilyon', 'katrilyon', 'kentilyon', 'sekstilyon', 'septilyon', 'oktilyon', 'nonilyon', 'desilyon']);

/** Maximum supported value (10^36 - 1, up to decillions) */
const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const hundredTr = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  // 1 before yüz is omitted: just "yüz", not "bir yüz"
  if (h === 1) return 'yüz';
  return `${TR_ONES[h]} yüz`;
};

const tenTr = (n) => {
  if (n === 0) return '';
  if (n < 10) return TR_ONES[n];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return TR_TENS[tensDigit];
  return `${TR_TENS[tensDigit]} ${TR_ONES[onesDigit]}`;
};

/**
 * Convert a number to Turkish words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Turkish word representation
 *
 * @example
 * turkish(42) // 'kırk iki'
 * turkish(1000) // 'bin'
 * turkish(1000000) // 'bir milyon'
 */
const turkish = (n) => {
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

  if (num === 0n) return 'sıfır';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h === 0) continue;

    if (i === 0) {
      // Ones group: no scale word
      const hund = hundredTr(h);
      if (hund) s += hund + ' ';
      const t = tenment(num, i);
      const tenWord = tenTr(t);
      if (tenWord) s += tenWord + ' ';
    } else if (i === 1) {
      // Thousands: 1 before bin is omitted
      if (h === 1) {
        s += 'bin ';
      } else {
        const hund = hundredTr(h);
        if (hund) s += hund + ' ';
        const t = tenment(num, i);
        const tenWord = tenTr(t);
        if (tenWord) s += tenWord + ' ';
        s += 'bin ';
      }
    } else {
      // Millions and above: 1 IS included ("bir milyon")
      const hund = hundredTr(h);
      if (hund) s += hund + ' ';
      const t = tenment(num, i);
      const tenWord = tenTr(t);
      if (tenWord) s += tenWord + ' ';
      s += `${TR_ILLIONS[i]} `;
    }
  }

  return s.trim();
};

export default turkish;
export { turkish, TR_ONES, TR_TENS, TR_ILLIONS, MAX_VALUE };
