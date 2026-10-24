# auto-cut-ads

CLI tool to fetch audio/video files, inspect for ads, remove them, and generate a clean version.

The removal process cuts out ad segments and inserts a message saying "skipping X seconds/minutes of ads".

## Features

- Supports audio and video files (mp3, mp4, m4a, wav, mkv, etc.)
- Auto-detects ad segments (using silence detection and customizable patterns)
- Cuts out ad segments and inserts skip messages
- Works in Docker/Podman containers

## Usage

```bash
auto-cut-ads input.mp4 -o output.mp4
```

## Docker

```bash
docker build -t auto-cut-ads .
docker run -v $(pwd):/data auto-cut-ads /data/input.mp4 -o /data/output.mp4
```
