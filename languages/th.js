/**
 * Thai number-to-words converter
 * Uses the lan (ล้าน) system for grouping by 1,000,000
 * @module languages/th
 */

const TH_ONES = Object.freeze(['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']);
const TH_POSITIONS = Object.freeze(['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน']);

/** Maximum supported value (10^36 - 1) */
const MAX_VALUE = 10n ** 36n - 1n;


/**
 * Convert a group of up to 6 digits (0-999999) to Thai
 * @param {number} grp - The group value (0-999999)
 * @returns {string} The Thai representation
 */
const groupToTh = (grp) => {
  if (grp === 0) return '';

  let result = '';
  const digits = [];

  // Extract digits from right to left (position 0 = ones, 5 = hundred-thousands)
  let temp = grp;
  for (let i = 0; i < 6; i++) {
    digits[i] = temp % 10;
    temp = Math.floor(temp / 10);
  }

  // Process from highest position to lowest
  for (let pos = 5; pos >= 0; pos--) {
    const d = digits[pos];
    if (d === 0) continue;

    if (pos === 0) {
      // Ones place: use เอ็ด when tens digit or higher exists
      if (d === 1 && grp > 1) {
        result += 'เอ็ด';
      } else {
        result += TH_ONES[d];
      }
    } else if (pos === 1) {
      // Tens place
      if (d === 1) {
        // 1 in tens place: just สิบ, not หนึ่งสิบ
        result += 'สิบ';
      } else if (d === 2) {
        // 2 in tens place: ยี่สิบ, not สองสิบ
        result += 'ยี่สิบ';
      } else {
        result += TH_ONES[d] + 'สิบ';
      }
    } else {
      // Hundreds, thousands, ten-thousands, hundred-thousands
      result += TH_ONES[d] + TH_POSITIONS[pos];
    }
  }

  return result;
};

/**
 * Convert a number to Thai words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Thai word representation
 *
 * @example
 * thai(42) // 'สี่สิบสอง'
 * thai(11) // 'สิบเอ็ด'
 * thai(1000000) // 'หนึ่งล้าน'
 */
const thai = (n) => {
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

  if (num === 0n) return 'ศูนย์';

  const str = num.toString();
  const len = str.length;

  // Split into groups of 6 from the right (ล้าน = million grouping)
  const groups = [];
  for (let i = len; i > 0; i -= 6) {
    const start = Math.max(0, i - 6);
    groups.unshift(str.slice(start, i));
  }

  let result = '';

  for (let i = 0; i < groups.length; i++) {
    const grp = parseInt(groups[i], 10);
    const grpIdx = groups.length - 1 - i;

    if (grp === 0) continue;

    const grpStr = groupToTh(grp);
    result += grpStr;

    // Append ล้าน scale for each group above the lowest
    if (grpIdx > 0) {
      for (let j = 0; j < grpIdx; j++) {
        result += 'ล้าน';
      }
    }
  }

  return result;
};

export default thai;
export { thai, TH_ONES, TH_POSITIONS, MAX_VALUE };
