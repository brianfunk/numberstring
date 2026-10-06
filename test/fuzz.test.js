import { describe, it, expect } from 'vitest';
import * as lib from '../index.js';

/**
 * Every public function must return a string, number, bigint, or false for
 * any input and any options object. Nothing may throw. This is the contract
 * the README promises, and the one that lets callers skip try/catch.
 */

const INPUTS = [
  0, -0, 1, -1, 0.1, -0.5, 1e21, -1e21, 1e-7, NaN, Infinity, -Infinity,
  Number.MAX_SAFE_INTEGER, Number.MAX_VALUE, Number.MIN_VALUE,
  0n, -1n, 10n ** 36n, 10n ** 37n, -(10n ** 36n),
  '', '0', '-0', '00', '1e5', 'abc', '٤٢', '42abc', ' 42 ', '1,000', '1.2.3', '.5', '5.', '-', '--5', '🕒',
  null, undefined, true, false, {}, [], [42], () => 1, Symbol('x')
];

const OPTIONS = [
  undefined, null, {}, { cap: 'camel' }, { cap: 'nope' }, { cap: 42 }, { lang: 'es' }, { lang: 'xx' }, { lang: 42 },
  { and: true }, { formal: true }, { punc: '!' }, { punc: 42 }, { point: 'dot' }, { digits: 99 }, { digits: -1 },
  { format: 'words' }, { format: 'zzz' }, { binary: true, long: true }, { prefix: true, pad: 100 }, { lower: true },
  { vertical: true }, { oh: true }
];

const RESULT_TYPES = new Set(['string', 'number', 'bigint', 'boolean']);

describe('fuzz: no public function throws', () => {
  const fns = Object.entries(lib).filter(([, v]) => typeof v === 'function');

  it.each(fns.map(([name]) => name))('%s', (name) => {
    const fn = lib[name];
    for (const input of INPUTS) {
      for (const opt of OPTIONS) {
        let result;
        expect(() => { result = fn(input, opt); }).not.toThrow();
        expect(RESULT_TYPES.has(typeof result)).toBe(true);
        if (typeof result === 'boolean') expect(result).toBe(false);
      }
    }
  });

  it('fraction and radix also survive hostile second arguments', () => {
    for (const a of INPUTS) {
      for (const b of INPUTS) {
        expect(() => lib.fraction(a, b)).not.toThrow();
        expect(() => lib.radix(a, b)).not.toThrow();
      }
    }
  });
});
