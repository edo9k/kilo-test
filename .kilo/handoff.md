// Handoff — Kubernetes Wordle Clone (k8s-wordle)

## Task
Build a vanilla-JS, zero-dependency, endless Kubernetes Wordle clone in a subdirectory
of this repo: `/workspace/app/k8s-wordle/`. Commit and push on every code change.

## Spec source
Revised Spec v2 (endless play, meaning + docs on every reveal, per-concept-group
discovery stats, vanilla JS, no build step). Full spec in the user prompt.

## What has been done so far
- Created directory structure: `k8s-wordle/{data,js}/` and `.kilo/handoff.md`.
- No application code yet.

## Pending work (in order)
1. Curate `data/words.js` — `WORDS` bucketed by length 3–10 + generated `ALLOWED_GUESSES` (≥30 per length).
2. `js/engine.js` — `computeFeedback`, `pickWord`, `validateGuess`, reducer (IDLE/IN_PROGRESS/WON/LOST).
3. `js/storage.js` — versioned localStorage keys (`k8s-wordle:v2:*`), safe-parse fallback.
4. `js/stats.js` — derivations for overall + per-concept-group discovery stats.
5. `js/ui.js` — `renderBoard`, `renderKeyboard`, `renderResult`, `renderStats`, mode picker.
6. `app.js`, `index.html`, `styles.css`.
7. `tests.html` — engine assertions (no deps).
8. Verification: no CDN/external scripts, 320px viewport, module load from static server,
   word-bank completeness assertion.
9. Commit + push after each change.

## Key constraints
- Zero runtime dependencies. No package.json deps for the shipped app. No build step.
- No daily/date/seed logic anywhere.
- Seven concept groups: workloads, networking, storage, config, security, cli, control-plane.
- Persistence keys versioned: `k8s-wordle:v2:stats`, `k8s-wordle:v2:solved`, `k8s-wordle:v2:settings`.
- Result panel on every win/loss: word + meaning + `https://kubernetes.io/docs/...` link
  (`target="_blank" rel="noopener noreferrer"`).
- Stats: per-group bars (solved/total + %), expandable word lists, reset with confirm.
- Board uses CSS `clamp()`; 10 tiles must fit 320px viewport.
- Keyboard conditionally shows `-` and digit keys.

## Environment notes
- Repo: `https://github.com/edo9k/kilo-test.git`, branch `kilo/neural-core-0e4`.
- Git user: `kiloconnect[bot]`. Push requires the embedded token in the remote URL.
- Serve locally with `python3 -m http.server` from `k8s-wordle/`.