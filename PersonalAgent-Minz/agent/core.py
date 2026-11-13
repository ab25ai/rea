"""The agent loop: user message -> (LLM <-> tools)* -> final reply."""
from .config import Settings, get_settings
from .llm import LLM
from .memory import Memory
from .tools.base import ToolContext, ToolRegistry
from .tools.builtin import registry as default_registry

SYSTEM_PROMPT = """You are Minz, a personal assistant that lives on the user's phone.
Be concise and practical. Use tools when they help; never invent tool results.
Before any irreversible or externally visible action, ask the user to confirm.
Known notes about the user:
{notes}
"""


def _serialize(content) -> list[dict]:
    out = []
    for b in content:
        if b.type == "text":
            out.append({"type": "text", "text": b.text})
        elif b.type == "tool_use":
            out.append({"type": "tool_use", "id": b.id, "name": b.name, "input": b.input})
    return out


class Agent:
    def __init__(self, settings: Settings | None = None, llm=None,
                 memory: Memory | None = None, registry: ToolRegistry | None = None):
        self.settings = settings or get_settings()
        self.memory = memory or Memory(self.settings.db_path)
        self.registry = registry or default_registry
        self.llm = llm or LLM(self.settings)
        self.ctx = ToolContext(memory=self.memory, settings=self.settings)

    def _system(self) -> str:
        notes = "\n".join(f"- {n}" for n in self.memory.recent_notes(20)) or "(none yet)"
        return SYSTEM_PROMPT.format(notes=notes)

    def run(self, session_id: str, user_text: str) -> str:
        self.memory.add_message(session_id, "user", user_text)
        messages = self.memory.history(session_id)

        for _ in range(self.settings.max_steps):
            resp = self.llm.complete(self._system(), messages, self.registry.api_schemas())
            blocks = _serialize(resp.content)
            messages.append({"role": "assistant", "content": blocks})
            self.memory.add_message(session_id, "assistant", blocks)

            if resp.stop_reason != "tool_use":
                return "".join(b["text"] for b in blocks if b["type"] == "text").strip()

            results = []
            for b in blocks:
                if b["type"] == "tool_use":
                    out = self.registry.execute(b["name"], b["input"], self.ctx)
                    results.append({"type": "tool_result", "tool_use_id": b["id"], "content": out})
            messages.append({"role": "user", "content": results})
            self.memory.add_message(session_id, "user", results)

        return "I hit my step limit before finishing. Please try rephrasing or breaking the task up."
