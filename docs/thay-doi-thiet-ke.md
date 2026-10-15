# Nhật ký thay đổi thiết kế

**Đề tài:** L2 — Tiếp nhận và phân loại yêu cầu bảo hành  
**Mốc:** Sau phản hồi BT1 / Buổi 8  
**Nguyên tắc:** cập nhật theo một nguồn sự thật: `docs/srs.md` + `docs/erd.drawio` + `db/schema.sql`.

## TD-01 — Đồng bộ UC06 và UC07
- **Phản hồi:** Sơ đồ Use Case và bảng SRS/bảng truy vết gán UC06, UC07 khác nhau.
- **Quyết định:** SỬA.
- **Lý do:** Mỗi mã UC phải chỉ đến một nghiệp vụ duy nhất để không làm sai phạm vi khi hiện thực và kiểm thử.
- **Ảnh hưởng:** Giữ quy ước thống nhất: UC06 = Xác định mức ưu tiên; UC07 = Xem danh sách và hạn xử lý. SRS và Use Case Diagram cần cùng nhãn.

## TD-02 — Đồng bộ tên bảng và cột giữa ERD và DDL
- **Phản hồi:** Bảng mô tả/DDL dùng tên khác với ERD, ví dụ `warranty_ticket` so với `ticket`, `customer.name` so với `full_name`.
- **Quyết định:** SỬA.
- **Lý do:** Nếu tên không khớp, mã repository sẽ truy vấn sai bảng/cột và thiết kế không thể truy vết.
- **Ảnh hưởng:** Chọn tên chuẩn `customer`, `device`, `issue_category`, `ticket`, `ticket_status_log`; tên khách hàng là `full_name`. `db/schema.sql`, migration, seed và mã nguồn sử dụng đúng các tên này.

## TD-03 — Chốt cơ sở dữ liệu và kiến trúc hiện thực
- **Phản hồi:** Tài liệu ghi SQLite/API Layer nhưng sơ đồ ghi PostgreSQL và 4 lớp.
- **Quyết định:** SỬA.
- **Lý do:** Prototype cần chạy được tại máy cá nhân; SQLite giảm yêu cầu cài đặt dịch vụ. Đây là lựa chọn triển khai cho Sprint 1, không phải khẳng định SQLite tốt hơn PostgreSQL trong mọi trường hợp.
- **Ảnh hưởng:** Bản hiện thực Buổi 8 dùng SQLite; kiến trúc vẫn có 4 lớp: Presentation, Business/Service, Repository/DAO, Database. Không thêm “API Layer” thành tầng độc lập; API route nằm trong Presentation. Nếu đổi sang PostgreSQL sau này, cần kiểm tra lại kiểu dữ liệu và migration.

## TD-04 — Đồng bộ tên màn hình M1
- **Phản hồi:** Mô tả M1 là danh sách phiếu nhưng hình M1 là tra cứu khách hàng/thiết bị.
- **Quyết định:** SỬA.
- **Lý do:** Tên màn hình, wireframe và UC phải mô tả cùng một hành động.
- **Ảnh hưởng:** M1 = Tra cứu khách hàng / thiết bị (UC01/UC02); M2 = Tạo phiếu (UC03–UC06); M3 = Danh sách phiếu và hạn xử lý (UC07).

## TD-05 — Xóa câu nháp và chuẩn hóa tên tệp
- **Phản hồi:** SRS còn câu nháp “Các ngưỡng dưới đây là bản dự thảo…” và tên tệp nộp thừa tiền tố.
- **Quyết định:** SỬA.
- **Lý do:** Tài liệu bàn giao không nên còn ghi chú biên tập chưa hoàn tất.
- **Ảnh hưởng:** SRS giữ các ngưỡng NFR như mục tiêu cần kiểm thử; tên PDF nộp dùng `BT1_2374802010181_NguyenGiaHuy.pdf`.

## TD-06 — Lập luận đánh đổi kiến trúc cụ thể hơn
- **Phản hồi:** Lập luận kiến trúc chưa nói rõ chi phí và cách đo.
- **Quyết định:** SỬA.
- **Lý do:** Một lựa chọn thiết kế cần có lợi ích, đánh đổi và cách kiểm chứng.
- **Ảnh hưởng:** Chia lớp làm tăng số tệp và chi phí điều hướng mã; đổi lại, test service có thể chạy không cần khởi động web server. Kiểm chứng bằng test service và rà soát import giữa routes → services → repositories.
