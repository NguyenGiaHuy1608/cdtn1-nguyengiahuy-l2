# L2 — Tiếp nhận và phân loại yêu cầu bảo hành

**Sinh viên:** Nguyễn Gia Huy · **MSSV:** 2374802010181 · **Track:** Software Engineering (SE)  
**Repo:** https://github.com/NguyenGiaHuy1608/cdtn1-nguyengiahuy-l2

## 1. Phạm vi

Sprint 2 mở rộng prototype Sprint 1 thành luồng tiếp nhận bảo hành end-to-end: tra cứu/tạo khách hàng, chọn thiết bị và nhóm lỗi từ API, tạo phiếu, xem danh sách phiếu và xem chi tiết phiếu. Dữ liệu được lưu trong SQLite. Phân công kỹ thuật viên, quy trình sửa chữa, thanh toán, thông báo tự động và quản lý kho vẫn ngoài phạm vi.

## 2. Cấu trúc repo

```text
.
├── app.py
├── requirements.txt
├── src/
│   ├── routes/          # REST endpoints
│   ├── services/        # business rules
│   ├── repositories/    # database access
│   ├── validators/      # input validation
│   └── errors/          # application errors
├── templates/            # HTML shell and screen structure
├── static/
│   ├── api/              # API client and per-domain API modules
│   ├── app.js            # UI state and screen rendering; no fetch()
│   └── style.css
├── migrations/            # SQLite schema migration
├── seeds/                 # demo data
├── data/                  # local SQLite database (not committed)
├── tests/                 # business/API tests
└── docs/                  # design and validation notes
```

The course handout's `src/api/client.js` separation is adapted to `static/api/client.js` because this project serves a plain JavaScript frontend from Flask's `/static` directory rather than using a frontend build system. HTTP calls are centralized in `static/api/client.js` and `*.api.js`; UI code does not call `fetch()` directly.

## 3. Môi trường và chạy ứng dụng

Python 3.11+ được khuyến nghị. Các lệnh dưới đây được chạy từ thư mục gốc repository. Mỗi dòng là một bước riêng; dùng CMD trên Windows.

```cmd
python -m venv .venv
.venv\Scripts\activate.bat
python -m pip install -r requirements.txt
python app.py
```

Mở `http://127.0.0.1:5000` trong trình duyệt. Đăng nhập demo mặc định bằng `demo` / `demo123`. Trên macOS/Linux, thay lệnh kích hoạt môi trường bằng `source .venv/bin/activate`. Có thể đặt `DEMO_USERNAME`, `DEMO_PASSWORD` và `SECRET_KEY` trong biến môi trường để đổi thông tin demo; không dùng giá trị mặc định cho môi trường thật.

Ứng dụng tự tạo schema và nạp dữ liệu demo khi khởi động nếu database chưa có dữ liệu seed. Đường dẫn database mặc định là `data/warranty.db`. Có thể đặt biến môi trường `DATABASE_PATH` để dùng một SQLite file khác khi kiểm thử.

## 4. Kiểm thử

Chạy từ thư mục gốc, sau khi đã kích hoạt virtual environment:

```cmd
python -m unittest discover -s tests -v
```

Test bao gồm luồng tạo phiếu thành công, tra cứu khách hàng, từ chối số điện thoại sai, từ chối thiết bị hết hạn bảo hành, chặn phiếu mở trùng, danh sách thiết bị/nhóm lỗi, chi tiết phiếu không tồn tại và giá trị biên mô tả lỗi ngắn hơn 10 ký tự.

## 5. Màn hình và trạng thái dữ liệu

- **Tiếp nhận:** tra cứu/tạo khách hàng; chọn khách hàng, thiết bị, nhóm lỗi và mức ưu tiên; tạo phiếu bảo hành.
- **Danh sách phiếu:** hiển thị bảng có mã phiếu, khách hàng, thiết bị, ưu tiên, trạng thái và hạn xử lý.
- **Chi tiết phiếu:** xem khách hàng, thiết bị, nhóm lỗi, mô tả, thời điểm tiếp nhận và hạn xử lý.
- **Dữ liệu nền:** xem danh sách khách hàng, thiết bị cùng trạng thái bảo hành và nhóm lỗi.
- Các khu vực tải dữ liệu có trạng thái loading, empty và error; trạng thái lỗi có nút thử lại. Footer kiểm tra `/api/health`.

## 6. API contract

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/api/health` | Kiểm tra API (public) |
| POST | `/api/login` | Đăng nhập, nhận bearer token có thời hạn 8 giờ |
| GET | `/api/customers` | Danh sách khách hàng |
| GET | `/api/customers?phone=...` | Tra cứu khách hàng |
| POST | `/api/customers` | Tạo khách hàng |
| GET | `/api/devices` | Danh sách thiết bị và trạng thái bảo hành |
| GET | `/api/categories` | Danh sách nhóm lỗi |
| GET | `/api/tickets` | Danh sách phiếu |
| GET | `/api/tickets/<ticket_id>` | Chi tiết phiếu |
| POST | `/api/tickets` | Tạo phiếu, kiểm tra quyền sở hữu thiết bị và hạn bảo hành |

JSON responses use the `data` field on success and `error`/`message` on application errors. Ngoại trừ health-check và login, các API nghiệp vụ yêu cầu `Authorization: Bearer <token>`. Khi nhận HTTP 401, API client xóa token trong session và quay lại màn hình đăng nhập.

## 7. Nguồn sự thật và quyết định thiết kế

- SRS: `docs/srs.md`
- API contract: `docs/api-contract.md`
- Schema: `db/schema.sql`, `migrations/001_initial_schema.sql`
- Seed demo: `seeds/001_seed_demo.sql`
- Các phần ngoài phạm vi Sprint 2 được ghi nhận trong `docs/buoi10-validation.md`.

Đăng nhập dùng bearer token ký bằng `itsdangerous` (phụ thuộc Flask), thời hạn 8 giờ; đây là cơ chế demo, chưa thay thế hệ thống tài khoản/role production. SQLite được giữ lại để có thể chạy cục bộ và tái lập test. UI vanilla JavaScript được giữ nguyên thay vì thêm framework/build tool mới; phần gọi API đã tách riêng theo miền nghiệp vụ để sau này có thể thay frontend mà không thay đổi contract backend.

## 8. Luồng demo đầu-cuối

1. Mở màn hình **Tiếp nhận** và tra cứu khách hàng theo số điện thoại.
2. Nếu là khách mới, tạo hồ sơ khách hàng.
3. Chọn khách hàng, thiết bị còn bảo hành, nhóm lỗi, mức ưu tiên và nhập mô tả từ 10 ký tự.
4. Tạo phiếu; ứng dụng chuyển đến màn hình chi tiết phiếu mới tạo.
5. Mở **Danh sách phiếu** để xác nhận phiếu mới xuất hiện; mở **Dữ liệu nền** để kiểm tra thiết bị và nhóm lỗi.
6. Chụp ảnh luồng chạy thực tế và lưu thành `docs/buoi10-demo.png` trước khi nộp.
