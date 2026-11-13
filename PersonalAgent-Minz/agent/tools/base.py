"""Tool framework.

A tool is a plain Python function + a JSON schema. Register it with
@registry.tool(...) and the agent can call it.

Safety: tools marked risky=True get an extra required `confirmed` argument.
The model must ask the user first and only pass confirmed=true after they agree.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class ToolContext:
    """Things a tool may need (memory, settings, ...)."""
    memory: Any = None
    settings: Any = None


@dataclass
class Tool:
    name: str
    description: str
    parameters: dict
    func: Callable[..., str]
    risky: bool = False

    def to_api(self) -> dict:
        schema = {
            "type": "object",
            "properties": dict(self.parameters.get("properties", {})),
            "required": list(self.parameters.get("required", [])),
        }
        if self.risky:
            schema["properties"]["confirmed"] = {
                "type": "boolean",
                "description": "Set true ONLY after the user has explicitly approved this action.",
            }
            schema["required"].append("confirmed")
        return {"name": self.name, "description": self.description, "input_schema": schema}


@dataclass
class ToolRegistry:
    tools: dict[str, Tool] = field(default_factory=dict)

    def tool(self, name: str, description: str, properties: dict | None = None,
             required: list[str] | None = None, risky: bool = False):
        def decorator(func):
            self.tools[name] = Tool(
                name=name, description=description,
                parameters={"properties": properties or {}, "required": required or []},
                func=func, risky=risky,
            )
            return func
        return decorator

    def api_schemas(self) -> list[dict]:
        return [t.to_api() for t in self.tools.values()]

    def execute(self, name: str, args: dict, ctx: ToolContext) -> str:
        tool = self.tools.get(name)
        if tool is None:
            return f"Error: unknown tool '{name}'."
        args = dict(args)
        confirmed = args.pop("confirmed", False)
        if tool.risky and not confirmed:
            return ("BLOCKED: this action needs the user's explicit approval. "
                    "Describe what you are about to do, ask them to confirm, "
                    "then call again with confirmed=true.")
        try:
            return str(tool.func(ctx, **args))
        except Exception as e:  # never crash the loop on a tool error
            return f"Error running {name}: {type(e).__name__}: {e}"
