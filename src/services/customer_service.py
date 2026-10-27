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

    def update(self, customer_id, payload):
        if not self.repo.get(customer_id):
            raise AppError('KHONG_TIM_THAY_KHACH_HANG', 'Không tìm thấy khách hàng.', 404)
        data = validate_customer(payload)
        existing = self.repo.find_by_phone(data['phone'])
        if existing and existing['customer_id'] != customer_id:
            raise AppError('KHACH_HANG_DA_TON_TAI', 'Số điện thoại đã được sử dụng bởi khách hàng khác.', 409)
        try:
            return self.repo.update(customer_id, data)
        except sqlite3.IntegrityError as exc:
            raise AppError('DU_LIEU_TRUNG', 'Số điện thoại đã tồn tại.', 409) from exc

    def delete(self, customer_id):
        result = self.repo.delete(customer_id)
        if result is False:
            raise AppError('KHONG_TIM_THAY_KHACH_HANG', 'Không tìm thấy khách hàng.', 404)
        if result is None:
            raise AppError('KHACH_HANG_DANG_DUOC_SU_DUNG', 'Không thể xóa khách hàng đã có thiết bị liên kết.', 409)
        return True
