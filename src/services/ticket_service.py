from datetime import date, datetime, timedelta
from src.errors.app_error import AppError
from src.repositories.ticket_repository import TicketRepository
from src.validators.ticket_validator import validate_ticket

class TicketService:
    def __init__(self, repo=None): self.repo=repo or TicketRepository()
    def list(self): return self.repo.list()
    def get_by_id(self, ticket_id): return self.repo.get_by_id(ticket_id)
    def create(self, payload):
        data=validate_ticket(payload)
        customer=self.repo.get_customer(data['customer_id'])
        if not customer: raise AppError('KHACH_KHONG_TON_TAI','Khách hàng không tồn tại.',404)
        device=self.repo.get_device(data['device_id'])
        if not device: raise AppError('THIET_BI_KHONG_TON_TAI','Thiết bị không tồn tại.',404)
        if device['customer_id'] != data['customer_id']:
            raise AppError('THIET_BI_KHONG_THUOC_KHACH','Thiết bị không thuộc khách hàng đã chọn.',422)
        if not self.repo.category_exists(data['category_id']):
            raise AppError('NHOM_LOI_KHONG_TON_TAI','Nhóm lỗi không tồn tại.',422)
        # Business rule 1: device must still be under warranty.
        purchased=date.fromisoformat(device['purchase_date'])
        months=int(device['warranty_months'])
        expiry_year=purchased.year+(purchased.month-1+months)//12
        expiry_month=(purchased.month-1+months)%12+1
        import calendar
        expiry_day=min(purchased.day, calendar.monthrange(expiry_year,expiry_month)[1])
        expiry=date(expiry_year,expiry_month,expiry_day)
        if date.today() > expiry:
            raise AppError('BAO_HANH_HET_HAN','Thiết bị đã hết hạn bảo hành.',422)
        # Business rule 2: one open ticket per device.
        open_ticket=self.repo.find_open_by_serial(device['serial_no'])
        if open_ticket:
            raise AppError('PHIEU_DANG_MO',f"Thiết bị đã có phiếu {open_ticket['ticket_code']} đang xử lý.",409)
        ticket_code='BH-'+datetime.now().strftime('%y%m%d%H%M%S%f')[-16:]
        due=(datetime.now()+timedelta(days=3)).isoformat(timespec='seconds')
        return self.repo.create(data,ticket_code,due)

    def update(self, ticket_id, payload):
        if not isinstance(payload, dict):
            raise AppError('DU_LIEU_KHONG_HOP_LE', 'Dữ liệu gửi lên phải là JSON object.', 400)
        current = self.repo.get_by_id(ticket_id)
        if not current:
            raise AppError('PHIEU_KHONG_TON_TAI', 'Không tìm thấy phiếu bảo hành.', 404)
        issue_desc = str(payload.get('issue_desc', current['issue_desc']) or '').strip()
        priority = str(payload.get('priority', current['priority']) or '').strip().upper()
        if len(issue_desc) < 10:
            raise AppError('DU_LIEU_KHONG_HOP_LE', 'issue_desc phải có ít nhất 10 ký tự.', 400)
        if priority not in {'CAO', 'TRUNG_BINH', 'THAP'}:
            raise AppError('UU_TIEN_KHONG_HOP_LE', 'priority chỉ nhận CAO, TRUNG_BINH hoặc THAP.', 400)
        return self.repo.update(ticket_id, {'issue_desc': issue_desc, 'priority': priority})

    def delete(self, ticket_id):
        if not self.repo.get_by_id(ticket_id):
            raise AppError('PHIEU_KHONG_TON_TAI', 'Không tìm thấy phiếu bảo hành.', 404)
        self.repo.delete(ticket_id)
        return True
