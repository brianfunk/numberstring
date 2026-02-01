/**
 * Language exports for numberstring
 * Each language module provides a function to convert numbers to words
 *
 * Adding a new language:
 * 1. Create a new file (e.g., pt.js for Portuguese)
 * 2. Export a default function that takes (n, opt) and returns string|false
 * 3. Add the import and export below
 * 4. Add the language to LANGUAGES and toWords switch in main index.js
 *
 * @module languages
 */

import english from './en.js';
import spanish from './es.js';
import french from './fr.js';
import german from './de.js';
import danish from './da.js';
import chinese from './zh.js';
import hindi from './hi.js';
import russian from './ru.js';

/** Supported language codes and aliases */
const LANGUAGES = Object.freeze({
  en: 'english',
  english: 'english',
  es: 'spanish',
  spanish: 'spanish',
  español: 'spanish',
  fr: 'french',
  french: 'french',
  français: 'french',
  de: 'german',
  german: 'german',
  deutsch: 'german',
  da: 'danish',
  danish: 'danish',
  dansk: 'danish',
  zh: 'chinese',
  chinese: 'chinese',
  mandarin: 'chinese',
  '中文': 'chinese',
  hi: 'hindi',
  hindi: 'hindi',
  'हिन्दी': 'hindi',
  ru: 'russian',
  russian: 'russian',
  'русский': 'russian'
});

export {
  english,
  spanish,
  french,
  german,
  danish,
  chinese,
  hindi,
  russian,
  LANGUAGES
};
