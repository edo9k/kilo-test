# Handoff — Kubernetes Wordle Clone (k8s-wordle)

## Task
Build a vanilla-JS, zero-dependency, endless Kubernetes Wordle clone in `/workspace/app/k8s-wordle/`.
Commit and push on every code change. Spec saved at `k8s-wordle/SPEC.md`.

## Audit findings (vs spec v2) — gaps to fix

### data/words.js (LARGEST — fix LAST)
- **CRITICAL**: per-length buckets far below ≥30 requirement:
  len 3=23, 4=15, 5=5, 6=8, 7=15, 8=7, 9=7, 10=3.
- No hyphen words (kube-proxy) and no digit words (k3s, k3d) currently — but k3s/k3d exist as letter-only.
  Spec requires `-` and numeric keys conditionally rendered; need at least one hyphen word and one digit word.
- `WORDS` is a flat array + `WORD_BUCKETS` map; spec example shows `WORDS = {"3":[...], "7":[...]}`.
  Also spec §3.3 wants `ALLOWED_GUESSES` generated programmatically, not hand-written.
- WORD_MEANINGS has 92 entries vs WORDS 83 — duplicates (etcd in config + control-plane).
- Need to convert to proper ES module (`export const`) per spec §7 (`<script type="module">`).

### js/engine.js
- `validateGuess` uses `/^[a-z]+$/` → rejects digits and hyphens (k3s, kube-proxy). BUG.
- `pickWord` ignores solved set — no §4.4 repetition avoidance. Needs solved-set param.
- `maxGuesses` hardcoded 6; spec: 5 attempts for length ≥ 8.
- Reducer states OK (IDLE/IN_PROGRESS/WON/LOST). No daily/date code — OK.

### js/storage.js
- Versioned keys OK. `resetAllStats` doesn't clear settings — minor.

### js/stats.js
- Missing: guess distribution, "words discovered vs total bank size" (§6.1).
- `rebuildStatsFromSolved` bypasses storage.js wrapper (reads localStorage directly) — minor.

### js/ui.js
- `getKeyboardLayout` always QWERTY — no conditional `-` or digit keys. MISSING.
- `renderResult` lacks attempt counter and "Next word" button (§4.1(6)). MISSING.
- `renderGroupStats` expandable shows only comma-joined solved words; spec wants unsolved = length + locked,
  solved = meaning + doc link (§6.2). PARTIAL.
- No dark/light toggle, no CSS custom properties, no prefers-color-scheme (§5). MISSING.
- No ARIA labels on tiles/keys. MISSING.
- No category-locked / mixed modes — only length picker (§4.2). MISSING.
- No inline wrong-guess message (uses alert in app.js).

### app.js
- `startNewGame` calls `pickWord(length, WORD_BUCKETS)` without solved set. BUG.
- Invalid guess uses `alert()` not inline message.
- Losses not added to solved set (only wins) — repetition avoidance weaker than spec intent.

### index.html
- Uses plain `<script src>` not `<script type="module">` (§7). Will fix when words.js becomes a module.

### styles.css
- Hardcoded dark theme; no custom properties, no prefers-color-scheme, no manual toggle (§5). MISSING.

### tests/tests.html
- Missing required tests (§8 Phase 2 item 11): repeated-letter feedback
  (kubelet vs kubectl), hyphen secret (kube-proxy), numeric secret (k3s), wrong-length rejection,
  no daily/date code, word-bank completeness (meaning + kubernetes.io doc URL for every entry).

## Environment
- Repo `https://github.com/edo9k/kilo-test.git`, branch `kilo/neural-core-0e4`.
- Git user `kiloconnect[bot]`; remote URL embeds token so push works directly.
- Serve: `cd k8s-wordle && python3 -m http.server 8000` → http://localhost:8000