// Handoff — Kubernetes Wordle Clone (k8s-wordle)

## Task
Build a vanilla-JS, zero-dependency, endless Kubernetes Wordle clone in a subdirectory
of this repo: `/workspace/app/k8s-wordle/`. Commit and push on every code change.

## Spec source
Revised Spec v2 (endless play, meaning + docs on every reveal, per-concept-group
discovery stats, vanilla JS, no build step).

## What has been done so far
- Directory structure: `k8s-wordle/{data,js,tests}/`
- `data/words.js` — CONCEPT_GROUPS (7 groups), WORD_MEANINGS with docs links, WORD_BUCKETS by length 3–10 (all ≥30), ALLOWED_GUESSES per length, WORDS union
- `js/engine.js` — computeFeedback, pickWord, validateGuess, gameReducer, GAME_STATES
- `js/storage.js` — versioned localStorage keys (k8s-wordle:v2:*), safe-parse fallback
- `js/stats.js` — overall + per-concept-group discovery stats
- `js/ui.js` — renderBoard/Keyboard/Result/Stats, mode picker support
- `app.js`, `index.html`, `styles.css` — complete UI/logic, responsive, 320px support, clamp()
- `tests/tests.html`, `tests/wordbank.html` — assertions (no deps)
- `README.md`

All changes committed and pushed. Word bank expanded to satisfy ≥30 per length.

## Pending work
None - core implementation complete. Verification passed.

## Key constraints
- Zero runtime dependencies, no build step
- No daily/date/seed logic
- Versioned storage keys
- Result shows meaning + k8s.io/docs link with target="_blank" rel="noopener noreferrer"
- Per-group bars + expandable word lists + reset with confirm
- CSS clamp(), 10 tiles fit 320px
- No CDN/external scripts

## Environment
- Repo: https://github.com/edo9k/kilo-test.git, branch kilo/neural-core-0e4
- Serve: python3 -m http.server from k8s-wordle/
