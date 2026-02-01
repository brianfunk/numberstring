# Claude Code Instructions for numberstring

## Project Context

This is a lightweight JavaScript library for converting numbers to English words. It's designed to be simple, fast, and have zero dependencies.

## Development Commands

```bash
npm install        # Install dev dependencies
npm test           # Run Vitest tests
npm run lint       # Run ESLint
npm run test:coverage  # Run tests with coverage report
```

## Code Style

- ES2022+ syntax (const/let, arrow functions, template literals)
- ESM modules only (`import`/`export`)
- Full JSDoc documentation
- 100% test coverage target

## Architecture

The library uses a mathematical approach to break numbers into groups of three digits (ones, thousands, millions, etc.) and converts each group to words.

Key constants:
- `ONES` - Words for 1-9
- `TEENS` - Words for 10-19
- `TENS` - Words for 20, 30, 40, etc.
- `ILLIONS` - Scale words (thousand, million, billion, trillion, quadrillion, etc.)

## When Making Changes

1. **ALWAYS run lint and tests before committing**: `npm run lint && npm test`
2. Maintain 100% coverage: `npm run test:coverage`
3. Update CHANGELOG.md for any user-facing changes
4. Preserve the fun flair (ASCII art header, tagline)

## PR Review Workflow

- Always check GitHub PR comments before continuing work
- Review feedback from Codex, human reviewers, and CI systems
- Fix valid issues before pushing new commits
- Use `gh pr view <number> --comments` to fetch PR comments

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

## Features

- Number to words (cardinal)
- Ordinals (1st, 2nd, 3rd)
- Decimals (3.14 → "three point one four")
- Currency ($1.23 → "one dollar and twenty-three cents")
- Fractions (1/2 → "one half")
- Roman numerals (42 → "XLII")
- Negative numbers
- BigInt support up to 10^36

---

## How Claude Should Work

### Planning Before Coding
For complex tasks, thoroughly plan before writing code. Create a clear implementation plan, identify affected files, and consider edge cases. A well-thought-out plan enables one-shot implementations with fewer iterations.

### Self-Improvement
When corrected on a mistake, propose an update to this CLAUDE.md file to prevent the same mistake in future sessions. Be specific about what went wrong and how to avoid it.

### Autonomous Problem Solving
When asked to fix bugs or failing tests, investigate independently. Check CI logs, read error messages, trace the issue, and fix it without requiring step-by-step guidance. Use subagents for complex multi-file investigations to keep the main context focused.

### Code Review Mindset
When asked to review changes, be critical and thorough. Identify potential issues, suggest improvements, and verify the solution actually works. Don't just rubber-stamp changes - challenge assumptions and prove correctness.

### Iterative Refinement
If an initial solution feels hacky or overly complex, step back and reconsider. Sometimes the best approach is to scrap a mediocre implementation and design a cleaner solution from scratch, using everything learned from the first attempt.

### Context Efficiency
Offload discrete subtasks to subagents to preserve main context for high-level coordination. This is especially useful for research, file exploration, and isolated fixes that don't need full conversation history.
