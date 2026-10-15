-- Canonical SQLite schema for the L2 Sprint 1 prototype.
-- Kept in sync with migrations/001_initial_schema.sql.
-- SQLite schema for the local prototype. Table/column names match docs/srs.md and docs/erd.drawio.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customer (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE CHECK (length(phone) BETWEEN 10 AND 11 AND phone NOT GLOB '*[^0-9]*'),
    email TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS device (
    device_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    serial_no TEXT NOT NULL UNIQUE,
    purchase_date TEXT NOT NULL,
    warranty_months INTEGER NOT NULL CHECK (warranty_months > 0)
);

CREATE TABLE IF NOT EXISTS issue_category (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS ticket (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_code TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    device_id INTEGER NOT NULL REFERENCES device(device_id),
    category_id INTEGER REFERENCES issue_category(category_id),
    issue_desc TEXT NOT NULL CHECK (length(trim(issue_desc)) >= 10),
    priority TEXT NOT NULL CHECK (priority IN ('CAO','TRUNG_BINH','THAP')),
    status TEXT NOT NULL DEFAULT 'MOI',
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TEXT NOT NULL,
    closed_at TEXT,
    CHECK (closed_at IS NULL OR closed_at >= received_at)
);

CREATE TABLE IF NOT EXISTS ticket_status_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL REFERENCES ticket(ticket_id),
    from_status TEXT,
    to_status TEXT NOT NULL,
    changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_customer_phone ON customer(phone);
CREATE INDEX IF NOT EXISTS idx_ticket_status_due ON ticket(status, due_date);
CREATE INDEX IF NOT EXISTS idx_ticket_log ON ticket_status_log(ticket_id, changed_at);
