# LangPlayer

Multilingual news podcast audio player for practicing listening skills. Served as
static files (HTML/CSS/JS) with no build dependencies.

## What it does

- Plays short news podcast episodes in 13 world languages: English, Chinese,
  Hindi, Spanish, French, Arabic, Bengali, Portuguese, Russian, Urdu,
  Indonesian, Korean, Italian.
- Lets you toggle each language on/off in Settings; disabled languages are
  skipped entirely.
- Cycles through enabled languages in a ring (next language on episode end, on
  auto-skip, or on "Next"). Episode order is shuffled by the downloader, not by
  the browser, so navigating around stays consistent.
- Auto-skips to the next language every X minutes (default 3 min, adjustable 1–30).
- Play/pause, previous/next episode, jump back/forward 10s, progress bar.
- Retries a failing file up to twice, then auto-skips to the next episode.
- Restores your last language/episode on reload and waits for Play on first
  load, since browsers block autoplay without a user gesture.
- Persists all settings (enabled languages, skip minutes, indices) to
  `localStorage`.

## Architecture (offline bucket)

The player does **not** fetch RSS live (avoids CORS and proxy dependencies).
Instead, a Python downloader script runs twice daily on a cronjob, scrapes the
configured RSS feeds, downloads the 3 most recent small audio episodes per
language (under 15 MB, published within the last 4 days), writes a
`data/episodes.json` manifest, and prunes audio and logs older than 4 days. The
player reads local `audio/<lang>/<file>` files only.

```
langplayer/
├── index.html        # UI markup
├── style.css         # dark responsive styles (no framework)
├── app.js            # vanilla JS player + settings + localStorage
├── icons/            # PNG control icons (Google Material Design Icons)
├── feeds.json        # RSS feed URLs per language (source of truth)
├── download_episodes.py   # Python cron script: fetch + download + prune
├── cronjob.txt       # example crontab entry
├── data/             # generated: episodes.json manifest (created by script)
├── audio/<lang>/     # generated: downloaded MP3 files (created by script)
└── logs/             # generated: timestamped run logs (git-ignored)
```

## Setup

### 1. Serve the files

`langplayer/` is static. Serve it with any web server (Nginx, Apache,
`python3 -m http.server`, Caddy, etc.). No build step required. Keep `index.html`,
`style.css`, `app.js`, and `icons/` together — the controls reference the PNG
files in `icons/`.

### 2. Install the downloader on your server

The script needs Python 3 (stdlib only — no third-party packages).

Copy `download_episodes.py` and `feeds.json` to your server, then install the
cronjob from `cronjob.txt`:

```crontab
0 3,15 * * * /usr/bin/python3 /absolute/path/to/langplayer/download_episodes.py
```

This runs twice a day at 03:00 and 15:00 server time. Adjust the times as
needed. Every run writes a separate timestamped log to
`langplayer/logs/download-<timestamp>.log`; logs older than 4 days are pruned
automatically (that directory is git-ignored).

Run the script once manually before opening the player:

```bash
python3 /absolute/path/to/langplayer/download_episodes.py
```

This creates `data/episodes.json` and populates `audio/<lang>/`. Until the
first run, the player shows "No episode data. Run download_episodes.py first."

### 3. Open the player

Point your browser at `index.html`. Open Settings to enable/disable languages
or change the auto-skip interval.

## Customizing feeds

Edit `feeds.json` to add/remove RSS feed URLs per language. The downloader
keeps only items with an `<enclosure type="audio/*">` tag, so use feeds that
expose audio enclosures.

## Data persistence

User settings live in browser `localStorage` under key `langplayer:v1`.
Clearing site data resets to defaults (all languages enabled, 3 min skip,
first episode of the first enabled language).
