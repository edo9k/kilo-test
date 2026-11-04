# LangPlayer — Handoff / Maintenance Guide

For the next person who needs to modify or operate this project.

## Project location

`langplayer/` in https://github.com/edo9k/kilo-test.git — currently on `main`
(the original feature work was merged from `kilo/bitter-tensor-wv0`).

## File responsibilities

| File | Role |
|------|------|
| `index.html` | UI markup (player, settings panel, episode list) |
| `style.css` | Dark/light responsive styles; no CSS framework |
| `app.js` | Vanilla JS player, settings, localStorage persistence, manifest-driven, playback retry, speed, start-skip, theme |
| `icons/` | PNG control icons from Google Material Design Icons (Apache-2.0) |
| `feeds.json` | RSS feed URLs per language — **source of truth** for the downloader |
| `download_episodes.py` | Python cron script: fetch RSS → pick 2 new across providers → write manifest → prune audio/logs |
| `cronjob.txt` | Example crontab entry (twice daily at 03:00 and 15:00) |
| `README.md` | User-facing setup & usage docs |
| `.gitignore` | Ignores generated `audio/`, `data/`, logs, Python caches, and OS/editor files |
| `data/episodes.json` | Generated manifest (consumed by `app.js`) |
| `audio/<lang>/` | Generated downloaded audio files |
| `logs/download-<timestamp>.log` | Generated per-run log (git-ignored) |

## How it works (data flow)

1. `download_episodes.py` runs twice daily (03:00 and 15:00) via cron. It opens
   a new `logs/download-<timestamp>.log` on every run (also echoes to stdout)
   and prunes logs older than 4 days.
2. For each language in `feeds.json`, it fetches each RSS feed, keeps items
   that have an `audio/*` `<enclosure>`, were published within the last 4
   days, and claim a size under 15 MB.
3. It sorts by date and picks up to 2 new episodes per language. Provider order
   is shuffled; for each provider it considers only that provider's newest
   episode and skips it when the file is already cached, moving to the next
   provider. Failed downloads also advance to the next provider. If no new
   episodes are available, the manifest is filled from recent cached episodes
   so the player stays populated without extra downloads. New downloads go to
   `audio/<lang>/<sha256(url)[:16]><ext>` and are capped at 15 MB
   (Content-Length plus streamed byte count), so feeds with missing, zero, or
   wrong `length` attributes cannot overflow the bucket.
4. It shuffles each language's selected episode order and writes
   `data/episodes.json`, then deletes audio files older than 4 days. Each
   manifest entry includes the episode's source page `link` (item `<link>`,
   falling back to a URL-shaped `guid`, then the channel link). This is the
   **only** place playback order is randomized.
5. `app.js` on page load fetches `data/episodes.json`, builds the ring of
   enabled languages that have episodes, restores the saved language/episode
   position (or starts at the first enabled language on a fresh profile), and
   plays local `audio/` files. No live network fetching, no CORS, no proxy.
   Failed files are retried twice, then auto-skipped to the next episode.
   Autoplay is not attempted on first load because browsers block it without a
   user gesture; the player waits for the Play button instead. The player also
   applies the saved playback rate, optional start-of-episode skip, and
   light/dark theme, and shows the episode's source link when one is present.
6. Exit code is `0` if at least one episode was collected, otherwise `1`
   (useful for cron mail/alerting).

## Feed notes (verified Nov 2026)

All 15 languages currently resolve to feeds that serve recent audio. SBS is
still included, but each language now has at least one non-SBS provider where
available, favouring local or regional broadcasters over Australian coverage:

