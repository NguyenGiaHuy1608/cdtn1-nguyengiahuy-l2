# L2 — Tiếp nhận và phân loại yêu cầu bảo hành

**Sinh viên:** Nguyễn Gia Huy · **MSSV:** 2374802010181 · **Track:** Software Engineering (SE)
**Repo:** https://github.com/NguyenGiaHuy1608/cdtn1-nguyengiahuy-l2

## 1. Phạm vi
Module Sprint 1 tập trung vào tiếp nhận dữ liệu khách hàng, tra cứu khách hàng theo số điện thoại, tạo phiếu bảo hành, kiểm tra điều kiện cơ bản và xem danh sách phiếu. Các nghiệp vụ phân công kỹ thuật viên, sửa chữa, thanh toán, thông báo tự động và quản lý kho nằm ngoài phạm vi hiện tại.

## 2. Cấu trúc repo
```text
.
├── app.py
├── requirements.txt
├── BT1_2374802010181_NguyenGiaHuy.pdf
├── src/
│   ├── routes/          # HTTP endpoints
│   ├── services/        # business rules
│   ├── repositories/    # database access
│   ├── validators/      # input validation
│   └── errors/          # application errors
├── templates/            # UI
├── static/               # CSS/JS
├── migrations/            # SQLite schema migration
├── seeds/                 # demo data
├── db/schema.sql          # canonical schema, matches migration
├── tests/
└── docs/
    ├── srs.md
    ├── usecase.drawio
    ├── architecture.drawio
    ├── erd.drawio
    ├── wireframe.drawio
    ├── thay-doi-thiet-ke.md
    ├── ai-declaration.md
    └── export/
```

## 3. Môi trường và chạy ứng dụng
Python 3.11+ được khuyến nghị.

```bash
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
python app.py
```

Mở `http://127.0.0.1:5000`. Trên Windows CMD, kích hoạt môi trường bằng `.venv\Scripts\activate`.

## 4. Chạy kiểm thử
```bash
python -m unittest discover -s tests -v
```

Các test bao gồm tạo phiếu thành công, tra cứu khách hàng, dữ liệu đầu vào sai, thiết bị hết hạn và ngăn tạo phiếu mở trùng.

## 5. Quyết định kiến trúc
Bản prototype hiện dùng SQLite để chạy cục bộ, với bốn phần trách nhiệm: Presentation/Routes, Business/Service, Repository/DAO và Database. Đây là lựa chọn triển khai cho Sprint 1 nhằm giảm chi phí cài đặt; nếu chuyển sang PostgreSQL sau này cần cập nhật migration và kiểm thử lại.

## 6. Nguồn sự thật và tên file
- SRS: `docs/srs.md`
- Use Case: `docs/usecase.drawio` (giữ UC06 = Xác định mức ưu tiên; UC07 = Xem danh sách và hạn xử lý)
- ERD và schema: `docs/erd.drawio`, `db/schema.sql`, `migrations/001_initial_schema.sql`
- Nhật ký sửa theo phản hồi BT1: `docs/thay-doi-thiet-ke.md`
- AI Disclosure BT1: `docs/ai-declaration.md`

Các file `.drawio` là bản gốc có thể chỉnh sửa. Khi thay đổi sơ đồ, cần xuất lại PNG trong `docs/export/` để ảnh minh họa khớp với sơ đồ gốc.
