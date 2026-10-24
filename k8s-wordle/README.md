# Kubernetes Wordle (k8s-wordle)

Vanilla JS endless Wordle clone for Kubernetes terms. Zero dependencies, no build step.

## Features
- Endless play (no daily seed)
- Words bucketed by length 3-10
- 7 concept groups: workloads, networking, storage, config, security, cli, control-plane
- Meaning + Kubernetes docs link on every reveal
- Per-group discovery stats with expandable word lists
- Versioned localStorage keys (k8s-wordle:v2:*)
- Responsive - fits 320px viewport, uses CSS clamp()
- Modes: Mixed (default), Length-locked, Category-locked
- Repetition avoidance via solved set in localStorage
- Stats: games played/wins/win rate, guess distribution, streaks, words discovered, per-group bars

## Project Structure

```
k8s-wordle/
├── index.html      # Main game UI
├── styles.css      # Responsive styles
├── app.js          # Main application logic
├── README.md       # This file
├── SPEC.md         # Detailed specification
├── data/
│   └── words.js    # Word bank (WORDS and ALLOWED_GUESSES)
├── js/
│   ├── engine.js   # Core game logic (computeFeedback, gameReducer)
│   ├── storage.js  # localStorage wrapper with versioning
│   ├── stats.js    # Stats tracking
│   └── ui.js       # UI helpers
└── tests/
    ├── tests.html   # Engine tests
    └── wordbank.html # Word bank validation
```

## Run

Serve from the k8s-wordle directory:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

## Tests

- Engine tests: http://localhost:8000/tests/tests.html
- Word bank check: http://localhost:8000/tests/wordbank.html

## Technical Details

- Pure vanilla JavaScript (ES modules)
- No build tools, bundlers, or dependencies
- localStorage for persistence with versioned keys
- CSS clamp() for responsive layout
- Works offline after first load
