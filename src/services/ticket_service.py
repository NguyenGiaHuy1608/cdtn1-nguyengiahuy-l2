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
