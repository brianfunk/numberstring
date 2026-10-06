#!/usr/bin/env node
/**
 * Stage the library into site/lib/ so the playground can import it with a
 * relative URL. Netlify runs this as the build command; no bundler needed.
 */

/* global process */

import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lib = join(root, 'site', 'lib');

rmSync(lib, { recursive: true, force: true });
mkdirSync(lib, { recursive: true });
cpSync(join(root, 'index.js'), join(lib, 'index.js'));
cpSync(join(root, 'numerals.js'), join(lib, 'numerals.js'));
cpSync(join(root, 'languages'), join(lib, 'languages'), { recursive: true });

process.stdout.write('site/lib/ staged from index.js + numerals.js + languages/\n');
