import { describe, it, expect } from 'vitest';
import numberstring, {
  ordinal, nth, compact, fancy, FANCY_STYLE_NAMES,
  egyptian, babylonian, mayan, greek, tally,
  chinese, japanese, toWords
} from '../index.js';

describe('and option (British style)', () => {
  it('inserts and after hundreds', () => {
    expect(numberstring(123, { and: true })).toBe('one hundred and twenty-three');
    expect(numberstring(101, { and: true })).toBe('one hundred and one');
    expect(numberstring(100, { and: true })).toBe('one hundred');
  });

  it('inserts and before a final group under one hundred', () => {
    expect(numberstring(1001, { and: true })).toBe('one thousand and one');
    expect(numberstring(2000001, { and: true })).toBe('two million and one');
    expect(numberstring(1101, { and: true })).toBe('one thousand one hundred and one');
  });

  it('does not add and where nothing follows', () => {
    expect(numberstring(1000000, { and: true })).toBe('one million');
    expect(numberstring(1000, { and: true })).toBe('one thousand');
    expect(numberstring(42, { and: true })).toBe('forty-two');
  });

  it('is off by default', () => {
    expect(numberstring(123)).toBe('one hundred twenty-three');
    expect(numberstring(1001)).toBe('one thousand one');
  });

  it('flows through negatives and ordinals', () => {
    expect(numberstring(-1001, { and: true })).toBe('negative one thousand and one');
    expect(ordinal(101, { and: true })).toBe('one hundred and first');
    expect(numberstring(1001, { and: true, cap: 'title' })).toBe('One Thousand And One');
  });
});

describe('nth', () => {
  it('uses st, nd, rd, th', () => {
    expect(nth(1)).toBe('1st');
    expect(nth(2)).toBe('2nd');
    expect(nth(3)).toBe('3rd');
    expect(nth(4)).toBe('4th');
    expect(nth(0)).toBe('0th');
  });

  it('handles the teens', () => {
    expect(nth(11)).toBe('11th');
    expect(nth(12)).toBe('12th');
    expect(nth(13)).toBe('13th');
    expect(nth(111)).toBe('111th');
    expect(nth(112)).toBe('112th');
    expect(nth(113)).toBe('113th');
  });

  it('handles larger numbers', () => {
    expect(nth(21)).toBe('21st');
    expect(nth(22)).toBe('22nd');
    expect(nth(23)).toBe('23rd');
    expect(nth(101)).toBe('101st');
    expect(nth(1000)).toBe('1000th');
  });

  it('accepts strings, BigInt, and negatives', () => {
    expect(nth('42')).toBe('42nd');
    expect(nth(10n ** 20n + 1n)).toBe('100000000000000000001st');
    expect(nth(-1)).toBe('-1st');
  });

  it('rejects invalid input', () => {
    expect(nth(1.5)).toBe(false);
    expect(nth('abc')).toBe(false);
    expect(nth(NaN)).toBe(false);
    expect(nth(null)).toBe(false);
  });
});

describe('compact', () => {
  it('leaves small numbers alone', () => {
    expect(compact(999)).toBe('999');
    expect(compact(12)).toBe('12');
    expect(compact(0.5)).toBe('0.5');
    expect(compact(-7)).toBe('-7');
  });

  it('abbreviates thousands and up', () => {
    expect(compact(1000)).toBe('1K');
    expect(compact(1500)).toBe('1.5K');
    expect(compact(1234567)).toBe('1.2M');
    expect(compact(2300000000)).toBe('2.3B');
    expect(compact(1e12)).toBe('1T');
    expect(compact(10n ** 21n)).toBe('1Sx');
  });

  it('carries when rounding crosses a scale', () => {
    expect(compact(999950)).toBe('1M');
    expect(compact(999999)).toBe('1M');
  });

  it('handles negatives, strings, and decimals', () => {
    expect(compact(-1500)).toBe('-1.5K');
    expect(compact('1500.75')).toBe('1.5K');
  });

  it('honors digits and long options', () => {
    expect(compact(1234567, { digits: 2 })).toBe('1.23M');
    expect(compact(1234567, { digits: 0 })).toBe('1M');
    expect(compact(1500000, { long: true })).toBe('1.5 million');
    expect(compact(2000, { long: true })).toBe('2 thousand');
  });

  it('rejects invalid input', () => {
    expect(compact('abc')).toBe(false);
    expect(compact(NaN)).toBe(false);
    expect(compact(Infinity)).toBe(false);
    expect(compact(1e37)).toBe(false);
    expect(compact({})).toBe(false);
  });
});

