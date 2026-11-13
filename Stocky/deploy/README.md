# Stocky LAN deployment

Stocky is a dependency-free Node.js web app. The Docker image contains only the app source; personal CSVs and `.env.local` are excluded by `.dockerignore`.

## Server prerequisites

- Docker Desktop with Linux containers and Compose running on the Windows 10 Pro server.
- Caddy attached to an external Docker network named `server_proxy`.
- Reserve `192.168.0.192` in the router, or update the Caddy route if the server IP changes.
- For Kuku, Ollama must be running on the server host with the configured model installed. The default container-to-host address is `http://host.docker.internal:11434`.

## Deploy

1. Copy the contents of this project to a server folder, for example `C:\\MyCode\\Setup_Local_Server\\apps\\Stocky`. Do not copy `.env.local` or personal holdings CSVs. Keep those CSVs private for a one-time import in your browser if needed.
2. Confirm the existing shared Docker network really is named `server_proxy`: `docker network ls`. If the server still uses another name, update this Compose file's external network name to match the network Caddy actually uses before starting Stocky.
3. Add the block from `Caddyfile.stocky` to the server's existing Caddyfile. Caddy must bind only to the server LAN IP; do not add router port forwarding.
4. From the Stocky server folder run `docker compose up -d --build`.
5. Reload Caddy with `docker compose restart caddy` from the server workspace, then open `http://192.168.0.192` on the home Wi-Fi.

## Data and privacy

Holdings, imported fundamentals and watchlists are currently stored in browser `localStorage`, not in the container. They survive container rebuilds in that same browser and origin; the first visit at the server IP is a new origin, so import your CSV there once. No server-side portfolio database or Docker data volume is needed or created. Each browser keeps its own private local copy. The deployment image intentionally excludes personal holdings CSV files.

Kuku chat history is currently page-memory only. Kuku can reach Ollama through `KUKU_OLLAMA_URL`; the app remains available if Ollama is offline, but chat responses will not work. Ollama Web Search and Whisper transcription remain optional; configure their environment values only if those services are available.

This package prepares Stocky for the server but does not deploy it remotely. The server workspace must receive these files before Compose can build the image.
