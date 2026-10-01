# API Contract – L2 Tiếp nhận và phân loại yêu cầu bảo hành

## 1. Phạm vi

API Contract mô tả các API phục vụ workflow L2 – Tiếp nhận và phân loại yêu cầu bảo hành.

Actor sử dụng API: Nhân viên tiếp nhận.

Các endpoint được truy vết trực tiếp với các User Story mức MUST trong SRS.

---

## 2. API01 – Tra cứu khách hàng

### User Story

US01 – Tra cứu khách hàng theo số điện thoại.

### Method

GET

### Path

`/api/customers?phone={phone}`

### Mục đích

Cho phép nhân viên tiếp nhận tra cứu thông tin khách hàng bằng số điện thoại.

### Request

Không có request body.

Ví dụ:

```text
GET /api/customers?phone=0901234567