# API Contract — L2 Tiếp nhận và phân loại yêu cầu bảo hành

## API01 — Tra cứu khách hàng
- US01 — MUST
- `GET /api/customers?phone={phone}`
- 200: khách hàng
- 400: SĐT sai định dạng
- 404: không tìm thấy

## API02 — Tạo phiếu
- US03 — MUST
- `POST /api/tickets`
- Request: `customer_id`, `device_id`, `issue_desc`, `category_id`, `priority`
- 201: `{ "ticket_code": "BH-2026-00125", "status": "MOI" }`
- 400: dữ liệu không hợp lệ
- 404: khách hàng/thiết bị không tồn tại
- 409: ticket_code xung đột
- 422: thiết bị hết hạn bảo hành

## API03 — Phân loại
- US05 — MUST
- `PUT /api/tickets/{id}/classification`
- Request: `category_id`
- 200: cập nhật thành công
- 400: category không hợp lệ
- 404: không tìm thấy ticket

## Validation
| Trường | Kiểm tra |
|---|---|
| phone | 10–11 chữ số |
| customer_id/device_id | số nguyên > 0 |
| issue_desc | bắt buộc, >= 10 ký tự |
| category_id | nếu có thì > 0 |
| priority | CAO / TRUNG_BINH / THAP |

## Traceability
API01 → US01; API02 → US03; API03 → US05.
