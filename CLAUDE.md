# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React + Vite SPA for practicing English vocabulary/grammar through flashcards, quizzes, and text-identification exercises. UI copy and instructions are in Spanish; practice content is English/Spanish.

## Commands

```bash
npm install
npm run dev       # dev server (Vite)
npm run build     # production build to dist/
npm run lint      # oxlint
npm run preview   # preview the production build
```

There is no test suite configured in this repo.

`dist/` is committed to the repo on purpose (likely for static hosting straight from the built folder) even though there's no CI workflow — don't delete it or add it to `.gitignore` as "build junk".

## Architecture: module system

The app is built around a **module registry**, not one fixed vocabulary set. `src/modules/index.js` exports `MODULES`, an array assembled from each module folder's `index.js` (e.g. `src/modules/adjectives`, `linkingVerbs`, `irregularVerbs`, `extremeAdjectives`, `presentPastSimple`). `App.jsx` renders `ModuleTabs` (picks the active module) and mounts `ModuleWorkspace` keyed by `module.id`, so switching modules fully remounts the workspace instead of needing manual state resets.

Each module object needs:
- `id`, `navLabel`, `title`, `subtitle`, `storageKey` (localStorage key — must be unique per module so progress doesn't collide), `words` (array of `{ id, ... }`).
- Either the generic fields (`labels`, `identify`) to use the default 4 tabs, or its own `tabs` array to fully replace them.

`ModuleWorkspace` (`src/components/ModuleWorkspace.jsx`) falls back to 4 default tabs — Estudio (`StudyMode`), Examen (`ExamMode`), Identificar (`IdentifyMode`), Progreso (`ProgressBoard`) — driven entirely by the module object; these components are generic and must stay module-agnostic. A module can opt out by declaring its own `tabs: [{ key, label, Component }]` (see `presentPastSimple`, which swaps "Identificar" for a custom spelling-rules tab and reuses its own `ConjugationStudy`/`ConjugationExam` components instead of the generic ones). The `progress` tab is identified by convention (`key === 'progress'`) to know when to pass it `stats`/`resetProgress`.

`useProgress` (`src/hooks/useProgress.js`) is the single progress engine shared by every module: it persists per-word `{ streak, correct, wrong, seen, status }` to `localStorage[module.storageKey]`, and marks a word `mastered` after `MASTER_STREAK` (3) consecutive correct answers; any wrong answer resets the streak to 0.

### The `identify` contract

Modules using the default tabs configure the "Identificar" mode via `module.identify`: `title`, `instructions`, `nounSingular`/`nounPlural`, `sampleTexts`, and optionally `looksLikeExtra(word)` — a heuristic classifier used only for **open word classes** (e.g. adjectives use `commonWords.js`, a ~1100-word reference dictionary, plus simple comparative/superlative stemming for "-er"/"-est"). Closed classes (e.g. linking verbs, a fixed ~19-verb set) omit `looksLikeExtra` entirely — there's nothing to heuristically guess beyond the practice list.

### Adding a new module

Create `src/modules/<name>/` with a `data/` subfolder for word lists and an `index.js` exporting the module object (see `adjectives/index.js` or `linkingVerbs/index.js` for the standard shape, `presentPastSimple/index.js` for a module with fully custom tabs/components). Register it in `src/modules/index.js`. No other file needs to change unless the module needs custom tabs.

## Agent workflow (`.claude/`)

This repo has a multi-agent feature workflow driven by slash commands, independent of the module architecture above:

`/init-story <carpeta>` → refines `.features/<carpeta>/feature.md` into `context.md` (via `story-refiner`) → `/design-workplan` → turns `context.md` into `workplan.md` with parallel "oleadas" (waves) (via `workplan-designer`) → `/execute-plan` → runs `executor-plan` per task per wave (parallel within a wave, sequential across waves), with a `supervisor` agent updating `feature-details.html` in the background, finishing with `test-user-guide-creator` generating `test-user-feature-guide.html` → `/commit` → stages and commits manually.

Rules for all agents in this flow (`.claude/agent-instructions.md`, which every agent reads first):
- All user-facing output (summaries, generated `.md`/`.html`) is in Spanish.
- No agent in this flow commits or pushes, or even runs `git add` — only `/commit` does, in the main thread.
- Git access from agents is read-only: `status`, `diff`, `log`, `show`, `branch --list` only.
- Output files stay inside `.features/<carpeta-del-feature>/`; don't rename/move them or touch the original `feature.md`.
- Only `executor-plan` edits source code (`src/`, etc.); the other agents (`story-refiner`, `workplan-designer`, `supervisor`, `test-user-guide-creator`) are read-only on code.

The `/commit` skill itself is an explicit exception to this project's general commit convention: it does **not** add a `Co-Authored-By` trailer.
