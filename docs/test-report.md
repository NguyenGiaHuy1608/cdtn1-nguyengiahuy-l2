# Test Report – Hệ thống tiếp nhận và quản lý phiếu bảo hành

## 1. Thông tin chung

- **Tên hệ thống:** Hệ thống tiếp nhận và quản lý phiếu bảo hành
- **Thời điểm kiểm thử:** 05/11/2026
- **Công cụ kiểm thử:** Python `unittest`
- **Thư mục kiểm thử:** `tests/`

Lệnh được sử dụng để chạy toàn bộ bộ kiểm thử:

```bash
python -m unittest discover -s tests -v
```

## 2. Kết quả kiểm thử

Bộ kiểm thử đã được chạy thành công trên môi trường của dự án.

| Chỉ số | Kết quả |
|---|---:|
| Tổng số test đã chạy | 26 |
| PASS | 26 |
| FAIL | 0 |

Kết quả chạy thực tế:

```text
Ran 26 tests

OK
```

Ảnh chụp kết quả chạy toàn bộ bộ kiểm thử được lưu tại:

`docs/screenshots/test-all-pass.png`

## 3. Các nhóm kiểm thử đã thực hiện

### 3.1. Kiểm thử luồng nghiệp vụ đúng

Các kiểm thử xác nhận những chức năng chính của hệ thống hoạt động đúng bao gồm:

- Tra cứu khách hàng theo số điện thoại.
- Tạo thiết bị cho khách hàng và lọc thiết bị theo khách hàng.
- Tạo phiếu bảo hành theo luồng nghiệp vụ hợp lệ.
- Cập nhật thông tin khách hàng.
- Cập nhật thông tin phiếu bảo hành.
- Xóa phiếu bảo hành.
- Xóa khách hàng không còn liên kết với thiết bị.
- Hiển thị danh sách khách hàng và danh mục loại lỗi.

Các test liên quan trong bộ kiểm thử đều PASS.

### 3.2. Kiểm thử dữ liệu biên

Hệ thống được kiểm tra với các dữ liệu ở điều kiện biên nhằm xác nhận dữ liệu không phù hợp được xử lý đúng.

Ví dụ:

- Từ chối mô tả lỗi không đạt yêu cầu về độ dài.
- Kiểm tra việc chuẩn hóa khoảng trắng trong dữ liệu mô tả.
- Kiểm tra các điều kiện dữ liệu trước khi tạo hoặc cập nhật bản ghi.

Các test biên trong bộ kiểm thử đều PASS.

### 3.3. Kiểm thử dữ liệu không hợp lệ

Các trường hợp dữ liệu không hợp lệ đã được kiểm tra gồm:

- Số điện thoại khách hàng không hợp lệ.
- Loại thiết bị không hợp lệ.
- Dữ liệu tạo phiếu bảo hành không hợp lệ.
- Nhãn dữ liệu huấn luyện không hợp lệ.
- Thiết bị đã hết thời hạn bảo hành.

Các trường hợp trên đều được hệ thống từ chối theo mong đợi và các test đều PASS.

### 3.4. Kiểm thử bảo mật và chất lượng dữ liệu

Bộ kiểm thử bao gồm các trường hợp:

- API nghiệp vụ yêu cầu token xác thực.
- Từ chối mô tả lỗi trùng lặp trong dữ liệu.
- Từ chối việc tạo nhiều phiếu đang mở cho cùng một trường hợp.
- Kiểm tra dữ liệu đầu vào trước khi xử lý bằng pipeline.

Các test thuộc nhóm này đều PASS.

### 3.5. Kiểm thử khả năng tái lập

Khả năng tái lập được kiểm tra bằng cách chạy lại pipeline xử lý dữ liệu và chạy toàn bộ bộ kiểm thử bằng cùng một lệnh.

Pipeline dữ liệu thực hiện ba pha:

1. Nạp dữ liệu.
2. Kiểm tra và xác thực dữ liệu.
3. Chuẩn hóa và xuất dữ liệu.

Toàn bộ 26 test có thể chạy lại thành công bằng lệnh:

```bash
python -m unittest discover -s tests -v
```

Kết quả tại thời điểm kiểm thử là **26 PASS và 0 FAIL**.

## 4. Tổng kết

Bộ kiểm thử hiện tại đã bao phủ năm nhóm kiểm thử gồm:

| Nhóm kiểm thử | Kết quả |
|---|---|
| Luồng đúng | PASS |
| Dữ liệu biên | PASS |
| Dữ liệu không hợp lệ | PASS |
| Bảo mật/chất lượng dữ liệu | PASS |
| Khả năng tái lập | PASS |

Toàn bộ **26 test đã được chạy thực tế và đều PASS**. Không có test FAIL tại thời điểm lập báo cáo.

Kết quả kiểm thử và ảnh chụp minh chứng được lưu trong repository của dự án để có thể kiểm tra và chạy lại.