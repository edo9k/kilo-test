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

## Run
Serve from the k8s-wordle directory:
```bash
cd k8s-wordle
python3 -m http.server 8000
```
Then open http://localhost:8000

## Tests
- Engine tests: http://localhost:8000/tests/tests.html
- Word bank check: http://localhost:8000/tests/wordbank.html
