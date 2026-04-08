# CaddyfileEditor

A web-based editor for Caddyfile, built with Bun.

## Install dependencies

```bash
bun install
```

## Run

```bash
# Minimal
ACCESS_TOKEN=yourtoken bun run dev

# With all options
ACCESS_TOKEN=yourtoken \
  PORT=8080 \
  CADDYFILE_PATH=/etc/caddy/Caddyfile \
  CADDY_RELOAD_CMD="caddy reload --config /etc/caddy/Caddyfile" \
  CORS_ORIGIN=https://yourdomain.com \
  bun run dev
```

## Build

```bash
# Linux x64
bun run build:linux

# macOS Apple Silicon
bun run build:mac
```

## Run compiled binary

```bash
# Minimal
ACCESS_TOKEN=yourtoken ./dist/FlycastCaddyfileService

# With all options
ACCESS_TOKEN=yourtoken \
  PORT=8080 \
  CADDYFILE_PATH=/etc/caddy/Caddyfile \
  CADDY_RELOAD_CMD="caddy reload --config /etc/caddy/Caddyfile" \
  CORS_ORIGIN=https://yourdomain.com \
  ./dist/FlycastCaddyfileService
```

## Run as a systemd service (Debian)

Copy the binary to `/usr/local/bin`:

```bash
sudo cp dist/FlycastCaddyfileService /usr/local/bin/FlycastCaddyfileService
sudo chmod +x /usr/local/bin/FlycastCaddyfileService
```

Copy and edit the service file:

```bash
sudo cp caddyfile-editor.service /etc/systemd/system/caddyfile-editor.service
sudo nano /etc/systemd/system/caddyfile-editor.service
```

Update the `ACCESS_TOKEN` value, then enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable caddyfile-editor
sudo systemctl start caddyfile-editor

# Check status
sudo systemctl status caddyfile-editor
```

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ACCESS_TOKEN` | Yes | — | API access token |
| `PORT` | No | `3030` | Listening port |
| `CADDYFILE_PATH` | No | `/etc/caddy/Caddyfile` | Path to Caddyfile |
| `CADDY_RELOAD_CMD` | No | `caddy reload --config <path>` | Command to reload Caddy |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin |
