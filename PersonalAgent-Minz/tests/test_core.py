"""Offline tests: a fake LLM drives the loop, no API key needed."""
import sys
from pathlib import Path
from types import SimpleNamespace as NS

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agent.config import Settings  # noqa: E402
from agent.core import Agent  # noqa: E402
from agent.memory import Memory  # noqa: E402
from agent.tools.base import ToolContext, ToolRegistry  # noqa: E402


class FakeLLM:
    def __init__(self):
        self.calls = 0

    def complete(self, system, messages, tools):
        self.calls += 1
        if self.calls == 1:
            return NS(stop_reason="tool_use", content=[
                NS(type="tool_use", id="t1", name="remember", input={"text": "likes tea"})])
        return NS(stop_reason="end_turn", content=[NS(type="text", text="Done!")])


def test_agent_loop_uses_tool_and_stores_note(tmp_path):
    mem = Memory(str(tmp_path / "t.db"))
    agent = Agent(Settings(db_path=str(tmp_path / "t.db")), llm=FakeLLM(), memory=mem)
    assert agent.run("s1", "remember I like tea") == "Done!"
    assert mem.recent_notes() == ["likes tea"]


def test_risky_tool_blocked_without_confirmation():
    reg = ToolRegistry()

    @reg.tool(name="danger", description="x", risky=True)
    def danger(ctx):
        return "ran"

    ctx = ToolContext()
    assert reg.execute("danger", {}, ctx).startswith("BLOCKED")
    assert reg.execute("danger", {"confirmed": True}, ctx) == "ran"
