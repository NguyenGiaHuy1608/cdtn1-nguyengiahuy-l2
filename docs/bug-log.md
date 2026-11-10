# Bug Log – Hệ thống quản lý bảo hành thiết bị

## Thông tin chung

| Mục | Nội dung |
|---|---|
| Dự án | Hệ thống quản lý bảo hành thiết bị |
| Phiên bản kiểm thử | v0.2 |
| Công cụ kiểm thử | Python unittest |
| Ngày cập nhật | 05/11/2026 |

## Danh sách lỗi đã ghi nhận và xử lý

| ID | Mức độ | Mô tả lỗi | Trạng thái | Minh chứng sửa lỗi |
|---|---|---|---|---|
| BUG-01 | Trung bình | Thông báo thành công sau khi tạo hoặc cập nhật dữ liệu hiển thị trên giao diện nhưng không tự biến mất, có thể gây hiểu nhầm cho người dùng. | Đã sửa | Commit `1eeb102` |
| BUG-02 | Trung bình | Hệ thống chưa có chức năng xuất thông tin phiếu bảo hành để người dùng lưu hoặc sử dụng bên ngoài hệ thống. | Đã sửa | Commit `1eeb102` |

## BUG-01 – Thông báo giao diện không tự ẩn

**Mô tả:**  
Sau khi người dùng thực hiện thành công thao tác thêm, sửa hoặc cập nhật dữ liệu, thông báo màu xanh vẫn tiếp tục hiển thị trên giao diện. Điều này có thể làm người dùng nhầm lẫn rằng thông báo vẫn liên quan đến thao tác hiện tại.

**Các bước tái hiện:**

1. Mở hệ thống và thực hiện thao tác thêm hoặc cập nhật dữ liệu.
2. Thực hiện thao tác thành công.
3. Quan sát thông báo thành công trên giao diện.

**Kết quả thực tế trước khi sửa:**

Thông báo thành công vẫn hiển thị trên giao diện và không tự động biến mất sau một khoảng thời gian.

**Kết quả mong đợi:**  
Thông báo thành công hiển thị trong một khoảng thời gian phù hợp và tự động biến mất.

**Cách xử lý:**  
Cập nhật cơ chế hiển thị thông báo trong phần giao diện để thông báo thành công tự động được ẩn sau khi người dùng đã nhận biết kết quả thao tác.

**Commit sửa lỗi:**  
`1eeb102` – Add warranty ticket export and improve notifications

**Trạng thái sau khi sửa:** Đã kiểm tra lại và bộ kiểm thử tự động PASS.

---

## BUG-02 – Thiếu chức năng xuất phiếu bảo hành

**Mô tả:**  
Phiếu bảo hành đã được tạo và quản lý trong hệ thống nhưng người dùng chưa có chức năng xuất thông tin phiếu để sử dụng bên ngoài hệ thống.

**Các bước tái hiện:**

1. Mở danh sách phiếu bảo hành trên hệ thống.
2. Chọn một phiếu bảo hành cần sử dụng hoặc lưu thông tin.
3. Kiểm tra các chức năng có sẵn trên giao diện.

**Kết quả thực tế trước khi sửa:**

Hệ thống chưa có chức năng xuất thông tin phiếu bảo hành để người dùng lưu hoặc sử dụng bên ngoài hệ thống.

**Kết quả mong đợi:**  
Người dùng có thể thực hiện chức năng xuất thông tin phiếu bảo hành từ giao diện hệ thống.

**Cách xử lý:**  
Bổ sung chức năng xuất phiếu bảo hành và cập nhật giao diện để hỗ trợ thao tác này.

**Commit sửa lỗi:**  
`1eeb102` – Add warranty ticket export and improve notifications

**Trạng thái sau khi sửa:** Chức năng đã được bổ sung vào hệ thống.