describe('fancy', () => {
  it('defaults to circled digits', () => {
    expect(fancy(42)).toBe('④②');
    expect(fancy(0)).toBe('⓪');
  });

  it('supports every listed style', () => {
    const expected = {
      circled: '④②',
      superscript: '⁴²',
      subscript: '₄₂',
      fullwidth: '４２',
      bold: '𝟒𝟐',
      doublestruck: '𝟜𝟚',
      sans: '𝟦𝟤',
      monospace: '𝟺𝟸',
      keycap: '4️⃣2️⃣',
      braille: '⠼⠙⠃'
    };
    expect([...FANCY_STYLE_NAMES].sort()).toEqual(Object.keys(expected).sort());
    for (const [style, out] of Object.entries(expected)) {
      expect(fancy(42, style)).toBe(out);
    }
  });

  it('maps minus signs and decimal points', () => {
    expect(fancy(-3.5, 'fullwidth')).toBe('－３．５');
    expect(fancy(-3.5, 'superscript')).toBe('⁻³˙⁵');
    expect(fancy(-3.5, 'braille')).toBe('⠼⠤⠉⠨⠑');
    expect(fancy('-42', 'circled')).toBe('−④②');
  });

  it('handles BigInt and exponent-form integers', () => {
    expect(fancy(10n ** 3n, 'doublestruck')).toBe('𝟙𝟘𝟘𝟘');
    expect(fancy(1e21, 'subscript')).toBe('₁₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀');
  });

  it('rejects unknown styles and bad input', () => {
    expect(fancy(42, 'wingdings')).toBe(false);
    expect(fancy('abc')).toBe(false);
    expect(fancy(NaN)).toBe(false);
    expect(fancy(1.5e-7)).toBe(false);
  });
});

describe('egyptian', () => {
  it('repeats symbols additively', () => {
    expect(egyptian(1)).toBe('𓏺');
    expect(egyptian(9)).toBe('𓏺'.repeat(9));
    expect(egyptian(10)).toBe('𓎆');
    expect(egyptian(42)).toBe('𓎆𓎆𓎆𓎆𓏺𓏺');
    expect(egyptian(1000)).toBe('𓆼');
    expect(egyptian(1000000)).toBe('𓁨');
    expect(egyptian(1234567)).toBe('𓁨𓆐𓆐𓂭𓂭𓂭𓆼𓆼𓆼𓆼𓍢𓍢𓍢𓍢𓍢𓎆𓎆𓎆𓎆𓎆𓎆𓏺𓏺𓏺𓏺𓏺𓏺𓏺');
  });

  it('rejects zero and values beyond 9,999,999', () => {
    expect(egyptian(0)).toBe(false);
    expect(egyptian(10000000)).toBe(false);
    expect(egyptian(-1)).toBe(false);
    expect(egyptian(1.5)).toBe(false);
  });
});

describe('babylonian', () => {
  it('writes base-60 places with tens and ones wedges', () => {
    expect(babylonian(1)).toBe('𒐕');
    expect(babylonian(10)).toBe('𒌋');
    expect(babylonian(42)).toBe('𒌋𒌋𒌋𒌋𒐕𒐕');
    expect(babylonian(59)).toBe('𒌋𒌋𒌋𒌋𒌋𒐕𒐕𒐕𒐕𒐕𒐕𒐕𒐕𒐕');
    expect(babylonian(60)).toBe('𒐕 𒑊');
    expect(babylonian(61)).toBe('𒐕 𒐕');
    expect(babylonian(3600)).toBe('𒐕 𒑊 𒑊');
    expect(babylonian(1984)).toBe('𒌋𒌋𒌋𒐕𒐕𒐕 𒐕𒐕𒐕𒐕');
  });

  it('uses the placeholder for zero', () => {
    expect(babylonian(0)).toBe('𒑊');
  });

  it('accepts BigInt and rejects invalid input', () => {
    expect(babylonian(10n ** 18n)).toMatch(/^𒐕/);
    expect(babylonian(-1)).toBe(false);
    expect(babylonian('x')).toBe(false);
  });
});

