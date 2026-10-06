/**
 * Japanese number-to-words converter
 * Uses the man (万) system for grouping by 10,000
 * @module languages/ja
 */

const JA_DIGITS = Object.freeze(['', '一', '二', '三', '四', '五', '六', '七', '八', '九']);
/** Daiji (大字) anti-fraud forms used on banknotes and legal documents */
const JA_DAIJI = Object.freeze(['', '壱', '弐', '参', '四', '五', '六', '七', '八', '九']);
const JA_SCALES = Object.freeze(['', '万', '億', '兆', '京', '垓', '𥝱', '穣', '溝']);

/** Maximum supported value (10^36 - 1, up to 溝) */
const MAX_VALUE = 10n ** 36n - 1n;


/**
 * Convert a 4-digit group (0-9999) to Japanese
 * @param {number} grp - The group value (0-9999)
 * @returns {string} The Japanese representation
 */
const groupToJa = (grp, afterScale = false, formal = false) => {
  if (grp === 0) return '';
  const digits = formal ? JA_DAIJI : JA_DIGITS;
  const ten = formal ? '拾' : '十';

  const thousands = Math.floor(grp / 1000);
  const hundreds = Math.floor((grp % 1000) / 100);
  const tens = Math.floor((grp % 100) / 10);
  const ones = grp % 10;

  let result = '';

  // Thousands: 1 before 千 is omitted at the start (千) but kept after a
  // higher scale word (二万一千)
  // Daiji always writes the 壱 (壱千, 壱百, 壱拾)
  if (thousands > 0) {
    if (thousands === 1 && !afterScale && !formal) {
      result += '千';
    } else {
      result += digits[thousands] + '千';
    }
  }

  // Hundreds: 1 before 百 is omitted
  if (hundreds > 0) {
    if (hundreds === 1 && !formal) {
      result += '百';
    } else {
      result += digits[hundreds] + '百';
    }
  }

  // Tens: 1 before 十 is omitted
  if (tens > 0) {
    if (tens === 1 && !formal) {
      result += ten;
    } else {
      result += digits[tens] + ten;
    }
  }

  // Ones
  if (ones > 0) {
    result += digits[ones];
  }

  return result;
};

/**
 * Convert a number to Japanese words
 * @param {number|bigint} n - The number to convert
 * @param {Object} [opt] - Options object
 * @param {boolean} [opt.formal] - Use daiji 大字 numerals (壱弐参, 拾)
 * @returns {string|false} The Japanese word representation
 *
 * @example
 * japanese(42) // '四十二'
 * japanese(1000) // '千'
 * japanese(10000) // '一万'
 */
const japanese = (n, opt) => {
  const formal = opt?.formal === true;
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

  if (num === 0n) return formal ? '零' : 'ゼロ';

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

    const grpStr = groupToJa(grp, i > 0, formal);

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
