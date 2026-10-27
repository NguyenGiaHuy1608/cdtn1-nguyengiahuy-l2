from src.db import connect_db

class CustomerRepository:
    def list(self):
        conn=connect_db()
        try: return [dict(r) for r in conn.execute('SELECT * FROM customer ORDER BY customer_id DESC')]
        finally: conn.close()
    def get(self, customer_id):
        conn=connect_db()
        try:
            row=conn.execute('SELECT * FROM customer WHERE customer_id=?',(customer_id,)).fetchone()
            return dict(row) if row else None
        finally: conn.close()
    def find_by_phone(self, phone):
        conn=connect_db()
        try:
            row=conn.execute('SELECT * FROM customer WHERE phone=?',(phone,)).fetchone()
            return dict(row) if row else None
        finally: conn.close()
    def create(self, data):
        conn=connect_db()
        try:
            cur=conn.execute('INSERT INTO customer(full_name,phone,email) VALUES(?,?,?)',(data['full_name'],data['phone'],data.get('email')))
            conn.commit(); row=conn.execute('SELECT * FROM customer WHERE customer_id=?',(cur.lastrowid,)).fetchone()
            return dict(row)
        finally: conn.close()

    def update(self, customer_id, data):
        conn = connect_db()
        try:
            conn.execute('UPDATE customer SET full_name=?, phone=?, email=? WHERE customer_id=?',
                         (data['full_name'], data['phone'], data.get('email'), customer_id))
            conn.commit()
            row = conn.execute('SELECT * FROM customer WHERE customer_id=?', (customer_id,)).fetchone()
            return dict(row) if row else None
        finally:
            conn.close()

    def delete(self, customer_id):
        conn = connect_db()
        try:
            row = conn.execute('SELECT customer_id FROM customer WHERE customer_id=?', (customer_id,)).fetchone()
            if not row:
                return False
            linked = conn.execute('SELECT 1 FROM device WHERE customer_id=? LIMIT 1', (customer_id,)).fetchone()
            if linked:
                return None
            conn.execute('DELETE FROM customer WHERE customer_id=?', (customer_id,))
            conn.commit()
            return True
        finally:
            conn.close()
