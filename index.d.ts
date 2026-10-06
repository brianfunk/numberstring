/**
 * Type declarations for numberstring
 */

/** Capitalization styles */
export type CapStyle = 'title' | 'upper' | 'lower';

/** Trailing punctuation */
export type Punc = '!' | '?' | '.';

/** Language codes and aliases accepted by `lang` */
export type Lang =
  | 'en' | 'english'
  | 'es' | 'spanish' | 'español'
  | 'fr' | 'french' | 'français'
  | 'de' | 'german' | 'deutsch'
  | 'da' | 'danish' | 'dansk'
  | 'zh' | 'chinese' | 'mandarin' | '中文'
  | 'hi' | 'hindi' | 'हिन्दी'
  | 'ru' | 'russian' | 'русский'
  | 'pt' | 'portuguese' | 'português'
  | 'ja' | 'japanese' | '日本語'
  | 'ko' | 'korean' | '한국어'
  | 'ar' | 'arabic' | 'العربية'
  | 'it' | 'italian' | 'italiano'
  | 'nl' | 'dutch' | 'nederlands'
  | 'tr' | 'turkish' | 'türkçe'
  | 'pl' | 'polish' | 'polski'
  | 'sv' | 'swedish' | 'svenska'
  | 'id' | 'indonesian' | 'bahasa'
  | 'th' | 'thai' | 'ไทย'
  | 'no' | 'norwegian' | 'norsk'
  | 'fi' | 'finnish' | 'suomi'
  | 'is' | 'icelandic' | 'íslenska'
  | (string & {});

export interface Options {
  /** Capitalization: 'title', 'upper', or 'lower' */
  cap?: CapStyle;
  /** Trailing punctuation: '!', '?', or '.' */
  punc?: Punc;
  /** Language code (default 'en'). Non-English languages cover non-negative integers only. */
  lang?: Lang;
  /** Word for the decimal point (default 'point') */
  point?: string;
}

export interface CurrencyOptions extends Pick<Options, 'cap'> {
  /** Currency symbol or ISO code when the amount has none: '$', 'USD', '€', 'EUR', '£', 'GBP', '¥', 'JPY', '₹', 'INR', '元', 'CNY' */
  currency?: string;
}

export interface RomanOptions {
  /** Return lowercase numerals */
  lower?: boolean;
}

/** A conversion result, or `false` when the input cannot be converted */
export type Result = string | false;

/** Any value numberstring will try to convert */
export type Numeric = number | bigint | string;

/**
 * Convert a number to words. Accepts integers, negatives, decimals,
 * numeric strings, and BigInt up to 10^36 - 1. Honors `lang`.
 *
 * @example
 * numberstring(42)                  // 'forty-two'
 * numberstring(-3.14)               // 'negative three point one four'
 * numberstring('1000')              // 'one thousand'
 * numberstring(42, { lang: 'es' })  // 'cuarenta y dos'
 */
declare function numberstring(n: Numeric, opt?: Options): Result;
export default numberstring;

/** Convert to words in any supported language (non-negative integers) */
export function toWords(n: number | bigint, opt?: Pick<Options, 'cap' | 'lang'>): Result;

/** Ordinal words: 1 → 'first', 21 → 'twenty-first' */
export function ordinal(n: number | bigint, opt?: Pick<Options, 'cap'>): Result;

/** Decimal words: 3.14 → 'three point one four' */
export function decimal(n: number | string, opt?: Pick<Options, 'cap' | 'point'>): Result;

/** Currency words: '$123.45' → 'one hundred twenty-three dollars and forty-five cents' */
export function currency(amount: number | string, opt?: CurrencyOptions): Result;

/** Roman numerals for 1–3999: 42 → 'XLII' */
export function roman(n: number, opt?: RomanOptions): Result;

/** Parse English words back to a number: 'forty-two' → 42. Returns BigInt above the safe integer range. */
export function parse(str: string): number | bigint | false;

/** Signed words: -42 → 'negative forty-two' */
export function negative(n: number | bigint, opt?: Pick<Options, 'cap'>): Result;

/** Fraction words: (1, 2) → 'one half', (3, 4) → 'three quarters' */
export function fraction(numerator: number, denominator: number, opt?: Pick<Options, 'cap'>): Result;

/** Year as spoken: 1984 → 'nineteen eighty-four' */
export function year(y: number, opt?: Pick<Options, 'cap'>): Result;

/** Digits read individually: '555-1234' → 'five five five one two three four' */
export function telephone(phone: number | string, opt?: Pick<Options, 'cap'>): Result;

/** Percent words: 50 → 'fifty percent' */
export function percent(pct: number | string, opt?: Pick<Options, 'cap'>): Result;

/** Thousands separators: 1234567 → '1,234,567' */
export function comma(n: number | bigint): string | false;

/** Magnitude group: 0 = ones, 1 = thousands, 2 = millions, ... */
export function group(n: number | bigint): number;

/** A single-language converter for non-negative integers */
export type LanguageConverter = (n: number | bigint, opt?: Pick<Options, 'cap'>) => Result;

export const spanish: LanguageConverter;
export const french: LanguageConverter;
export const german: LanguageConverter;
export const danish: LanguageConverter;
export const chinese: LanguageConverter;
export const hindi: LanguageConverter;
export const russian: LanguageConverter;
export const portuguese: LanguageConverter;
export const japanese: LanguageConverter;
export const korean: LanguageConverter;
export const arabic: LanguageConverter;
export const italian: LanguageConverter;
export const dutch: LanguageConverter;
export const turkish: LanguageConverter;
export const polish: LanguageConverter;
export const swedish: LanguageConverter;
export const indonesian: LanguageConverter;
export const thai: LanguageConverter;
export const norwegian: LanguageConverter;
export const finnish: LanguageConverter;
export const icelandic: LanguageConverter;
