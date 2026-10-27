from datetime import date
import sqlite3

from src.errors.app_error import AppError
from src.repositories.catalog_repository import CatalogRepository


class CatalogService:
    def __init__(self, repo=None):
        self.repo = repo or CatalogRepository()

    def list_devices(self, customer_id=None):
        devices = self.repo.list_devices()
        if customer_id is None:
            return devices
        try:
            customer_id = int(customer_id)
        except (TypeError, ValueError):
            raise AppError("KHACH_HANG_KHONG_HOP_LE", "Mã khách hàng không hợp lệ.", 400)
        return [device for device in devices if device["customer_id"] == customer_id]

    def list_categories(self):
        return self.repo.list_categories()

    def create_device(self, payload):
        if not isinstance(payload, dict):
            raise AppError("DU_LIEU_KHONG_HOP_LE", "Dữ liệu gửi lên phải là JSON object.", 400)
        try:
            customer_id = int(payload.get("customer_id"))
        except (TypeError, ValueError):
            raise AppError("KHACH_HANG_KHONG_HOP_LE", "Vui lòng chọn khách hàng hợp lệ.", 400)

        if not self.repo.get_customer(customer_id):
            raise AppError("KHONG_TIM_THAY_KHACH_HANG", "Không tìm thấy khách hàng.", 404)

        device_type = str(payload.get("device_type") or "").strip()
        brand = str(payload.get("brand") or "").strip()
        model = str(payload.get("model") or "").strip()
        serial_no = str(payload.get("serial_no") or "").strip()
        purchase_date = str(payload.get("purchase_date") or "").strip()
        try:
            warranty_months = int(payload.get("warranty_months"))
        except (TypeError, ValueError):
            warranty_months = 0

        if device_type not in {"Điện thoại", "Máy tính bảng", "Laptop", "Khác"}:
            raise AppError("LOAI_THIET_BI_KHONG_HOP_LE", "Vui lòng chọn loại thiết bị hợp lệ.", 400)
        if not brand or not model or not serial_no:
            raise AppError("DU_LIEU_KHONG_HOP_LE", "Hãng, model và số serial là bắt buộc.", 400)
        if len(serial_no) > 100:
            raise AppError("DU_LIEU_KHONG_HOP_LE", "Số serial không được vượt quá 100 ký tự.", 400)
        try:
            parsed_date = date.fromisoformat(purchase_date)
            if parsed_date > date.today():
                raise ValueError
        except ValueError:
            raise AppError("NGAY_MUA_KHONG_HOP_LE", "Ngày mua phải hợp lệ và không ở tương lai.", 400)
        if not 1 <= warranty_months <= 120:
            raise AppError("THOI_HAN_BAO_HANH_KHONG_HOP_LE", "Thời hạn bảo hành phải từ 1 đến 120 tháng.", 400)

        try:
            return self.repo.create_device({
                "customer_id": customer_id, "device_type": device_type, "brand": brand, "model": model,
                "serial_no": serial_no, "purchase_date": purchase_date,
                "warranty_months": warranty_months,
            })
        except sqlite3.IntegrityError as exc:
            raise AppError("SERIAL_DA_TON_TAI", "Số serial đã tồn tại trong hệ thống.", 409) from exc
