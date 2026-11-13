"""LLM provider wrapper. Swap this file to change model provider."""
from anthropic import Anthropic

from .config import Settings


class LLM:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = Anthropic(api_key=settings.api_key)

    def complete(self, system: str, messages: list[dict], tools: list[dict]):
        kwargs = dict(
            model=self.settings.model,
            max_tokens=self.settings.max_tokens,
            system=system,
            messages=messages,
        )
        if tools:
            kwargs["tools"] = tools
        return self.client.messages.create(**kwargs)
