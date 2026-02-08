/**
 * Japanese number-to-words converter
 * Uses the man (万) system for grouping by 10,000
 * @module languages/ja
 */

const JA_DIGITS = Object.freeze(['', '一', '二', '三', '四', '五', '六', '七', '八', '九']);
const JA_SCALES = Object.freeze(['', '万', '億', '兆', '京', '垓', '𥝱', '穣', '溝']);

/** Maximum supported value (10^36 - 1, up to 溝) */
const MAX_VALUE = 10n ** 36n - 1n;


/**
 * Convert a 4-digit group (0-9999) to Japanese
 * @param {number} grp - The group value (0-9999)
 * @returns {string} The Japanese representation
 */
const groupToJa = (grp) => {
  if (grp === 0) return '';

  const thousands = Math.floor(grp / 1000);
  const hundreds = Math.floor((grp % 1000) / 100);
  const tens = Math.floor((grp % 100) / 10);
  const ones = grp % 10;

  let result = '';

  // Thousands: 1 before 千 is omitted
  if (thousands > 0) {
    if (thousands === 1) {
      result += '千';
    } else {
      result += JA_DIGITS[thousands] + '千';
    }
  }

  // Hundreds: 1 before 百 is omitted
  if (hundreds > 0) {
    if (hundreds === 1) {
      result += '百';
    } else {
      result += JA_DIGITS[hundreds] + '百';
    }
  }

  // Tens: 1 before 十 is omitted
  if (tens > 0) {
    if (tens === 1) {
      result += '十';
    } else {
      result += JA_DIGITS[tens] + '十';
    }
  }

  // Ones
  if (ones > 0) {
    result += JA_DIGITS[ones];
  }

  return result;
};

/**
 * Convert a number to Japanese words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Japanese word representation
 *
 * @example
 * japanese(42) // '四十二'
 * japanese(1000) // '千'
 * japanese(10000) // '一万'
 */
const japanese = (n) => {
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

  if (num === 0n) return 'ゼロ';

  const str = num.toString();
  const len = str.length;

  // Split into groups of 4 from the right
  const groups = [];
  for (let i = len; i > 0; i -= 4) {
    const start = Math.max(0, i - 4);
    groups.unshift(str.slice(start, i));
  }

  let result = '';

  for (let i = 0; i < groups.length; i++) {
    const grp = parseInt(groups[i], 10);
    const grpIdx = groups.length - 1 - i;

    if (grp === 0) continue;

    const grpStr = groupToJa(grp);

    // 1 before 万 and above IS included (handled naturally by groupToJa
    // since grp=1 produces '一' for the ones digit in the group)
    result += grpStr;
    if (grpIdx > 0) {
      result += JA_SCALES[grpIdx];
    }
  }

  return result;
};

export default japanese;
export { japanese, JA_DIGITS, JA_SCALES, MAX_VALUE };
