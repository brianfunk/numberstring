/**
 * Korean number-to-words converter (Sino-Korean)
 * Uses the man (만) system for grouping by 10,000
 * @module languages/ko
 */

const KO_DIGITS = Object.freeze(['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']);
const KO_SCALES = Object.freeze(['', '만', '억', '조', '경', '해', '자', '양', '구']);

/** Maximum supported value (10^36 - 1) */
const MAX_VALUE = 10n ** 36n - 1n;


/**
 * Convert a 4-digit group (0-9999) to Sino-Korean
 * @param {number} grp - The group value (0-9999)
 * @returns {string} The Korean representation
 */
const groupToKo = (grp) => {
  if (grp === 0) return '';

  const thousands = Math.floor(grp / 1000);
  const hundreds = Math.floor((grp % 1000) / 100);
  const tens = Math.floor((grp % 100) / 10);
  const ones = grp % 10;

  let result = '';

  // Thousands: 1 before 천 is omitted
  if (thousands > 0) {
    if (thousands === 1) {
      result += '천';
    } else {
      result += KO_DIGITS[thousands] + '천';
    }
  }

  // Hundreds: 1 before 백 is omitted
  if (hundreds > 0) {
    if (hundreds === 1) {
      result += '백';
    } else {
      result += KO_DIGITS[hundreds] + '백';
    }
  }

  // Tens: 1 before 십 is omitted
  if (tens > 0) {
    if (tens === 1) {
      result += '십';
    } else {
      result += KO_DIGITS[tens] + '십';
    }
  }

  // Ones
  if (ones > 0) {
    result += KO_DIGITS[ones];
  }

  return result;
};

/**
 * Convert a number to Korean words (Sino-Korean system)
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Korean word representation
 *
 * @example
 * korean(42) // '사십이'
 * korean(1000) // '천'
 * korean(10000) // '일만'
 */
const korean = (n) => {
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

  if (num === 0n) return '영';

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

    const grpStr = groupToKo(grp);

    // 1 before 만 and above IS included (handled naturally by groupToKo
    // since grp=1 produces '일' for the ones digit in the group)
    result += grpStr;
    if (grpIdx > 0) {
      result += KO_SCALES[grpIdx];
    }
  }

  return result;
};

export default korean;
export { korean, KO_DIGITS, KO_SCALES, MAX_VALUE };
