# Bài tập 2 — Tiếp nhận và phân loại yêu cầu bảo hành

**Sinh viên:** Nguyễn Gia Huy
**MSSV:** 2374802010181
**Track:** Software Engineering (SE)
**Repository:** https://github.com/NguyenGiaHuy1608/cdtn1-nguyengiahuy-l2
**Phiên bản bài tập:** `v0.2`

> Đây là prototype học thuật chạy cục bộ. Tài khoản demo và mô hình AI chỉ dùng để trình diễn, không dùng làm hệ thống bảo hành production.

## 1. Tổng quan

Ứng dụng hỗ trợ tiếp nhận yêu cầu bảo hành điện thoại: tra cứu/tạo khách hàng, chọn thiết bị và nhóm lỗi, tạo phiếu, xem danh sách/chi tiết phiếu, và xem dữ liệu nền. Backend dùng Flask; dữ liệu nghiệp vụ được lưu trong SQLite tại `data/warranty.db` theo mặc định.

Bài tập 2 bổ sung ba phần:

- **SE:** module backend tách lớp theo `routes → services → repositories → SQLite`, có kiểm tra dữ liệu đầu vào và quy tắc nghiệp vụ.
- **DA:** pipeline ba pha `load → validate → normalize/export` cùng năm nhóm kiểm tra chất lượng dữ liệu.
- **AI:** script huấn luyện mô hình phân loại cơ sở Multinomial Naive Bayes tự cài bằng thư viện chuẩn Python. Mô hình minh họa phân loại mô tả thành `MAN_HINH`, `NGUON`, `PIN`; không tự động quyết định bảo hành.

## 2. Yêu cầu môi trường

- Python 3.11 trở lên được khuyến nghị.
- Windows PowerShell hoặc CMD; macOS/Linux cũng có thể chạy bằng lệnh tương đương.
- Không cần cài SQLite Server hoặc mở một dịch vụ database riêng. Python có sẵn module `sqlite3`; file `data/warranty.db` được ứng dụng tạo khi khởi động nếu chưa có.
- `DB Browser for SQLite` là tùy chọn, chỉ cần nếu muốn xem bảng dữ liệu bằng giao diện đồ họa.

## 3. Cài đặt và chạy ứng dụng

Mở terminal tại thư mục gốc repository (thư mục có `app.py` và `requirements.txt`). Trên Windows PowerShell chạy từng lệnh:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python app.py
```

Nếu PowerShell chặn kích hoạt virtual environment, có thể dùng CMD và lệnh `.venv\Scripts\activate.bat`, hoặc chạy trực tiếp `.venv\Scripts\python.exe -m pip install -r requirements.txt` rồi `.venv\Scripts\python.exe app.py`.

Mở `http://127.0.0.1:5000`.  Giữ terminal đang chạy để website tiếp tục hoạt động; nhấn `Ctrl+C` để dừng Flask.

### Cấu hình môi trường

`.env.example` là mẫu an toàn được commit. Có thể sao chép thành `.env` để cấu hình cục bộ:

## 4. SQLite: vị trí và kiểm tra kết nối

- Đường dẫn mặc định: `data/warranty.db`.
- Kết nối được mở bởi `connect_db()` trong `src/db.py`.
- `init_db()` áp dụng schema trong `migrations/001_initial_schema.sql`, bổ sung cột tương thích cho database phiên bản cũ và nạp dữ liệu demo từ `seeds/001_seed_demo.sql`.
- Seed được thiết kế để có thể chạy lại mà không nhân đôi các bản ghi demo.
- Không commit file database cục bộ (`*.db`, `*.sqlite`, `*.sqlite3`). Khi người khác clone source, ứng dụng sẽ tạo database theo schema/seed khi chạy.

Để xác nhận file database và danh sách bảng, chạy trong terminal tại thư mục gốc:

```powershell
python -c "from src.db import init_db, connect_db; init_db(); c=connect_db(); print('Database:', c.execute('PRAGMA database_list').fetchone()['file']); print('Tables:', [r['name'] for r in c.execute(\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\")]); c.close()"
```

