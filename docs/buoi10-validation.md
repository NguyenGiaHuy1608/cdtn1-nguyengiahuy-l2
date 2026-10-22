# Buổi 10 — Kiểm chứng Sprint 2

## Luồng chính cần chạy thực tế

1. Đăng nhập bằng tài khoản demo (mặc định `demo` / `demo123`).
2. Tra cứu khách hàng bằng số điện thoại có trong dữ liệu demo.
3. Tải khách hàng, thiết bị và nhóm lỗi qua API.
4. Chọn thiết bị còn bảo hành và tạo phiếu với mô tả hợp lệ.
5. Xác nhận ứng dụng tự mở chi tiết phiếu vừa tạo.
6. Mở danh sách phiếu, xác nhận phiếu mới hiển thị.
7. Mở Dữ liệu nền, kiểm tra khách hàng, thiết bị còn hạn/hết hạn và nhóm lỗi.

## Kiểm thử tự động

Chạy `python -m unittest discover -s tests -v`. Test dùng database SQLite tạm để không làm thay đổi dữ liệu người dùng trong `data/warranty.db`. Bộ test hiện tại kiểm tra luồng tạo phiếu, dữ liệu sai/biên, hết hạn bảo hành, trùng phiếu, API danh mục, chi tiết không tồn tại và đăng nhập/token.

## Phạm vi chủ động chưa triển khai

- Đăng nhập là tài khoản demo cấu hình bằng biến môi trường, chưa có bảng tài khoản/role trong SQLite. Token chỉ phù hợp prototype chạy cục bộ, không được xem là hệ thống IAM production.
- Không thêm CRUD cho thiết bị/nhóm lỗi; trong Sprint 2 hai danh mục này chỉ được đọc từ database để hỗ trợ tiếp nhận phiếu.
- Không chuyển sang React/Vue; tách API client và API modules theo cấu trúc tệp tĩnh Flask để giữ môi trường đơn giản, có thể chạy trực tiếp.

## Ảnh minh chứng

Sau khi chạy ứng dụng thật, chụp màn hình luồng tạo phiếu thành công và chi tiết phiếu, lưu tại `docs/buoi10-demo.png`. Không dùng ảnh mock làm bằng chứng chạy end-to-end.
