# Rust by Concept

> A single-page web app that teaches Rust through ten core concepts, with live compilation against the official Rust Playground. Built with React 19, TypeScript, Vite, Mantine, and vanilla-extract.

The app itself is written in TypeScript/React — it *teaches* Rust, it is not a Rust project. Deployed to GitHub Pages at `https://mearman.github.io/learn-rust/`.

## Getting started

Requires Node 26.1.0 (pinned in `.tool-versions`) and pnpm 10.24.0 (pinned in `package.json` `packageManager`). Use a version manager that reads `.tool-versions` (asdf, mise) so the Node version matches CI.

```bash
pnpm install
pnpm dev          # Vite dev server with HMR
```

`pnpm prepare` installs Husky git hooks; it runs automatically after `pnpm install`.

## Build, test, and lint

```bash
pnpm dev          # local dev server
pnpm build        # tsc -b (project references) then vite build → dist/
pnpm preview      # serve the production build locally
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint .  (no separate format step — Prettier runs via eslint-plugin-prettier)
pnpm test         # vitest run (single pass)
pnpm test:watch   # vitest in watch mode
```

Run a single test file with `pnpm exec vitest run path/to/file.test.ts`, or a single test by name with `pnpm exec vitest run -t "test name"`.

Formatting is enforced *through* ESLint: `prettier/prettier` is an error rule, so `pnpm lint` reports format violations and `eslint --fix` fixes them. There is no standalone `pnpm format` script. Prettier config: 4-space indent, double quotes, semicolons, ES5 trailing commas, 80-column width (`prettier.config.ts`).

The build sets `base` from the `BASE_URL` env var (defaults to `/`). CI builds Pages with `BASE_URL=/learn-rust/` — set it the same way if you build for deployment locally.

## Architecture

The whole app is one long scrolling page — there is no router. `App.tsx` renders every section (`learn`, `challenge`, `path`, `compare`, `syntax`, `glossary`, `errors`, `cheatsheet`) stacked in a single document. The nav bar and "open X" callbacks navigate by calling `element.scrollIntoView`, not by changing routes. Scroll position drives UI state: `useActiveSection` reports which top-level section is in view and `useActiveSubSection` tracks the active sub-section for the sidebar table of contents (`SubSectionToc`).

Content is data-driven. `src/data/` is the single source of truth for the teaching material — `concepts.ts`, `languages.ts`, `language-concepts.ts`, `syntax-references.ts`, `glossary.ts`, `errors.ts`, `dependencies.ts` — all typed against the interfaces in `src/data/types.ts` (`Language`, `Concept`, `LanguageConcept`, `SyntaxReference`, etc.). The view components in `src/references/`, `src/learn/`, `src/challenge/`, and `src/cheatsheet/` are presentational: they read from these data modules and render. To add or change teaching content, edit the data files; the views and the sidebar TOC (`src/layout/subSections.ts`) derive their entries from the data automatically.

Live code compilation is real, not simulated. `src/compiler/PlaygroundBackend.ts` POSTs to `https://play.rust-lang.org/execute`; bare snippets are wrapped in `fn main() {}` before sending. The backend sits behind the `CompilerBackend` interface (`src/compiler/types.ts`), and `useCompiler` exposes `compile`/`clear`/`compiling`/`result` to the views.

Styling uses vanilla-extract: styles live in `*.css.ts` files (e.g. `src/theme/styles.css.ts`, `sprinkles.css.ts`, `theme.css.ts`) and compile to static CSS at build time via `@vanilla-extract/vite-plugin`. Theme tokens come from `vars` in `theme.css.ts`; Mantine provides component primitives, wired up in `src/theme/AppProvider.tsx`. Theme mode (light/dark) is handled by `useThemeMode`.

User personalisation lives in `src/settings/`: a `useUserProfile` hook persists the reader's language background and familiarity, and several views filter or reorder their content based on the profile (e.g. comparisons highlight the languages the reader already knows).

## Conventions

Imports must include the file extension (`.ts` / `.tsx`). `tsconfig.app.json` sets `allowImportingTsExtensions` with `verbatimModuleSyntax`, so `import { X } from "./foo.ts"` is required — extensionless imports will not resolve. Use `import type` for type-only imports.

Type assertions are banned. `@typescript-eslint/consistent-type-assertions` is set to `assertionStyle: "never"` — no `as`, no `as unknown as`, no angle-bracket casts. Narrow with type guards or restructure the types. The config also runs `tseslint`'s `strictTypeChecked` plus `noUncheckedIndexedAccess`, so indexed access yields `T | undefined` and must be guarded, not coerced.

Three custom ESLint rules (defined in `eslint-rules/`, registered in `eslint.config.ts`) enforce the module structure:
- `no-barrel-files` — `index.ts` / `index.tsx` files are forbidden.
- `no-re-exports` — `export … from` is forbidden; import directly from the source module.
- `no-pointless-reassignments` — bans `const x = y` aliases that perform no transformation (autofix rewrites usages to the original name).

A fourth rule, `no-dynamic-imports`, also lives in `eslint-rules/` (with tests) but is registered without being enabled, so `import()` is permitted — for example to code-split the heavy data modules. Re-enable it by adding `"custom/no-dynamic-imports": "error"` back to the rules block.

Every module is imported directly by its own path. There are no barrels, so when adding a module, import it where it is used rather than re-exporting it through an index.

Commits follow Conventional Commits (`@commitlint/config-conventional`). On pull requests, CI lints every commit message in the range, so non-conforming messages fail the build.

## Gotchas and quirks

`pnpm install` must succeed against `.npmrc`, which sets `min-release-age` / `minimum-release-age` to 4320 minutes (3 days) and `save-exact=true`. Packages published within the last three days are blocked, and all dependency versions are pinned exactly (no `^`/`~`). Add dependencies with `pnpm add`, never by editing `package.json` by hand — manual edits skip the lockfile update and the release-age check.

The pre-commit hook runs `lint-staged`, which runs `eslint --fix` on staged `*.{ts,tsx}` files. A commit fails if ESLint finds unfixable errors. Fix the reported issue rather than bypassing the hook.

GitHub Pages deployment is automatic: every push to `main` runs the `check` and `test` jobs, then `pages-build` (with `BASE_URL=/learn-rust/`) and `pages-deploy`. The build copies `dist/index.html` to `dist/404.html` so client-side deep links resolve under Pages. Because routing is scroll-based rather than path-based, the 404 fallback simply re-serves the single page.

Dependabot opens grouped dependency PRs weekly; `dependabot-auto-merge.yml` waits for CI and rebase-merges them automatically once checks pass.

## Contributing

Branch off `main`, keep commits atomic and Conventional-Commit formatted, and open a PR against `main`. CI must pass: commit-message lint (PRs only), `typecheck`, `lint`, and `test`. The Pages site rebuilds and redeploys on merge to `main`.
