"""Persistence layer (SQLite).

Two kinds of memory:
  * conversation history  - short-term, per session
  * notes                 - long-term facts the agent chooses to remember
"""
import json
import sqlite3
import time
from pathlib import Path


class Memory:
    def __init__(self, db_path: str):
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                ts REAL NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, id);
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                ts REAL NOT NULL
            );
            """
        )
        self.conn.commit()

    # ---- conversation history ----
    def add_message(self, session_id: str, role: str, content) -> None:
        self.conn.execute(
            "INSERT INTO messages (session_id, role, content, ts) VALUES (?,?,?,?)",
            (session_id, role, json.dumps(content), time.time()),
        )
        self.conn.commit()

    def history(self, session_id: str, limit: int = 40) -> list[dict]:
        rows = self.conn.execute(
            "SELECT role, content FROM messages WHERE session_id=? ORDER BY id DESC LIMIT ?",
            (session_id, limit),
        ).fetchall()
        msgs = [{"role": r, "content": json.loads(c)} for r, c in reversed(rows)]
        # The API requires the first message to be from the user (plain text) and
        # tool_result blocks to follow their tool_use; trim any dangling start.
        while msgs and not (msgs[0]["role"] == "user" and isinstance(msgs[0]["content"], str)):
            msgs.pop(0)
        return msgs

    # ---- long-term notes ----
    def add_note(self, text: str) -> int:
        cur = self.conn.execute("INSERT INTO notes (text, ts) VALUES (?,?)", (text, time.time()))
        self.conn.commit()
        return cur.lastrowid

    def search_notes(self, query: str, limit: int = 10) -> list[str]:
        rows = self.conn.execute(
            "SELECT text FROM notes WHERE text LIKE ? ORDER BY id DESC LIMIT ?",
            (f"%{query}%", limit),
        ).fetchall()
        return [r[0] for r in rows]

    def recent_notes(self, limit: int = 10) -> list[str]:
        rows = self.conn.execute(
            "SELECT text FROM notes ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
        return [r[0] for r in rows]
