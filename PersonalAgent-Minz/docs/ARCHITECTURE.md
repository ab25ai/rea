# PersonalAgent-Minz: Architecture

```
 Phone (PWA)  --HTTPS + bearer token-->  Server (FastAPI)  -->  Agent core  -->  LLM (Claude API)
 client/                                 server/main.py        agent/core.py        agent/llm.py
                                                                   |   ^
                                                                   v   |
                                                       Tool registry + Memory (SQLite)
                                                       agent/tools/   agent/memory.py
```

## Layers

| Layer      | Folder            | Job                                                                                |
| ---------- | ----------------- | ---------------------------------------------------------------------------------- |
| Client     | `client/`         | Installable web app (PWA) for your phone. Chat UI now; voice, notifications later. |
| API        | `server/`         | Auth + `/api/chat`. Thin: no agent logic lives here.                               |
| Agent core | `agent/core.py`   | The loop: message -> LLM -> tool calls -> result -> reply.                         |
| LLM        | `agent/llm.py`    | One file wrapping the model provider so it can be swapped.                         |
| Tools      | `agent/tools/`    | Everything the agent can _do_. One decorated Python function each.                 |
| Memory     | `agent/memory.py` | Conversation history + long-term notes in SQLite.                                  |

## Design decisions

- **PWA first, native later.** A web app installs to the phone home screen with no app store and the same backend serves a future native/Flutter/React Native client.
- **Tools are the extension point.** New capability = new function in `agent/tools/`. The core never changes.
- **Safety gate built in.** Tools flagged `risky=True` can't run until the user explicitly confirms in chat.
- **Server holds secrets.** API keys never touch the phone; the phone only holds your access token.
- **Testable offline.** The LLM is injectable, so the loop is tested with a fake model.

## Planned extension slots (to be shaped by your feature list)

- Integrations: calendar, email, messaging, files, smart home, web search
- Scheduler / background tasks and push notifications
- Voice in/out
- Multi-step planning and sub-agents
- Deployment (home PC + Tailscale, or a small cloud host)
