# API Contract — L2 Tiếp nhận và phân loại yêu cầu bảo hành (Sprint 1)

Base URL local: `http://127.0.0.1:5000`

## Health
- `GET /api/health`
- `200`: `{"status":"ok"}`

## Khách hàng
- `GET /api/customers`: trả danh sách khách hàng.
- `GET /api/customers?phone={phone}`: tra cứu theo số điện thoại.
  - `200`: trả hồ sơ khách hàng.
  - `400`: số điện thoại sai định dạng (10–11 chữ số).
  - `404`: không tìm thấy khách hàng.
- `POST /api/customers`: tạo hồ sơ khách hàng.
  - Request: `full_name`, `phone`, `email` (không bắt buộc).
  - `201`: tạo thành công.
  - `400`: dữ liệu không hợp lệ.
  - `409`: số điện thoại đã tồn tại.

## Phiếu bảo hành
- `GET /api/tickets`: trả danh sách phiếu cùng thông tin khách hàng, thiết bị và nhóm lỗi.
- `POST /api/tickets`: tạo phiếu bảo hành.
  - Request: `customer_id`, `device_id`, `category_id`, `issue_desc`, `priority`.
  - `201`: tạo thành công; trả `ticket_code` và trạng thái `MOI`.
  - `400`: thiếu trường hoặc dữ liệu không hợp lệ.
  - `404`: khách hàng/thiết bị không tồn tại.
  - `409`: thiết bị đã có phiếu đang mở.
  - `422`: thiết bị hết hạn bảo hành, thiết bị không thuộc khách hàng hoặc nhóm lỗi không hợp lệ.

## Quy tắc kiểm tra
| Trường/điều kiện | Kiểm tra |
|---|---|
| `phone` | 10–11 chữ số |
| `customer_id`, `device_id`, `category_id` | Số nguyên hợp lệ |
| `issue_desc` | Bắt buộc, tối thiểu 10 ký tự |
| `priority` | `CAO`, `TRUNG_BINH`, `THAP` |
| Thiết bị | Phải thuộc khách hàng đã chọn và còn hạn bảo hành |
| Phiếu mở | Không tạo phiếu mở trùng cho cùng thiết bị |

## Traceability
- Tra cứu khách hàng theo SĐT → FR01 / US01 / UC01.
- Tạo hồ sơ khách hàng → hỗ trợ bước tiếp nhận dữ liệu.
- Tạo phiếu → FR03 / US03 / UC03.
- Gán nhóm lỗi và mức ưu tiên khi tạo phiếu → FR05–FR06 / US05–US06 / UC05–UC06.
- Xem danh sách và hạn xử lý → FR07 / US07 / UC07.
