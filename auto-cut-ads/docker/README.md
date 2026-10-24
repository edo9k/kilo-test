# Running with Docker/Podman

## Build

```bash
docker build -t auto-cut-ads .
# or
podman build -t auto-cut-ads .
```

## Run

```bash
docker run --rm -v $(pwd):/data auto-cut-ads input.mp4 -o output.mp4
# or
podman run --rm -v $(pwd):/data auto-cut-ads input.mp4 -o output.mp4
```

## Using docker-compose

```bash
docker-compose run --rm auto-cut-ads input.mp4 -o output.mp4
```
