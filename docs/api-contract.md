# API Contract – Hệ thống quản lý bảo hành

**Base URL:** `http://127.0.0.1:5000`

## 1. Authentication and Health

### GET /api/health

- **Authentication:** Không yêu cầu token.
- **Description:** Kiểm tra trạng thái hoạt động của API.
- **Success response:** `200 OK`.

Response:

```json
{
  "status": "ok"
}
```

### POST /api/login

- **Authentication:** Không yêu cầu token.
- **Description:** Đăng nhập để nhận Bearer token sử dụng cho các API nghiệp vụ.

Request body:

```json
{
  "username": "<username>",
  "password": "<password>"
}
```

Success response:

- `200 OK`
- Trả về token có thời hạn 8 giờ.

Response structure:

```json
{
  "data": {
    "token": "<signed-token>",
    "token_type": "Bearer",
    "expires_in": 28800
  }
}
```

Error response:

- `401 THONG_TIN_DANG_NHAP_SAI`: Tên đăng nhập hoặc mật khẩu không đúng.

## 2. Authentication for Business APIs

Tất cả API nghiệp vụ, ngoại trừ `/api/health` và `/api/login`, yêu cầu header:

```text
Authorization: Bearer <token>
```

Token không hợp lệ hoặc hết hạn trả về:

- `401 TOKEN_KHONG_HOP_LE`

## 3. Customer APIs

### GET /api/customers

- **Authentication:** Required.
- **Description:** Trả về danh sách khách hàng.

Query parameter tùy chọn:

- `phone`: Tra cứu khách hàng theo số điện thoại.

Khi sử dụng `phone`:

- `200`: Trả về thông tin khách hàng.
- `400`: Số điện thoại không hợp lệ.
- `404 KHONG_TIM_THAY_KHACH_HANG`: Không tìm thấy khách hàng.

### POST /api/customers

- **Authentication:** Required.
- **Description:** Tạo hồ sơ khách hàng.

Request body:

```json
{
  "full_name": "Tên khách hàng",
  "phone": "0901234567",
  "email": "example@email.com"
}
```

Responses:

- `201`: Tạo thành công.
- `400`: Dữ liệu không hợp lệ.
- `409 KHACH_HANG_DA_TON_TAI`: Số điện thoại đã tồn tại.

### PUT /api/customers/{customer_id}

- **Authentication:** Required.
- **Description:** Cập nhật thông tin khách hàng.

Request body sử dụng cùng các trường dữ liệu của chức năng tạo khách hàng.

Responses:

- `200`: Cập nhật thành công.
- `400`: Dữ liệu không hợp lệ.
- `404 KHONG_TIM_THAY_KHACH_HANG`: Không tìm thấy khách hàng.
- `409 KHACH_HANG_DA_TON_TAI`: Số điện thoại đã được sử dụng bởi khách hàng khác.

### DELETE /api/customers/{customer_id}

- **Authentication:** Required.
- **Description:** Xóa khách hàng.

Responses:

- `200`: Xóa thành công.
- `404 KHONG_TIM_THAY_KHACH_HANG`: Không tìm thấy khách hàng.
- `409 KHACH_HANG_DANG_DUOC_SU_DUNG`: Không thể xóa khách hàng đang có thiết bị liên kết.

## 4. Device APIs

### GET /api/devices

- **Authentication:** Required.
- **Description:** Trả về danh sách thiết bị.

Query parameter tùy chọn:

- `customer_id`: Chỉ trả về các thiết bị thuộc khách hàng được chọn.

Responses:

- `200`: Trả về danh sách thiết bị.
- `400 KHACH_HANG_KHONG_HOP_LE`: `customer_id` không phải mã khách hàng hợp lệ.

### POST /api/devices

- **Authentication:** Required.
- **Description:** Thêm thiết bị cho khách hàng.

Request body:

```json
{
  "customer_id": 1,
  "device_type": "Laptop",
  "brand": "Example Brand",
  "model": "Example Model",
  "serial_no": "SERIAL-001",
  "purchase_date": "2026-01-01",
  "warranty_months": 12
}
```

Rules:

- `customer_id` phải là khách hàng tồn tại.
- `device_type` chỉ nhận: `Điện thoại`, `Máy tính bảng`, `Laptop`, `Khác`.
- `brand`, `model` và `serial_no` là bắt buộc.
- `serial_no` không được vượt quá 100 ký tự.
- `purchase_date` phải là ngày hợp lệ và không nằm trong tương lai.
- `warranty_months` phải từ 1 đến 120.
- `serial_no` không được trùng trong hệ thống.

