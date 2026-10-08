-- L2 - Tiếp nhận và phân loại yêu cầu bảo hành
-- Track: Software Engineering
-- PostgreSQL DDL skeleton theo Buổi 5

CREATE TABLE customer (
    customer_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE device (
    device_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customer(customer_id),
    serial_no VARCHAR(80) NOT NULL UNIQUE,
    purchase_date DATE NOT NULL,
    warranty_months INT NOT NULL CHECK (warranty_months > 0)
);

CREATE TABLE issue_category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE ticket (
    ticket_id BIGSERIAL PRIMARY KEY,
    ticket_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES customer(customer_id),
    device_id BIGINT NOT NULL REFERENCES device(device_id),
    category_id INT REFERENCES issue_category(category_id),
    issue_desc TEXT NOT NULL CHECK (length(issue_desc) >= 10),
    priority VARCHAR(12) NOT NULL CHECK (priority IN ('CAO','TRUNG_BINH','THAP')),
    status VARCHAR(20) NOT NULL DEFAULT 'MOI',
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ,
    CONSTRAINT chk_closed_after_received
      CHECK (closed_at IS NULL OR closed_at >= received_at)
);

CREATE TABLE ticket_status_log (
    log_id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES ticket(ticket_id),
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    changed_by BIGINT NOT NULL
);

-- Indexes are tied to concrete queries/NFRs.
CREATE INDEX idx_customer_phone
ON customer(phone);

CREATE INDEX idx_ticket_status_due
ON ticket(status, due_date);

CREATE INDEX idx_ticket_log
ON ticket_status_log(ticket_id, changed_at);

-- Traceability:
-- idx_customer_phone -> US01
-- idx_ticket_status_due -> US07 / NFR01
-- ticket_status_log -> US07 (history of status)
