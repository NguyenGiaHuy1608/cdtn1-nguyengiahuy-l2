import os
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DB = ROOT / 'data' / 'warranty.db'

def connect_db():
    db_path = os.environ.get('DATABASE_PATH', str(DEFAULT_DB))
    if db_path != ':memory:':
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    return conn

def init_db(seed=True):
    conn = connect_db()
    try:
        schema = (ROOT / 'migrations' / '001_initial_schema.sql').read_text(encoding='utf-8')
        conn.executescript(schema)
        if seed:
            seed_sql = (ROOT / 'seeds' / '001_seed_demo.sql').read_text(encoding='utf-8')
            conn.executescript(seed_sql)
        conn.commit()
    finally:
        conn.close()
