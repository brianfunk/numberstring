/**
 * Mandarin Chinese number-to-words converter
 * Uses the wan (万) system for grouping by 10,000
 * @module languages/zh
 */

const ZH_ONES = Object.freeze(['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']);
const ZH_UNITS = Object.freeze(['', '十', '百', '千']);
const ZH_ILLIONS = Object.freeze(['', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载']);

const MAX_VALUE = 10n ** 36n - 1n;

/**
 * Convert a number to Mandarin Chinese words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Mandarin word representation
 *
 * @example
 * chinese(42) // '四十二'
 * chinese(1000) // '一千'
 * chinese(10000) // '一万'
 */
const chinese = (n) => {
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

  if (num === 0n) return '零';

  const str = num.toString();
  let result = '';
  let needZero = false;

  // Process in groups of 4 (wan system)
  const len = str.length;
  const groups = [];
  for (let i = len; i > 0; i -= 4) {
    const start = Math.max(0, i - 4);
    groups.unshift(str.slice(start, i));
  }

  for (let i = 0; i < groups.length; i++) {
    const grp = parseInt(groups[i], 10);
    const grpIdx = groups.length - 1 - i;

    if (grp === 0) {
      needZero = true;
      continue;
    }

    if (needZero && result) {
      result += '零';
    }
    needZero = false;

    const thousands = Math.floor(grp / 1000);
    const hundreds = Math.floor((grp % 1000) / 100);
    const tens = Math.floor((grp % 100) / 10);
    const ones = grp % 10;

    let grpStr = '';
    let innerZero = false;

    if (thousands > 0) {
      grpStr += ZH_ONES[thousands] + ZH_UNITS[3];
      innerZero = false;
    } else if (result || i > 0) {
      innerZero = true;
    }

    if (hundreds > 0) {
      if (innerZero && grpStr) grpStr += '零';
      grpStr += ZH_ONES[hundreds] + ZH_UNITS[2];
      innerZero = false;
    } else if (thousands > 0) {
      innerZero = true;
    }

    if (tens > 0) {
      if (innerZero && grpStr) grpStr += '零';
      // Special: 10-19 at start is just 十X, not 一十X
      if (tens === 1 && !result && thousands === 0 && hundreds === 0) {
        grpStr += ZH_UNITS[1];
      } else {
        grpStr += ZH_ONES[tens] + ZH_UNITS[1];
      }
      innerZero = false;
    } else if (hundreds > 0 || thousands > 0) {
      innerZero = true;
    }

    if (ones > 0) {
      if (innerZero && grpStr) grpStr += '零';
      grpStr += ZH_ONES[ones];
    }

    result += grpStr;
    if (grpIdx > 0) {
      result += ZH_ILLIONS[grpIdx];
    }
  }

  return result;
};

export default chinese;
export { chinese };
