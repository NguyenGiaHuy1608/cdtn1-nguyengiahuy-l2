from src.db import connect_db

class TicketRepository:
    def list(self):
        conn=connect_db()
        try:
            sql = 'SELECT t.*, c.full_name, c.phone, d.serial_no, ic.category_name FROM ticket t JOIN customer c ON c.customer_id=t.customer_id JOIN device d ON d.device_id=t.device_id LEFT JOIN issue_category ic ON ic.category_id=t.category_id ORDER BY t.ticket_id DESC'
            rows=conn.execute(sql).fetchall()
            return [dict(r) for r in rows]
        finally: conn.close()
    def find_open_by_serial(self, serial_no):
        conn=connect_db()
        try:
            row=conn.execute("SELECT t.* FROM ticket t JOIN device d ON d.device_id=t.device_id WHERE d.serial_no=? AND t.status NOT IN ('HOAN_TAT','HUY')",(serial_no,)).fetchone()
            return dict(row) if row else None
        finally: conn.close()
    def get_device(self, device_id):
        conn=connect_db()
        try:
            row=conn.execute('SELECT * FROM device WHERE device_id=?',(device_id,)).fetchone()
            return dict(row) if row else None
        finally: conn.close()
    def get_customer(self, customer_id):
        conn=connect_db()
        try:
            row=conn.execute('SELECT * FROM customer WHERE customer_id=?',(customer_id,)).fetchone()
            return dict(row) if row else None
        finally: conn.close()
    def category_exists(self, category_id):
        conn=connect_db()
        try: return conn.execute('SELECT 1 FROM issue_category WHERE category_id=?',(category_id,)).fetchone() is not None
        finally: conn.close()
    def create(self, data, ticket_code, due_date):
        conn=connect_db()
        try:
            sql = "INSERT INTO ticket(ticket_code,customer_id,device_id,category_id,issue_desc,priority,status,due_date) VALUES(?,?,?,?,?,?,'MOI',?)"
            cur=conn.execute(sql,(ticket_code,data['customer_id'],data['device_id'],data['category_id'],data['issue_desc'],data['priority'],due_date))
            ticket_id=cur.lastrowid
            conn.execute("INSERT INTO ticket_status_log(ticket_id,from_status,to_status,changed_by) VALUES(?,NULL,'MOI',1)",(ticket_id,))
            conn.commit(); row=conn.execute('SELECT * FROM ticket WHERE ticket_id=?',(ticket_id,)).fetchone()
            return dict(row)
        finally: conn.close()
