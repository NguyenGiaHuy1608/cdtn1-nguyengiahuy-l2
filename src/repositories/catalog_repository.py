from src.db import connect_db

class CatalogRepository:
    """Read-only access to devices and issue categories used by the intake UI."""
    def list_devices(self):
        conn = connect_db()
        try:
            sql = """
                SELECT d.device_id, d.customer_id, c.full_name AS customer_name,
                       c.phone AS customer_phone, d.serial_no, d.purchase_date,
                       d.warranty_months,
                       date(d.purchase_date, '+' || d.warranty_months || ' months') AS warranty_expires_on,
                       CASE WHEN date('now') <= date(d.purchase_date, '+' || d.warranty_months || ' months')
                            THEN 'CON_HAN' ELSE 'HET_HAN' END AS warranty_status
                FROM device d JOIN customer c ON c.customer_id = d.customer_id
                ORDER BY d.device_id
            """
            return [dict(row) for row in conn.execute(sql)]
        finally:
            conn.close()

    def list_categories(self):
        conn = connect_db()
        try:
            return [dict(row) for row in conn.execute(
                'SELECT category_id, category_name, description FROM issue_category ORDER BY category_id'
            )]
        finally:
            conn.close()
