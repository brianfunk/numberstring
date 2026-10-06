# Claude Code Instructions for numberstring

## Project Context

This is a lightweight JavaScript library for converting numbers to English words. It's designed to be simple, fast, and have zero dependencies.

## Development Commands

```bash
npm install        # Install dev dependencies
npm test           # Run Vitest tests
npm run lint       # Run ESLint
npm run test:coverage  # Run tests with coverage report
npm run site       # Build + serve the playground at http://localhost:8080
```

## Code Style

- ES2022+ syntax (const/let, arrow functions, template literals)
- ESM modules only (`import`/`export`)
- Full JSDoc documentation
- Keep coverage at or above 90% (current level); 100% on functions

## Architecture

The library uses a mathematical approach to break numbers into groups of three digits (ones, thousands, millions, etc.) and converts each group to words.

Key constants:
- `ONES` - Words for 1-9
- `TEENS` - Words for 10-19
- `TENS` - Words for 20, 30, 40, etc.
- `ILLIONS` - Scale words (thousand, million, billion, trillion, quadrillion, etc.)

## When Making Changes

1. **ALWAYS run lint and tests before committing**: `npm run lint && npm test`
2. Keep coverage from dropping: `npm run test:coverage`
3. Update CHANGELOG.md for any user-facing changes
4. Preserve the fun flair (ASCII art header, tagline)

## PR Review Workflow

- Always check GitHub PR comments before continuing work
- Review feedback from Codex, human reviewers, and CI systems
- Fix valid issues before pushing new commits
- Use `gh pr view <number> --comments` to fetch PR comments

## Layout

- `index.js` - core English conversion plus all public helpers; `numberstring()` is forgiving and delegates to `negative()`, `decimal()`, `toWords()`
- `numerals.js` - alternative numeral systems (egyptian, babylonian, greek) and `fancy()` Unicode digit styles; table-driven, re-exported from index.js. Only add Unicode blocks that macOS renders out of the box (Mayan numerals and tally marks did not)
- `languages/` - one module per language, cardinals only, non-negative integers only
- `test/languages.test.js` - per-language spot-check table; update expectations when fixing a language
- `site/` - static playground deployed to Netlify (`netlify.toml`); `scripts/build-site.js` copies the library into `site/lib/`. `og.png` is the social preview; after editing `og.svg` run `npm run site:og` to re-render it
- `archive/server/` - old Express API, unmaintained, excluded from tests and lint; do not extend it

## Supported Languages

- English (default)
- Spanish (`es`, `spanish`, `español`)
- French (`fr`, `french`, `français`)
- German (`de`, `german`, `deutsch`)
- Danish (`da`, `danish`, `dansk`)
- Chinese (`zh`, `chinese`, `中文`)
- Hindi (`hi`, `hindi`, `हिन्दी`)
- Russian (`ru`, `russian`, `русский`)
- Portuguese (`pt`, `portuguese`, `português`)
- Plus Japanese, Korean, Arabic, Italian, Dutch, Turkish, Polish, Swedish, Indonesian, Thai, Norwegian, Finnish, Icelandic (22 total)

## Features

Everything is exported from `index.js`; every function returns `string | false`.

- English words: `numberstring` (cardinal, forgiving input), `ordinal`, `nth`, `decimal`, `fraction`, `percent`, `currency`, `year`, `telephone` (`oh` option), `negative`, `parse` (words → number)
- 22 languages via `toWords(n, { lang })` or the named exports; `chinese`/`japanese` take `formal` for 大写/大字
- Spoken and coded: `nato` (`icao`, `military`), `morse`
- Notation: `compact` (1.5K), `scientific` (1.984 × 10³), `comma`, `binary`/`octal`/`hex`/`radix`, `bytes`/`bits`
- Other numeral systems: `roman` (vinculum above 3999), `greek`, `egyptian`, `babylonian`, `fancy` (circled, superscript, doublestruck, keycap/emoji, braille, ...), `clock`
- Options: `cap` casing styles (title, upper, lower, sentence, camel, pascal, snake, kebab, constant, dot), `punc`, `and` (British), `lang`, `point`, `formal`
- BigInt support up to 10^36; invalid input returns `false`
- **Zero runtime dependencies, always.** Never add a package to `dependencies`.

---

## Working Style

### Think First, Code Second
For anything non-trivial, plan the approach before writing code. Identify which files change, what the edge cases are, and how to verify it works. A solid plan means fewer iterations and cleaner implementations.

### Own the Problem
When something's broken - CI failing, bug reported, error in logs - just go fix it. Read the error, trace the cause, implement the fix. Don't wait for instructions on each step.

### Verify, Don't Assume
After making changes, prove they work. Run the tests. Check the output. If asked to review code, be genuinely critical - find the issues, don't just approve.

### When Stuck or Wrong
If a solution feels hacky, stop. Rethink from scratch using what you learned. If corrected on a mistake, suggest a CLAUDE.md update to prevent it happening again - be specific about what to avoid.

### Stay Focused
Use subagents for research, exploration, or isolated subtasks. Keep the main conversation for coordinating and making decisions.
