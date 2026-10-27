import os
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DB = ROOT / "data" / "warranty.db"


def connect_db():
    db_path = os.environ.get("DATABASE_PATH", str(DEFAULT_DB))
    if db_path != ":memory:":
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _ensure_device_columns(conn):
    """Add device display fields to databases created by older project versions."""
    columns = {
        row["name"]
        for row in conn.execute("PRAGMA table_info(device)").fetchall()
    }
    if "device_type" not in columns:
        conn.execute(
            "ALTER TABLE device ADD COLUMN device_type TEXT NOT NULL DEFAULT 'Điện thoại'"
        )
    if "brand" not in columns:
        conn.execute(
            "ALTER TABLE device ADD COLUMN brand TEXT NOT NULL DEFAULT 'Khác'"
        )
    if "model" not in columns:
        conn.execute(
            "ALTER TABLE device ADD COLUMN model TEXT NOT NULL DEFAULT 'Chưa cập nhật'"
        )


def init_db(seed=True):
    conn = connect_db()
    try:
        schema = (ROOT / "migrations" / "001_initial_schema.sql").read_text(
            encoding="utf-8"
        )
        conn.executescript(schema)
        _ensure_device_columns(conn)

        if seed:
            seed_sql = (ROOT / "seeds" / "001_seed_demo.sql").read_text(
                encoding="utf-8"
            )
            conn.executescript(seed_sql)

        conn.commit()
    finally:
        conn.close()
