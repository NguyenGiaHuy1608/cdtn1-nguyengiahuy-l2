import re
from src.errors.app_error import AppError

def validate_phone(phone):
    phone = str(phone or '').strip()
    if not re.fullmatch(r'\d{10,11}', phone):
        raise AppError('DU_LIEU_KHONG_HOP_LE', 'Số điện thoại phải gồm 10–11 chữ số.', 400)
    return phone

def validate_customer(data):
    if not isinstance(data, dict):
        raise AppError('DU_LIEU_KHONG_HOP_LE', 'Dữ liệu gửi lên phải là JSON object.', 400)
    name = str(data.get('full_name', '')).strip()
    phone = str(data.get('phone', '')).strip()
    email = str(data.get('email', '')).strip() or None
    errors = []
    if not name:
        errors.append('full_name')
    if not re.fullmatch(r'\d{10,11}', phone):
        errors.append('phone')
    if errors:
        raise AppError('DU_LIEU_KHONG_HOP_LE', 'Dữ liệu không hợp lệ: ' + ', '.join(errors), 400)
    return {'full_name': name, 'phone': phone, 'email': email}