Responses:

- `201`: Tạo thiết bị thành công.
- `400`: Dữ liệu không hợp lệ.
- `404 KHONG_TIM_THAY_KHACH_HANG`: Không tìm thấy khách hàng.
- `409 SERIAL_DA_TON_TAI`: Số serial đã tồn tại.

## 5. Issue Category API

### GET /api/categories

- **Authentication:** Required.
- **Description:** Trả về danh sách nhóm lỗi.
- **Success response:** `200 OK`.

## 6. Warranty Ticket APIs

### GET /api/tickets

- **Authentication:** Required.
- **Description:** Trả về danh sách phiếu bảo hành.

### GET /api/tickets/{ticket_id}

- **Authentication:** Required.
- **Description:** Xem chi tiết phiếu bảo hành.

Responses:

- `200`: Trả về thông tin phiếu.
- `404 PHIEU_KHONG_TON_TAI`: Không tìm thấy phiếu bảo hành.

### POST /api/tickets

- **Authentication:** Required.
- **Description:** Tạo phiếu bảo hành.

Request body:

```json
{
  "customer_id": 1,
  "device_id": 1,
  "category_id": 1,
  "issue_desc": "Mô tả lỗi có ít nhất 10 ký tự",
  "priority": "CAO"
}
```

Business rules:

1. Khách hàng phải tồn tại.
2. Thiết bị phải tồn tại.
3. Thiết bị phải thuộc khách hàng đã chọn.
4. Nhóm lỗi phải tồn tại.
5. Thiết bị phải còn hạn bảo hành.
6. Một thiết bị chỉ được có một phiếu đang mở.

Responses:

- `201`: Tạo phiếu thành công.
- `400`: Dữ liệu không hợp lệ.
- `404`: Khách hàng hoặc thiết bị không tồn tại.
- `409 PHIEU_DANG_MO`: Thiết bị đã có phiếu đang mở.
- `422`: Thiết bị không thuộc khách hàng, nhóm lỗi không tồn tại hoặc thiết bị đã hết hạn bảo hành.

### PUT /api/tickets/{ticket_id}

- **Authentication:** Required.
- **Description:** Cập nhật mô tả lỗi hoặc mức ưu tiên của phiếu.

Request body:

```json
{
  "issue_desc": "Mô tả lỗi mới có ít nhất 10 ký tự",
  "priority": "TRUNG_BINH"
}
```

Rules:

- `issue_desc` phải có ít nhất 10 ký tự.
- `priority` chỉ nhận `CAO`, `TRUNG_BINH` hoặc `THAP`.

Responses:

- `200`: Cập nhật thành công.
- `400 DU_LIEU_KHONG_HOP_LE`: Dữ liệu hoặc mô tả lỗi không hợp lệ.
- `400 UU_TIEN_KHONG_HOP_LE`: Mức ưu tiên không hợp lệ.
- `404 PHIEU_KHONG_TON_TAI`: Không tìm thấy phiếu.

### DELETE /api/tickets/{ticket_id}

- **Authentication:** Required.
- **Description:** Xóa phiếu bảo hành.

Success response:

```json
{
  "data": {
    "deleted": true,
    "ticket_id": 1
  }
}
```

Error response:

- `404 PHIEU_KHONG_TON_TAI`: Không tìm thấy phiếu bảo hành.

## 7. Common Error Response

Các API xử lý lỗi nghiệp vụ sử dụng cấu trúc:

```json
{
  "error": "ERROR_CODE",
  "message": "Mô tả lỗi"
}
```

## 8. Main Validation and Business Rules

| Điều kiện | Quy tắc |
|---|---|
| Số điện thoại | Phải hợp lệ theo kiểm tra của Customer Validator |
| Mô tả lỗi | Tối thiểu 10 ký tự |
| Mức ưu tiên | `CAO`, `TRUNG_BINH`, `THAP` |
| Thiết bị | Phải thuộc khách hàng đã chọn và còn hạn bảo hành |
| Phiếu đang mở | Không tạo thêm phiếu mở cho cùng một thiết bị |
| Loại thiết bị | Chỉ nhận 4 loại thiết bị được hệ thống hỗ trợ |
| Ngày mua | Không được nằm trong tương lai |
| Thời hạn bảo hành | Từ 1 đến 120 tháng |
| Số serial | Không được trùng và tối đa 100 ký tự |