Nếu muốn xem dữ liệu bằng DB Browser for SQLite, mở file `data/warranty.db`, vào **Browse Data**, rồi chọn bảng `customer`, `device`, `ticket` hoặc `ticket_status_log`. Đây là công cụ xem dữ liệu tùy chọn, không phải thành phần bắt buộc để website kết nối SQLite.

## 5. Pipeline dữ liệu và mô hình AI cơ sở

Chạy hai lệnh sau theo đúng thứ tự:

```powershell
python scripts/data_pipeline.py
python scripts/train_baseline.py
```

Pipeline đọc `data/issue_training.csv`, thực hiện ba pha và ghi `data/issue_training_clean.csv`. Năm nhóm kiểm tra chất lượng:

1. Q1 — dataset không được rỗng.
2. Q2 — phải có các cột `text` và `label`.
3. Q3 — mô tả không được rỗng.
4. Q4 — nhãn phải thuộc tập cho phép `MAN_HINH`, `NGUON`, `PIN`.
5. Q5 — không có mô tả trùng sau chuẩn hóa.

Script huấn luyện đọc dữ liệu đã làm sạch và ghi mô hình vào `models/issue_classifier.json`. Terminal sẽ in kết quả pipeline/huấn luyện và một số dự đoán mẫu. Đây là baseline minh họa, không phải mô hình đã được đánh giá cho sử dụng thực tế.

## 6. Chạy kiểm thử

Cài dependencies trước nếu đây là môi trường mới:

```powershell
python -m pip install -r requirements.txt
python -m unittest discover -s tests -v
```

Bộ test gồm kiểm thử pipeline/mô hình và kiểm thử API/CRUD, xác thực, dữ liệu hợp lệ/không hợp lệ, biên mô tả, quy tắc bảo hành và lưu dữ liệu. Chỉ báo cáo **PASS** nếu lệnh chạy trên máy nộp bài kết thúc với `OK` và không có `ERROR`/`FAILED`. Nếu có lỗi, lưu lại traceback và sửa trước khi chụp ảnh minh chứng.

## 7. Luồng demo giao diện

1. Chạy `python app.py` và mở `http://127.0.0.1:5000`.
2. Đăng nhập bằng tài khoản demo.
3. Tra cứu khách hàng theo số điện thoại hoặc tạo khách hàng mới.
4. Chọn khách hàng, sau đó chọn thiết bị theo **hãng/model và serial**; tình trạng bảo hành là thông tin riêng, không phải tên thiết bị.
5. Chọn nhóm lỗi, mức ưu tiên và nhập mô tả hợp lệ (tối thiểu 10 ký tự); tạo phiếu.
6. Mở danh sách phiếu và trang chi tiết để xác nhận phiếu mới đã được lưu.
7. Mở phần dữ liệu nền để kiểm tra khách hàng, thiết bị và nhóm lỗi.