describe('mayan', () => {
  it('writes base-20 digits most significant first', () => {
    expect(mayan(0)).toBe('𝋠');
    expect(mayan(19)).toBe('𝋳');
    expect(mayan(20)).toBe('𝋡𝋠');
    expect(mayan(42)).toBe('𝋢𝋢');
    expect(mayan(400)).toBe('𝋡𝋠𝋠');
    expect(mayan(1984)).toBe('𝋤𝋳𝋤');
  });

  it('stacks vertically on request', () => {
    expect(mayan(1984, { vertical: true })).toBe('𝋤\n𝋳\n𝋤');
  });

  it('rejects invalid input', () => {
    expect(mayan(-1)).toBe(false);
    expect(mayan(2.5)).toBe(false);
  });
});

describe('greek', () => {
  it('uses Ionic letters with keraia', () => {
    expect(greek(1)).toBe('αʹ');
    expect(greek(6)).toBe('ϛʹ');
    expect(greek(42)).toBe('μβʹ');
    expect(greek(90)).toBe('ϟʹ');
    expect(greek(900)).toBe('ϡʹ');
    expect(greek(1999)).toBe('͵αϡϟθʹ');
    expect(greek(2026)).toBe('͵βκϛʹ');
    expect(greek(1000)).toBe('͵αʹ');
  });

  it('rejects zero and values over 9999', () => {
    expect(greek(0)).toBe(false);
    expect(greek(10000)).toBe(false);
    expect(greek(-5)).toBe(false);
  });
});

describe('tally', () => {
  it('groups by five', () => {
    expect(tally(0)).toBe('');
    expect(tally(1)).toBe('𝍷');
    expect(tally(4)).toBe('𝍷𝍷𝍷𝍷');
    expect(tally(5)).toBe('𝍸');
    expect(tally(7)).toBe('𝍸 𝍷𝍷');
    expect(tally(12)).toBe('𝍸 𝍸 𝍷𝍷');
  });

  it('rejects negatives, fractions, and more than 1000', () => {
    expect(tally(-1)).toBe(false);
    expect(tally(1.5)).toBe(false);
    expect(tally(1001)).toBe(false);
  });
});

describe('formal Chinese and Japanese numerals', () => {
  it('uses 大写 financial forms in Chinese', () => {
    expect(chinese(42, { formal: true })).toBe('肆拾贰');
    expect(chinese(10, { formal: true })).toBe('壹拾');
    expect(chinese(1001, { formal: true })).toBe('壹仟零壹');
    expect(chinese(123456, { formal: true })).toBe('壹拾贰万叁仟肆佰伍拾陆');
    expect(chinese(100000001, { formal: true })).toBe('壹亿零壹');
    expect(chinese(0, { formal: true })).toBe('零');
  });

  it('uses 大字 forms in Japanese', () => {
    expect(japanese(42, { formal: true })).toBe('四拾弐');
    expect(japanese(10, { formal: true })).toBe('壱拾');
    expect(japanese(1000, { formal: true })).toBe('壱千');
    expect(japanese(1001, { formal: true })).toBe('壱千壱');
    expect(japanese(123456, { formal: true })).toBe('壱拾弐万参千四百五拾六');
  });

  it('is off by default and reachable through toWords', () => {
    expect(chinese(42)).toBe('四十二');
    expect(japanese(1000)).toBe('千');
    expect(toWords(42, { lang: 'zh', formal: true })).toBe('肆拾贰');
    expect(toWords(10000, { lang: 'ja', formal: true })).toBe('壱万');
  });
});

describe('language aliases', () => {
  it('accepts bahasa for Indonesian', () => {
    expect(numberstring(42, { lang: 'bahasa' })).toBe('empat puluh dua');
  });
});
