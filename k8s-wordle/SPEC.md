# Kubernetes Wordle Clone — Spec v2

Endless Wordle-style game for Kubernetes terms. Vanilla JS, zero dependencies, no build step.

## Key requirements
- Endless play (no daily seed/date logic)
- Word bank bucketed by length 3-10, >=30 words per length
- 7 concept groups: workloads, networking, storage, config, security, cli, control-plane
- Meaning + kubernetes.io docs link on every win/loss
- Per-concept-group discovery stats with expandable word lists
- Versioned localStorage keys: k8s-wordle:v2:stats, k8s-wordle:v2:solved, k8s-wordle:v2:settings
- Board uses CSS clamp(); 10 tiles fit 320px viewport
- Keyboard conditionally shows - and digit keys
- Modes: Mixed (default), Length-locked, Category-locked
- Repetition avoidance via solved set in localStorage
- Stats: games played/wins/win rate, guess distribution, streaks, words discovered, per-group bars

## File layout
- index.html, styles.css, app.js
- data/words.js (WORDS + ALLOWED_GUESSES exports)
- js/engine.js, js/storage.js, js/stats.js, js/ui.js
- tests/tests.html