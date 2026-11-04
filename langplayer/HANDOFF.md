# LangPlayer — Handoff / Maintenance Guide

For the next person who needs to modify or operate this project.

## Project location

`langplayer/` in https://github.com/edo9k/kilo-test.git — currently on `main`
(the original feature work was merged from `kilo/bitter-tensor-wv0`).

## File responsibilities

| File | Role |
|------|------|
| `index.html` | UI markup (player, settings panel, episode list) |
| `style.css` | Dark responsive styles; no CSS framework |
| `app.js` | Vanilla JS player, settings, localStorage persistence, manifest-driven, playback retry |
| `icons/` | PNG control icons from Google Material Design Icons (Apache-2.0) |
| `feeds.json` | RSS feed URLs per language — **source of truth** for the downloader |
| `download_episodes.py` | Python cron script: fetch RSS → download audio → write manifest → prune |
| `cronjob.txt` | Example crontab entry (daily at 06:00) |
| `README.md` | User-facing setup & usage docs |
| `data/episodes.json` | Generated manifest (consumed by `app.js`) |
| `audio/<lang>/` | Generated downloaded audio files |
| `logs/download-<timestamp>.log` | Generated per-run log (git-ignored) |

## How it works (data flow)

1. `download_episodes.py` runs daily via cron. It opens a new
   `logs/download-<timestamp>.log` on every run (also echoes to stdout).
2. For each language in `feeds.json`, it fetches each RSS feed, keeps items
   that have an `audio/*` `<enclosure>`, were published within the last 4
   days, and claim a size under 15 MB.
3. It sorts by date and walks the list newest-first, downloading up to 3 per
   language to `audio/<lang>/<sha256(url)[:16]><ext>`. The *actual* download
   is capped at 15 MB (Content-Length plus streamed byte count), so feeds
   with missing/zero/wrong `length` attributes cannot overflow the bucket.
   Files already cached locally are reused.
4. It shuffles each language's selected episode order and writes
   `data/episodes.json`, then deletes audio files older than 4 days. This is the
   **only** place playback order is randomized.
5. `app.js` on page load fetches `data/episodes.json`, builds the ring of
   enabled languages that have episodes, restores the saved language/episode
   position (or starts at the first enabled language on a fresh profile), and
   plays local `audio/` files. No live network fetching, no CORS, no proxy.
   Failed files are retried twice, then auto-skipped to the next episode.
   Autoplay is not attempted on first load because browsers block it without a
   user gesture; the player waits for the Play button instead.
6. Exit code is `0` if at least one episode was collected, otherwise `1`
   (useful for cron mail/alerting).

## Feed notes (verified Nov 2026)

All 13 languages currently resolve to feeds that serve recent audio. Most use
SBS's multilingual news podcasts, with BBC/NPR/FT and a few regional shows:

| Lang | Sources |
|------|---------|
| en | BBC Global News Podcast, NPR Up First, FT News Briefing |
| zh | 公視每日新聞, 轉角國際新聞 |
| hi | BBC Hindi (दुनिया जहान), SBS Hindi |
| es | SBS Spanish, Cadena SER (Hoy por Hoy) |
| fr | SBS French, HugoDécrypte |
| ar | SBS Arabic |
| bn | SBS Bangla |
| pt | SBS Portuguese, CBN (Globo) |
| ru | SBS Russian, Meduza (Что случилось) |
| ur | SBS Urdu |
| id | SBS Indonesian |
| ko | SBS Korean, KBS World News |
| it | SBS Italian, Sky TG24 |

Important: plain news RSS feeds (e.g. BBC `feeds.bbci.co.uk`, NPR `feeds.npr.org/1001`,
AP, Yonhap, ANSA) have **no audio enclosures** — they are not podcasts and will
yield zero episodes. Always use a podcast feed.

SBS podcast feed patterns:
- `https://sbs-ondemand.streamguys1.com/sbs-<lang>/` (e.g. `sbs-hindi`, `sbs-bangla`)
- `https://sbs-ondemand.streamguys1.com/<lang>-newsflash/` (e.g. `arabic-newsflash`)

To find a replacement feed, the iTunes Search API is handy (no key required):

```bash
curl 'https://itunes.apple.com/search?term=news&country=es&entity=podcast&limit=25'
```

Use the returned `feedUrl`, then confirm the feed has recent `audio/*`
enclosures before adding it to `feeds.json`.

## Common maintenance tasks

### Add/remove a language or feed
- Edit `feeds.json`: add a language code entry or change its feed URL list.
- Re-run `download_episodes.py` (or wait for the next cron run) to regenerate
  the manifest and audio bucket.
- No change to `app.js` needed — language list is derived from `LANG_ORDER`
  in `app.js` (add the code/name there too if you want it in Settings).

### Change default skip interval
- Edit `DEFAULT_SKIP_MINUTES` in `app.js` (currently `3`).

### Change playback retry count
- Edit `MAX_PLAY_RETRIES` in `app.js` (currently `2` attempts after the first
  failure, then auto-skip).

### Change episode ordering
- The downloader shuffles the selected episodes on every run. Remove
  `random.shuffle(lang_manifest)` in `download_episodes.py` if you want a stable
  newest-first order instead.

### Change max episode age / size / count per language
- Edit `MAX_AGE_DAYS`, `MAX_SIZE_BYTES`, `MAX_EPISODES_PER_LANG` in
  `download_episodes.py`.

### Player shows "No episode data"
- The manifest is missing or empty. Run `download_episodes.py` manually once,
  check the newest `logs/download-*.log` for errors, and confirm
  `data/episodes.json` exists and `audio/<lang>/` has files.
- If many languages fail with 404/HTTP errors, the feeds in `feeds.json` have
  probably moved; replace them using the feed-notes procedure above.

### Debug cron failures
- Each run writes a separate timestamped log under `logs/` (e.g.
  `logs/download-20261103-134250.log`); read the newest one.
- Common causes: no network outbound from the server, dead/renamed feed URLs,
  feeds returning non-audio enclosures, Python 3 missing.
- A manual run is safe: cached files are reused, so it is fast after the first
  successful run.

## Technology stack

- Frontend: vanilla HTML/CSS/JS (ES2019+, no build step, no dependencies).
- Backend/cron: Python 3 standard library only (`urllib`, `xml.etree`,
  `email.utils`, `json`, `hashlib`, `datetime`, `logging`, `sys`).
- Storage: browser `localStorage` for user settings; server filesystem for
  audio + manifest + logs.

## Git workflow

- Default branch: `main`. Commit/push there (or a feature branch, then merge).
- Do not commit generated `data/` or `audio/` unless you want to ship a
  starter bucket (they are normally regenerated by the cron). `logs/` is
  git-ignored except for its `.gitignore`.
