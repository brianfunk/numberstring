#!/usr/bin/env node
/*
 * numberstring demo
 * Run: npm run demo
 */

import numberstring, { comma } from './index.js';

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                    numberstring demo                           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('📝 Basic Numbers');
console.log('─────────────────────────────────────────');
[0, 7, 13, 42, 100, 999].forEach(n => {
  console.log(`  ${n.toString().padStart(3)} → ${numberstring(n)}`);
});

console.log('\n💰 Big Numbers');
console.log('─────────────────────────────────────────');
[1000, 1000000, 1000000000, 1000000000000, 1000000000000000].forEach(n => {
  console.log(`  ${comma(n).padStart(19)} → ${numberstring(n)}`);
});

console.log('\n🚀 BigInt Support (quintillions and beyond!)');
console.log('─────────────────────────────────────────');
const bigNums = [
  [10n ** 18n, 'quintillion'],
  [10n ** 21n, 'sextillion'],
  [10n ** 24n, 'septillion'],
  [10n ** 27n, 'octillion'],
  [10n ** 30n, 'nonillion'],
  [10n ** 33n, 'decillion'],
];
bigNums.forEach(([n, label]) => {
  console.log(`  10^${label.padEnd(11)} → ${numberstring(n)}`);
});

console.log('\n🎨 Formatting Options');
console.log('─────────────────────────────────────────');
console.log(`  Title case:  ${numberstring(55, { cap: 'title' })}`);
console.log(`  Upper case:  ${numberstring(55, { cap: 'upper' })}`);
console.log(`  With !:      ${numberstring(42, { punc: '!' })}`);
console.log(`  Combined:    ${numberstring(99, { cap: 'title', punc: '.' })}`);

console.log('\n🔢 Comma Formatting');
console.log('─────────────────────────────────────────');
console.log(`  ${comma(1234567890)}`);
console.log(`  ${comma(10n ** 18n)}`);

console.log('\n✨ Your big number:');
console.log('─────────────────────────────────────────');
const yourNumber = 10004232340000400020n;
console.log(`  ${comma(yourNumber)}`);
console.log(`  → ${numberstring(yourNumber)}`);

console.log('\n');
