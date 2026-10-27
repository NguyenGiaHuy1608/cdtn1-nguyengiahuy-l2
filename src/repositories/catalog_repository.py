from src.db import connect_db


class CatalogRepository:
    """Access devices and issue categories used by the intake UI."""

    def get_customer(self, customer_id):
        conn = connect_db()
        try:
            row = conn.execute(
                "SELECT customer_id, full_name, phone FROM customer WHERE customer_id = ?",
                (customer_id,),
            ).fetchone()
            return dict(row) if row else None
        finally:
            conn.close()

    def create_device(self, data):
        conn = connect_db()
        try:
            cur = conn.execute(
                """
                INSERT INTO device
                    (customer_id, device_type, serial_no, purchase_date, warranty_months, brand, model)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (data["customer_id"], data["device_type"], data["serial_no"], data["purchase_date"],
                 data["warranty_months"], data["brand"], data["model"]),
            )
            conn.commit()
            row = conn.execute(
                """
                SELECT d.device_id, d.customer_id, c.full_name AS customer_name,
                       c.phone AS customer_phone, d.device_type, d.brand, d.model, d.serial_no,
                       d.purchase_date, d.warranty_months,
                       date(d.purchase_date, '+' || d.warranty_months || ' months') AS warranty_expires_on,
                       CASE WHEN date('now') <= date(d.purchase_date, '+' || d.warranty_months || ' months')
                            THEN 'CON_HAN' ELSE 'HET_HAN' END AS warranty_status
                FROM device d JOIN customer c ON c.customer_id = d.customer_id
                WHERE d.device_id = ?
                """, (cur.lastrowid,),
            ).fetchone()
            return dict(row)
        finally:
            conn.close()

    def list_devices(self):
        conn = connect_db()
        try:
            sql = """
                SELECT
                    d.device_id,
                    d.customer_id,
                    c.full_name AS customer_name,
                    c.phone AS customer_phone,
                    d.device_type,
                    d.brand,
                    d.model,
                    d.serial_no,
                    d.purchase_date,
                    d.warranty_months,
                    date(
                        d.purchase_date,
                        '+' || d.warranty_months || ' months'
                    ) AS warranty_expires_on,
                    CASE
                        WHEN date('now') <= date(
                            d.purchase_date,
                            '+' || d.warranty_months || ' months'
                        ) THEN 'CON_HAN'
                        ELSE 'HET_HAN'
                    END AS warranty_status
                FROM device d
                JOIN customer c ON c.customer_id = d.customer_id
                ORDER BY d.device_id
            """
            return [dict(row) for row in conn.execute(sql)]
        finally:
            conn.close()

    def list_categories(self):
        conn = connect_db()
        try:
            return [
                dict(row)
                for row in conn.execute(
                    """
                    SELECT category_id, category_name, description
                    FROM issue_category
                    ORDER BY category_id
                    """
                )
            ]
        finally:
            conn.close()
