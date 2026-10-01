# Software Requirements Specification

## 1. Giới thiệu và phạm vi

### 1.1 Giới thiệu

Hệ thống hỗ trợ nhân viên tiếp nhận trong việc tiếp nhận và phân loại yêu cầu bảo hành của khách hàng.

### 1.2 Workflow

L2 – Tiếp nhận và phân loại yêu cầu bảo hành.

### 1.3 Phạm vi

Nhân viên tiếp nhận tạo phiếu bảo hành, ghi nhận thông tin khách hàng, thiết bị và lỗi, sau đó phân loại yêu cầu bảo hành.

### 1.4 Ngoài phạm vi

Hệ thống hiện tại không thực hiện các chức năng sau:

- Sửa chữa thiết bị.
- Quản lý linh kiện.
- Thanh toán chi phí sửa chữa.
- Quản lý lương kỹ thuật viên.
- Báo cáo thống kê nâng cao.

### 1.5 Thuật ngữ

- Khách hàng: Người mang thiết bị đến yêu cầu bảo hành.
- Thiết bị: Sản phẩm của khách hàng cần được bảo hành.
- Phiếu bảo hành: Phiếu ghi nhận yêu cầu bảo hành của khách hàng.
- Nhóm lỗi: Nhóm dùng để phân loại lỗi của thiết bị.
- Nhân viên tiếp nhận: Người tiếp nhận yêu cầu bảo hành và tạo phiếu trên hệ thống.

---

## 2. Actor

### 2.1 Nhân viên tiếp nhận

Nhân viên tiếp nhận là người trực tiếp sử dụng hệ thống để:

- Tra cứu khách hàng.
- Ghi nhận thiết bị bảo hành.
- Tạo phiếu bảo hành.
- Ghi nhận lỗi thiết bị.
- Phân loại yêu cầu bảo hành.
- Xác định mức ưu tiên.
- Xem hạn xử lý.
- Xem danh sách phiếu bảo hành.

---

## 3. Functional Requirements

### FR01 – Tra cứu khách hàng

Hệ thống cho phép nhân viên tiếp nhận tìm kiếm khách hàng bằng số điện thoại.

### FR02 – Ghi nhận thiết bị bảo hành

Hệ thống cho phép nhân viên ghi nhận thông tin thiết bị cần bảo hành.

### FR03 – Tạo phiếu bảo hành

Hệ thống cho phép nhân viên tạo phiếu bảo hành mới với thông tin khách hàng, thiết bị và lỗi.

### FR04 – Ghi nhận lỗi thiết bị

Hệ thống cho phép nhân viên nhập mô tả lỗi của thiết bị.

### FR05 – Phân loại yêu cầu bảo hành

Hệ thống cho phép nhân viên phân loại yêu cầu bảo hành theo nhóm lỗi.

### FR06 – Xác định mức ưu tiên

Hệ thống cho phép nhân viên xác định mức ưu tiên của phiếu bảo hành.

### FR07 – Xem hạn xử lý phiếu

Hệ thống cho phép nhân viên xem hạn xử lý của phiếu bảo hành.

### FR08 – Xem danh sách phiếu bảo hành

Hệ thống cho phép nhân viên xem danh sách các phiếu bảo hành đã được tạo.

---

## 4. Non-functional Requirements

### NFR01 – Hiệu năng

Thời gian tra cứu khách hàng không vượt quá 2 giây với dữ liệu tối đa 1.000 khách hàng.

### NFR02 – Khả năng sử dụng

Một nhân viên mới có thể hoàn thành việc tạo một phiếu bảo hành hợp lệ trong thời gian không quá 3 phút.

### NFR03 – Độ tin cậy

100% phiếu bảo hành hợp lệ sau khi tạo phải được lưu thành công và không bị mất dữ liệu.

---

## 5. Business Rules

### BR01

Số điện thoại được sử dụng để tra cứu thông tin khách hàng.

### BR02

Một phiếu bảo hành phải có đầy đủ thông tin khách hàng, thiết bị và mô tả lỗi.

### BR03

Mỗi phiếu bảo hành phải được gán một nhóm lỗi.

### BR04

Phiếu bảo hành mới được tạo có trạng thái ban đầu là `NEW`.

### BR05

Mỗi phiếu bảo hành phải có một mã phiếu duy nhất.

### BR06

Hệ thống không cho phép tạo phiếu nếu thiếu thông tin bắt buộc.

### BR07

Hệ thống hiện tại không thực hiện chức năng sửa chữa thiết bị.

---

## 6. Traceability

| Functional Requirement | User Story | Use Case | MoSCoW |
|---|---|---|---|
| FR01 | US01 | UC01 | MUST |
| FR02 | US02 | UC02 | SHOULD |
| FR03 | US03 | UC03 | MUST |
| FR04 | US04 | UC04 | SHOULD |
| FR05 | US05 | UC05 | MUST |
| FR06 | US06 | UC06 | SHOULD |
| FR07 | US07 | UC08 | SHOULD |
| FR08 | US08 | UC07 | COULD |

---

## 7. User Stories

### US01 – Tra cứu khách hàng theo số điện thoại

Là nhân viên tiếp nhận, tôi muốn tìm khách hàng theo số điện thoại để nhanh chóng xác định thông tin khách hàng.

**Priority:** MUST

**Acceptance Criteria:**

- Given số điện thoại đã tồn tại, when nhân viên tìm kiếm, then hệ thống hiển thị thông tin khách hàng.
- Given số điện thoại không tồn tại, when nhân viên tìm kiếm, then hệ thống thông báo không tìm thấy khách hàng.

