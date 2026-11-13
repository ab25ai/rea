# PersonalAgent-Minz

A personal AI agent you talk to from your phone. Foundation only: chat, tool-calling loop, memory, auth.

## Setup (Windows PowerShell)

```powershell
cd "C:\My Code\ReverseEngineerAnything\PersonalAgent-Minz"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env      # then edit .env: add ANTHROPIC_API_KEY and a long random AGENT_API_TOKEN
pytest                      # offline tests, no key needed
uvicorn server.main:app --host 0.0.0.0 --port 8000
```

## Use from your phone

1. Phone and PC on the same Wi-Fi: open `http://<your-PC-LAN-IP>:8000` on the phone (find the IP with `ipconfig`).
2. Tap **Set token**, paste your `AGENT_API_TOKEN`, then chat.
3. Use "Add to Home Screen" to install it like an app.
4. For access away from home, use a private tunnel such as Tailscale (recommended) rather than exposing the port publicly.

## Adding a capability

Add a function in `agent/tools/builtin.py` (or a new file) with `@registry.tool(...)`. Mark anything with side effects `risky=True`.

See `docs/ARCHITECTURE.md` for the full picture.
