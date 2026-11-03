#!/usr/bin/env python3
"""Download recent small news podcast episodes per language for LangPlayer.

Run daily (e.g. via cron). Produces audio/<lang>/<hash>.mp3 and
data/episodes.json (manifest consumed by the player). Prunes audio older
than MAX_AGE_DAYS so only recent episodes are kept.
"""

import os
import sys
import json
import hashlib
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from datetime import datetime, timedelta, timezone

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(BASE_DIR, "audio")
DATA_DIR = os.path.join(BASE_DIR, "data")
FEEDS_FILE = os.path.join(BASE_DIR, "feeds.json")
MANIFEST_FILE = os.path.join(DATA_DIR, "episodes.json")

MAX_AGE_DAYS = 4
MAX_EPISODES_PER_LANG = 3
MAX_SIZE_BYTES = 15 * 1024 * 1024  # "small" episodes only
USER_AGENT = "Mozilla/5.0 (LangPlayer downloader; contact: admin)"


def load_feeds():
    with open(FEEDS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read()


def parse_feed(xml_bytes, feed_name, lang):
    root = ET.fromstring(xml_bytes)
    items = []
    for item in root.findall(".//item"):
        enc = item.find("enclosure")
        if enc is None:
            continue
        enc_type = (enc.get("type") or "").lower()
        if "audio" not in enc_type:
            continue
        url = enc.get("url")
        if not url:
            continue
        length = enc.get("length")
        size = int(length) if length and length.isdigit() else None
        title_el = item.find("title")
        title = (title_el.text or "Untitled").strip() if title_el is not None else "Untitled"
        pub_el = item.find("pubDate")
        pub_date = None
        if pub_el is not None and pub_el.text:
            try:
                pub_date = parsedate_to_datetime(pub_el.text.strip())
                if pub_date.tzinfo is None:
                    pub_date = pub_date.replace(tzinfo=timezone.utc)
            except Exception:
                pub_date = None
        desc_el = item.find("description")
        desc = (desc_el.text or "").strip() if desc_el is not None else ""
        guid_el = item.find("guid")
        guid = (guid_el.text or url).strip() if guid_el is not None and guid_el.text else url
        items.append({
            "url": url,
            "size": size,
            "title": title,
            "pub_date": pub_date,
            "desc": desc,
            "guid": guid,
            "source": feed_name,
            "lang": lang,
        })
    return items


def main():
    feeds = load_feeds()
    os.makedirs(AUDIO_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)

    cutoff = datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)
    manifest = {}

    for lang, feed_list in feeds.items():
        lang_dir = os.path.join(AUDIO_DIR, lang)
        os.makedirs(lang_dir, exist_ok=True)

        all_episodes = []
        for feed in feed_list:
            try:
                xml = fetch(feed["url"])
                all_episodes.extend(parse_feed(xml, feed["name"], lang))
            except Exception as e:
                print(f"[WARN] {feed['name']} ({lang}): {e}", file=sys.stderr)

        # Keep recent, small, dated episodes only
        recent = []
        for it in all_episodes:
            if it["pub_date"] is None:
                continue
            if it["pub_date"] < cutoff:
                continue
            if it["size"] is not None and it["size"] > MAX_SIZE_BYTES:
                continue
            recent.append(it)

        recent.sort(key=lambda x: x["pub_date"], reverse=True)
        selected = recent[:MAX_EPISODES_PER_LANG]

        lang_manifest = []
        for it in selected:
            h = hashlib.sha256(it["url"].encode("utf-8")).hexdigest()[:16]
            ext = os.path.splitext(it["url"])[1]
            if not ext or len(ext) > 5 or "?" in ext:
                ext = ".mp3"
            fname = h + ext
            fpath = os.path.join(lang_dir, fname)

            if not os.path.exists(fpath) or os.path.getsize(fpath) == 0:
                try:
                    data = fetch(it["url"])
                    with open(fpath, "wb") as f:
                        f.write(data)
                    print(f"[OK] {lang}: {it['title'][:60]}")
                except Exception as e:
                    print(f"[WARN] download failed {it['url']}: {e}", file=sys.stderr)
                    continue

            rel_audio = os.path.join("audio", lang, fname).replace(os.sep, "/")
            lang_manifest.append({
                "title": it["title"],
                "audio": rel_audio,
                "source": it["source"],
                "pub_date": it["pub_date"].isoformat(),
                "desc": it["desc"][:200],
                "guid": it["guid"],
            })

        manifest[lang] = lang_manifest

    # Prune audio files older than MAX_AGE_DAYS
    now = datetime.now(timezone.utc)
    if os.path.isdir(AUDIO_DIR):
        for lang in os.listdir(AUDIO_DIR):
            ldir = os.path.join(AUDIO_DIR, lang)
            if not os.path.isdir(ldir):
                continue
            for fname in os.listdir(ldir):
                fpath = os.path.join(ldir, fname)
                if not os.path.isfile(fpath):
                    continue
                mtime = datetime.fromtimestamp(os.path.getmtime(fpath), tz=timezone.utc)
                if now - mtime > timedelta(days=MAX_AGE_DAYS):
                    try:
                        os.remove(fpath)
                        print(f"[DEL] old: {fpath}")
                    except Exception as e:
                        print(f"[WARN] delete failed {fpath}: {e}", file=sys.stderr)

    with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    total = sum(len(v) for v in manifest.values())
    print(f"Manifest written -> {MANIFEST_FILE} ({total} episodes across {len(manifest)} languages)")


if __name__ == "__main__":
    main()