### US02 – Ghi nhận thiết bị bảo hành

Là nhân viên tiếp nhận, tôi muốn ghi nhận thông tin thiết bị để lưu thông tin thiết bị cần bảo hành.

**Priority:** SHOULD

### US03 – Tạo phiếu bảo hành

Là nhân viên tiếp nhận, tôi muốn tạo phiếu bảo hành để ghi nhận yêu cầu bảo hành của khách hàng.

**Priority:** MUST

**Acceptance Criteria:**

- Given thông tin khách hàng, thiết bị và lỗi hợp lệ, when nhân viên tạo phiếu, then hệ thống tạo phiếu có mã duy nhất.
- Given thiếu thông tin bắt buộc, when nhân viên tạo phiếu, then hệ thống không tạo phiếu và hiển thị thông báo lỗi.
- Given dữ liệu hợp lệ, when phiếu được tạo, then trạng thái ban đầu của phiếu là `NEW`.

### US04 – Ghi nhận lỗi thiết bị

Là nhân viên tiếp nhận, tôi muốn nhập mô tả lỗi để ghi nhận tình trạng thiết bị.

**Priority:** SHOULD

### US05 – Phân loại yêu cầu bảo hành

Là nhân viên tiếp nhận, tôi muốn phân loại yêu cầu theo nhóm lỗi để thuận tiện cho việc xử lý.

**Priority:** MUST

**Acceptance Criteria:**

- Given phiếu có mô tả lỗi, when nhân viên chọn nhóm lỗi, then hệ thống lưu nhóm lỗi cho phiếu.
- Given chưa chọn nhóm lỗi, when nhân viên xác nhận, then hệ thống yêu cầu phải chọn nhóm lỗi.

### US06 – Xác định mức ưu tiên

Là nhân viên tiếp nhận, tôi muốn xác định mức ưu tiên để hỗ trợ sắp xếp thứ tự xử lý.

**Priority:** SHOULD

### US07 – Xem hạn xử lý phiếu bảo hành

Là nhân viên tiếp nhận, tôi muốn xem hạn xử lý để theo dõi thời gian cần hoàn thành yêu cầu.

**Priority:** SHOULD

### US08 – Xem danh sách phiếu bảo hành

Là nhân viên tiếp nhận, tôi muốn xem danh sách các phiếu bảo hành đã tạo để theo dõi các yêu cầu đã tiếp nhận.

**Priority:** COULD

---

## 8. Đặc tả Use Case

### UC03 – Tạo phiếu bảo hành

**Actor:** Nhân viên tiếp nhận

**Mục tiêu:** Tạo phiếu bảo hành để ghi nhận yêu cầu bảo hành của khách hàng.

**Điều kiện trước:**

- Nhân viên tiếp nhận đã truy cập hệ thống.
- Thông tin khách hàng đã được xác định.
- Thông tin thiết bị đã được ghi nhận.

**Điều kiện sau:**

- Phiếu bảo hành được tạo và lưu thành công.
- Phiếu có mã phiếu duy nhất.
- Trạng thái ban đầu của phiếu là `NEW`.

### Luồng chính

| Bước | Thực hiện |
|---|---|
| 1 | Nhân viên chọn chức năng "Tạo phiếu bảo hành". |
| 2 | Hệ thống yêu cầu nhập số điện thoại khách hàng. |
| 3 | Nhân viên nhập số điện thoại khách hàng. |
| 4 | Hệ thống tra cứu và hiển thị thông tin khách hàng. |
| 5 | Nhân viên chọn thiết bị bảo hành. |
| 6 | Nhân viên nhập mô tả lỗi của thiết bị. |
| 7 | Nhân viên chọn nhóm lỗi để phân loại yêu cầu. |
| 8 | Nhân viên chọn mức ưu tiên cho phiếu. |
| 9 | Nhân viên xác nhận tạo phiếu. |
| 10 | Hệ thống kiểm tra các thông tin bắt buộc. |
| 11 | Hệ thống tạo mã phiếu bảo hành duy nhất. |
| 12 | Hệ thống lưu phiếu với trạng thái `NEW`. |
| 13 | Hệ thống thông báo tạo phiếu thành công. |

### Luồng ngoại lệ

**E1 – Không tìm thấy khách hàng tại bước 4**

- Hệ thống thông báo không tìm thấy khách hàng.
- Nhân viên nhập lại số điện thoại hoặc hủy thao tác.

**E2 – Thiếu mô tả lỗi tại bước 6**

- Hệ thống thông báo mô tả lỗi là thông tin bắt buộc.
- Hệ thống không cho phép tiếp tục tạo phiếu.
- Nhân viên bổ sung mô tả lỗi.

**E3 – Chưa phân loại yêu cầu tại bước 7**

- Hệ thống yêu cầu phải chọn nhóm lỗi.
- Hệ thống không cho phép tạo phiếu cho đến khi có nhóm lỗi.

**E4 – Dữ liệu không hợp lệ tại bước 10**

- Hệ thống hiển thị thông báo lỗi tương ứng.
- Phiếu chưa được tạo.
- Nhân viên chỉnh sửa dữ liệu và xác nhận lại.

---

## 9. API Contract

### API01 – Tra cứu khách hàng

**User Story:** US01

**Method:** GET

**Path:**


/api/customers?phone={phone}

## 10. Công nghệ sử dụng

- Python
- Flask
- SQLite

## 11. Trạng thái

Đang xây dựng.

