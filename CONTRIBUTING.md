# Contributing to House Hunt Kisii

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to House Hunt Kisii. These are guidelines, not rules — use your best judgment.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)

## Code of Conduct

Be respectful, be constructive, and assume good intent. Harassment or disrespectful behavior of any kind will not be tolerated.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/HOUSE-HANTING.git
   cd HOUSE-HANTING
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment file and add your own keys:
   ```bash
   cp .env.example .env.local
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## How to Contribute

### Reporting Bugs

Before submitting a bug report, please check existing issues to avoid duplicates. When filing a bug, use the **Bug Report** issue template and include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots, if relevant
- Environment (OS, Node version, browser)

### Suggesting Features

Use the **Feature Request** issue template. Explain the problem you're trying to solve, not just the solution — it helps us evaluate the request in context.

### Picking Up an Issue

Comment on the issue you'd like to work on so it can be assigned to you and duplicate work is avoided.

## Development Workflow

1. Create a branch off `main`:
   ```bash
   git checkout -b feat/short-description
   ```
   Branch prefixes:
   - `feat/` — new feature
   - `fix/` — bug fix
   - `docs/` — documentation only
   - `refactor/` — code change that neither fixes a bug nor adds a feature
   - `chore/` — tooling, deps, config

2. Make your changes, keeping commits focused and atomic.

3. Run lint before pushing:
   ```bash
   npm run lint
   ```

4. Push your branch and open a Pull Request against `main`.

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
[optional footer]
```

Examples:
```
feat(search): add price range filter to search page
fix(auth): correct redirect after password reset
docs(readme): update environment variable table
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

## Pull Request Process

1. Ensure your branch is up to date with `main` and resolves any conflicts.
2. Fill out the PR template completely — link the related issue if one exists.
3. Keep PRs focused; a PR that does one thing well is easier to review than one that does five things partially.
4. At least one maintainer review is required before merging.
5. Squash-merge is preferred to keep history clean.

## Style Guide

- **TypeScript** — avoid `any`; prefer explicit types and Zod schemas for runtime validation on forms/APIs
- **Components** — keep UI primitives in `components/ui/`; feature-specific components live at the top level of `components/`
- **Styling** — use Tailwind utility classes; prefer `tailwind-merge`/`cva` patterns already used in `components/ui/` over new CSS files
- **Naming** — files in kebab-case (`property-card.tsx`), components in PascalCase (`PropertyCard`)
- **Imports** — group external packages, then internal aliases, then relative imports

## Questions?

Open a [discussion or issue](https://github.com/learninghub44/HOUSE-HANTING/issues) — happy to help.
