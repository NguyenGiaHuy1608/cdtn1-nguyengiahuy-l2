# L2 — Tiếp nhận và phân loại yêu cầu bảo hành

**Nguyễn Gia Huy — MSSV 2374802010181 — Track SE**  
GitHub: https://github.com/NguyenGiaHuy1608/cdtn1-nguyengiahuy-l2

## 1. Phạm vi
L2 tập trung vào tiếp nhận và phân loại yêu cầu bảo hành: tra cứu khách hàng, ghi nhận thiết bị/lỗi, tạo ticket, phân loại, ưu tiên và theo dõi danh sách/hạn xử lý.

## 2. Cấu trúc repo
```text
.
├── README.md
├── BT1_2374802010181_NguyenGiaHuy.pdf
├── docs/
│   ├── srs.md
│   ├── usecase.drawio
│   ├── architecture.drawio
│   ├── erd.drawio
│   ├── wireframe.drawio
│   ├── ai-declaration.md
│   ├── api-contract.md
│   └── export/
└── db/
    └── schema.sql
```

## 3. Cách mở file thiết kế
Mở các file `.drawio` bằng diagrams.net / Draw.io Desktop. Các ảnh trong `docs/export/` là bản xuất để chèn PDF.

## 4. Quyết định kiến trúc
Layered là khung tổng thể; Presentation tổ chức theo MVC; Business chứa rule; Repository che giấu SQL; PostgreSQL bảo đảm toàn vẹn. Phụ thuộc đi một chiều từ trên xuống.

## 5. Mô hình dữ liệu
ERD dùng 5 bảng: `customer`, `device`, `issue_category`, `ticket`, `ticket_status_log`. DDL nằm ở `db/schema.sql`. Index được gắn với truy vấn cụ thể/NFR01.

## 6. Wireframe
Ba màn hình:
- M1 — Tra cứu khách hàng / ghi nhận thiết bị
- M2 — Tạo phiếu bảo hành
- M3 — Danh sách và theo dõi

## 7. AI Disclosure
Xem `docs/ai-declaration.md`.

## 8. Bản nộp
PDF `BT1_2374802010181_NguyenGiaHuy.pdf` là bản để nộp VLU E-learning; repo giữ các file gốc/editable.