## 8. Hợp đồng API chính

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/api/health` | Kiểm tra tình trạng API, không cần token |
| `POST` | `/api/login` | Đăng nhập và nhận bearer token |
| `GET/POST` | `/api/customers` | Liệt kê/tạo khách hàng |
| `GET` | `/api/customers?phone=...` | Tra cứu khách hàng theo số điện thoại |
| `PUT/DELETE` | `/api/customers/<customer_id>` | Cập nhật/xóa khách hàng theo quy tắc nghiệp vụ |
| `GET` | `/api/devices` | Danh sách thiết bị và trạng thái bảo hành |
| `GET` | `/api/categories` | Danh sách nhóm lỗi |
| `GET/POST` | `/api/tickets` | Liệt kê/tạo phiếu bảo hành |
| `GET/PUT/DELETE` | `/api/tickets/<ticket_id>` | Xem/cập nhật/xóa phiếu theo quy tắc nghiệp vụ |

Trừ health check và login, API nghiệp vụ yêu cầu `Authorization: Bearer <token>`. Chi tiết request/response xem `docs/api-contract.md`.

## 9. Cấu trúc repository

```text
app.py                       # entry point Flask
requirements.txt             # dependencies Python
.env.example                 # mẫu cấu hình; không chứa secret thật
src/routes/                  # HTTP routes/API
src/services/                # quy tắc nghiệp vụ
src/repositories/            # truy cập SQLite
src/validators/              # kiểm tra dữ liệu đầu vào
migrations/                  # schema SQLite
seeds/                       # dữ liệu demo có thể chạy lại
data/issue_training.csv      # dữ liệu huấn luyện mẫu
scripts/data_pipeline.py     # pipeline dữ liệu ba pha
scripts/train_baseline.py    # huấn luyện mô hình cơ sở
models/issue_classifier.json # mô hình baseline đã sinh
static/api/                  # API client và module theo miền
static/app.js                # trạng thái/render giao diện
static/style.css             # giao diện
tests/                       # kiểm thử tự động
docs/                        # SRS, API contract, kiến trúc và ghi chú thiết kế
```

## 10. Ba trạng thái giao diện cần minh chứng (Mục 5 PDF)

Chụp **ảnh thật từ ứng dụng đang chạy**, không dùng ảnh minh họa:

- **Loading:** ảnh khi một khu vực đang tải dữ liệu (nếu trạng thái xuất hiện đủ lâu).
- **Empty:** khu vực danh sách hiển thị trạng thái không có dữ liệu.
- **Error:** thông báo lỗi khi API không truy cập được, kèm thao tác thử lại nếu có.

Có thể tái hiện bằng database kiểm thử riêng hoặc tạm ngắt API trong môi trường test. Không xóa database đang chứa dữ liệu cần giữ. Lưu ảnh vào `docs/report-assets/` với tên `muc5-loading.png`, `muc5-empty.png`, `muc5-error.png`.

## 11. Tài liệu thiết kế và khai báo AI

- `docs/srs.md` — yêu cầu phần mềm.
- `docs/api-contract.md` — hợp đồng API.
- `docs/architecture-thuc-te.md` và `docs/architecture.drawio` — kiến trúc.
- `docs/thay-doi-thiet-ke.md` — thay đổi so với BT1.
- `docs/ai-disclosure.md` — khai báo sử dụng công cụ AI.
- `docs/ai-declaration.md` — tài liệu khai báo AI bổ sung.

### Quản lý khách hàng, thiết bị và phiếu bảo hành

- Trong mục **Dữ liệu nền**, người dùng có thể sửa thông tin khách hàng hoặc xóa hồ sơ chưa có thiết bị liên kết. Hồ sơ đã có thiết bị được bảo vệ để tránh vi phạm liên kết dữ liệu.
- Trong **Danh sách phiếu**, có thao tác xem, sửa mô tả sự cố/mức ưu tiên và xóa phiếu bảo hành.
- Trong **Chi tiết phiếu**, nhấn **Xuất phiếu bảo hành** để mở bản in A4; tại hộp thoại in của trình duyệt, chọn **Save as PDF** để lưu thành tệp PDF hoặc chọn máy in. Nút chỉ hoạt động sau khi tải được chi tiết một phiếu.
- Thông báo thành công khi tạo khách hàng, thiết bị hoặc phiếu bảo hành tự ẩn sau khoảng 3,5 giây; thông báo lỗi vẫn được giữ lại để người dùng đọc và xử lý.
- Tại màn hình **Tiếp nhận**, chọn khách hàng rồi nhấn **+ Thêm thiết bị** để mở biểu mẫu đăng ký loại thiết bị (điện thoại, máy tính bảng, laptop hoặc khác), hãng, model, serial/IMEI, ngày mua và thời hạn bảo hành.
- Thiết bị mới được lưu vào SQLite và liên kết với khách hàng đã chọn. Danh sách thiết bị chỉ hiển thị thiết bị của khách hàng đang chọn; API kiểm tra liên kết khách hàng-thiết bị khi tạo phiếu.
- Khi nâng cấp database cũ, ứng dụng tự bổ sung cột `device_type` với giá trị mặc định `Điện thoại` cho dữ liệu hiện có.