| Lang | Sources |
|------|---------|
| en | BBC Global News, NPR Up First, FT News Briefing, RNZ News (New Zealand), SABC First Take SA (South Africa) |
| zh | 公視每日新聞, 轉角國際新聞, 96.3好FM 整点新闻 (Singapore) |
| hi | BBC Hindi (दुनिया जहान, दिनभर), SBS Hindi |
| es | SBS Spanish, Cadena SER (Spain), Aristegui Noticias (Mexico) |
| fr | SBS French, HugoDécrypte (France), Radio-Canada Le Radiojournal (Canada) |
| ar | SBS Arabic, Roya News (Jordan), Atheer إيجاز (Saudi Arabia) |
| bn | SBS Bangla, BDJam সংবাদ (Bangladesh) |
| pt | SBS Portuguese, CBN (Brazil), Renascença Noticiários (Portugal) |
| ru | SBS Russian, Meduza, Эхо, BBC Russian Что это было? |
| ur | SBS Urdu, NHK World Urdu News (Japan) |
| id | SBS Indonesian, KBS World Warta Berita (Korea), Mongabay Indonesia |
| ko | SBS Korean, KBS World Korean News |
| it | SBS Italian, Sky TG24 (Italy), Il Post Globo (Italy) |
| ja | NHKラジオニュース, TBSラジオニュース, 朝日新聞アルキキ 最新ニュース, 読売新聞音声ニュース |
| de | Deutschlandfunk Die Nachrichten, tagesschau 20 Uhr, NDR Info Nachrichten, DW Langsam gesprochene Nachrichten, rbb24 Inforadio Nachrichten |

Each run shuffles the provider order and picks at most 2 new episodes per
language. Only each provider's newest episode is considered; cached providers
are skipped, failures fall through to the next provider, and cached episodes
fill any remaining slots so the player stays populated. SBS remains useful for
local Australian coverage, but it should not be the only source for any
language.

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
- Add/remove the same language code and display name in `LANG_ORDER` in
  `app.js`; that list drives the Settings toggles and playback ring.
- Re-run `download_episodes.py` (or wait for the next cron run) to regenerate
  the manifest and audio bucket.

### Change default skip interval
- Edit `DEFAULT_SKIP_MINUTES` in `app.js` (currently `3`).

### Change start-skip or playback-speed defaults
- Edit `DEFAULT_START_SKIP_SECONDS`, `DEFAULT_PLAYBACK_RATE`, and
  `PLAYBACK_RATES` in `app.js`. The start-skip slider max is in `index.html`
  (`#startSkipRange`); keep the clamp in `loadDefaults()` in sync if you
  extend it beyond 120 seconds.

### Change the default theme
- Edit `DEFAULT_THEME` in `app.js` (`"dark"` or `"light"`). The inline
  head script in `index.html` also assumes dark unless the saved theme is
  light, so update both if you add more themes.

### Change playback retry count
- Edit `MAX_PLAY_RETRIES` in `app.js` (currently `2` attempts after the first
  failure, then auto-skip).

### Change episode ordering
- The downloader shuffles the selected episodes on every run. Remove
  `random.shuffle(lang_manifest)` in `download_episodes.py` if you want a stable
  newest-first order instead.
- Provider selection is also randomized (`newest_by_provider()` for new
  downloads, `random_provider_order()` for cached fallback).

### Change the cron schedule
- Update `cronjob.txt`, then install the same line with `crontab -e` on the
  server. The current example runs at 03:00 and 15:00 server time.

### Change max episode age / size / count per language
- Edit `MAX_AGE_DAYS`, `MAX_SIZE_BYTES`, and `MAX_EPISODES_PER_LANG` in
  `download_episodes.py`. `MAX_EPISODES_PER_LANG` is the per-language download
  cap per run (currently `2`); provider order is shuffled by
  `newest_by_provider()` with cached fallback via `random_provider_order()`.
  `MAX_AGE_DAYS` also controls log retention.

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
- Icons: PNGs from Google Material Design Icons (Apache-2.0), stored in
  `icons/` and styled with CSS filters.
- Backend/cron: Python 3 standard library only (`urllib`, `xml.etree`,
  `email.utils`, `json`, `hashlib`, `datetime`, `logging`, `random`, `os`,
  `sys`).
- Storage: browser `localStorage` for user settings; server filesystem for
  audio + manifest + logs.

## Git workflow

- Default branch: `main`. Commit/push there (or a feature branch, then merge).
- `langplayer/.gitignore` excludes generated `audio/` and `data/`, everything
  under `logs/` except `logs/.gitignore`, Python caches, and OS/editor files.
- Keep generated `data/` and `audio/` out of git unless you intentionally want
  to ship a starter bucket (they are normally regenerated by the cron).
- If you add another generated directory or file, update `.gitignore` in the
  same commit.
