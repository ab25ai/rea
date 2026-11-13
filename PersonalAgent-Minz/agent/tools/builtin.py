"""Starter tools. Add real capabilities here (or in new files) as features are defined."""
from datetime import datetime

from .base import ToolRegistry

registry = ToolRegistry()


@registry.tool(
    name="get_current_time",
    description="Get the current local date and time.",
)
def get_current_time(ctx) -> str:
    return datetime.now().astimezone().strftime("%A %d %B %Y, %H:%M %Z")


@registry.tool(
    name="remember",
    description="Save a durable fact or preference about the user for future conversations.",
    properties={"text": {"type": "string", "description": "The fact to remember."}},
    required=["text"],
)
def remember(ctx, text: str) -> str:
    ctx.memory.add_note(text)
    return "Saved."


@registry.tool(
    name="recall",
    description="Search saved notes about the user. Leave query empty to list recent notes.",
    properties={"query": {"type": "string", "description": "Keyword to search for."}},
)
def recall(ctx, query: str = "") -> str:
    notes = ctx.memory.search_notes(query) if query else ctx.memory.recent_notes()
    return "\n".join(f"- {n}" for n in notes) or "No matching notes."
