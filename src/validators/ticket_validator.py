from src.errors.app_error import AppError

ALLOWED_PRIORITIES = {'CAO', 'TRUNG_BINH', 'THAP'}
def validate_ticket(data):
    if not isinstance(data, dict):
        raise AppError('DU_LIEU_KHONG_HOP_LE', 'Dữ liệu gửi lên phải là JSON object.', 400)
    required = ['customer_id', 'device_id', 'issue_desc', 'category_id', 'priority']
    missing = [key for key in required if data.get(key) in (None, '')]
    if missing:
        raise AppError('DU_LIEU_KHONG_HOP_LE', 'Thiếu trường bắt buộc: ' + ', '.join(missing), 400)
    try:
        customer_id = int(data['customer_id']); device_id = int(data['device_id']); category_id = int(data['category_id'])
    except (TypeError, ValueError):
        raise AppError('DU_LIEU_KHONG_HOP_LE', 'customer_id, device_id và category_id phải là số nguyên.', 400)
    issue_desc = str(data['issue_desc']).strip()
    priority = str(data['priority']).strip().upper()
    if len(issue_desc) < 10:
        raise AppError('DU_LIEU_KHONG_HOP_LE', 'issue_desc phải có ít nhất 10 ký tự.', 400)
    if priority not in ALLOWED_PRIORITIES:
        raise AppError('UU_TIEN_KHONG_HOP_LE', 'priority chỉ nhận CAO, TRUNG_BINH hoặc THAP.', 400)
    return {'customer_id': customer_id, 'device_id': device_id, 'category_id': category_id, 'issue_desc': issue_desc, 'priority': priority}
