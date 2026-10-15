import sqlite3
from src.errors.app_error import AppError
from src.repositories.customer_repository import CustomerRepository
from src.validators.customer_validator import validate_customer

class CustomerService:
    def __init__(self, repo=None): self.repo=repo or CustomerRepository()
    def list(self): return self.repo.list()
    def find_by_phone(self, phone):
        from src.validators.customer_validator import validate_phone
        normalized = validate_phone(phone)
        customer = self.repo.find_by_phone(normalized)
        if not customer:
            raise AppError('KHONG_TIM_THAY_KHACH_HANG', 'Không tìm thấy khách hàng theo số điện thoại.', 404)
        return customer
    def create(self, payload):
        data=validate_customer(payload)
        if self.repo.find_by_phone(data['phone']):
            raise AppError('KHACH_HANG_DA_TON_TAI', 'Số điện thoại đã có hồ sơ khách hàng.', 409)
        try: return self.repo.create(data)
        except sqlite3.IntegrityError as exc: raise AppError('DU_LIEU_TRUNG', 'Số điện thoại đã tồn tại.', 409) from exc
