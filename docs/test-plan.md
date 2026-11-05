# Test Plan – Hệ thống quản lý bảo hành

## 1. Mục tiêu kiểm thử

Kiểm tra các chức năng cốt lõi của hệ thống quản lý bảo hành, bao gồm quản lý khách hàng, thiết bị, phiếu bảo hành và pipeline xử lý dữ liệu.

Mục tiêu của kiểm thử là xác nhận:

- Các nghiệp vụ chính hoạt động đúng với dữ liệu hợp lệ.
- Hệ thống từ chối dữ liệu không hợp lệ và trả về thông báo phù hợp.
- Các quy tắc nghiệp vụ được áp dụng khi tạo, cập nhật và xóa dữ liệu.
- API nghiệp vụ yêu cầu xác thực phù hợp.
- Pipeline dữ liệu có thể chạy lại mà không làm nhân đôi dữ liệu.

## 2. Phạm vi kiểm thử

Các thành phần được kiểm thử:

- Quản lý khách hàng.
- Quản lý thiết bị.
- Quản lý phiếu bảo hành.
- Xác thực API nghiệp vụ.
- Kiểm tra và chuẩn hóa dữ liệu.
- Huấn luyện và dự đoán bằng mô hình cơ sở.

Các tệp kiểm thử:

- `tests/test_module.py`
- `tests/test_data_pipeline.py`

## 3. Phương pháp kiểm thử

Bộ kiểm thử tự động được thực hiện bằng Python `unittest`.

Lệnh chạy toàn bộ kiểm thử:

```powershell
python -m unittest discover -s tests -v
```

Kiểm thử được chia thành năm nhóm sau.

### 3.1. Luồng đúng

Kiểm tra các chức năng hoạt động với dữ liệu hợp lệ.

Ví dụ:

- Tạo phiếu bảo hành thành công.
- Tạo thiết bị cho khách hàng và lọc theo khách hàng.
- Cập nhật thông tin khách hàng.
- Xóa phiếu bảo hành.
- Cập nhật phiếu bảo hành.

### 3.2. Kiểm thử biên

Kiểm tra dữ liệu tại giới hạn nghiệp vụ.

Ví dụ:

- Từ chối mô tả phiếu bảo hành không đáp ứng giới hạn cho phép.
- Kiểm tra dữ liệu đầu vào tại các điều kiện giới hạn của nghiệp vụ.

### 3.3. Kiểm thử dữ liệu sai

Kiểm tra khả năng từ chối dữ liệu không hợp lệ.

Ví dụ:

- Số điện thoại khách hàng không hợp lệ.
- Loại thiết bị không hợp lệ.
- Payload tạo phiếu không hợp lệ.
- Nhãn dữ liệu không hợp lệ.

### 3.4. Kiểm thử bảo mật và chất lượng dữ liệu

Kiểm tra các yêu cầu về truy cập và tính nhất quán của dữ liệu.

Ví dụ:

- API nghiệp vụ yêu cầu token xác thực.
- Từ chối mô tả dữ liệu bị trùng.
- Từ chối tạo phiếu bảo hành đang mở trùng lặp.

### 3.5. Kiểm thử tái lập

Kiểm tra hệ thống có thể chạy lại mà không phát sinh lỗi hoặc nhân đôi dữ liệu không mong muốn.

Ví dụ:

- Pipeline xuất dữ liệu sạch có thể chạy lại.
- Dữ liệu hợp lệ tiếp tục vượt qua các kiểm tra chất lượng.
- Mô hình cơ sở dự đoán được các lớp đã biết.

## 4. Tiêu chí hoàn thành

Bộ kiểm thử được xem là hoàn thành khi:

- Toàn bộ kiểm thử chạy bằng một lệnh.
- Các kiểm thử PASS.
- Không có FAIL hoặc ERROR.
- Có ảnh chụp kết quả chạy thật trong `docs/screenshots/`.

## 5. Môi trường kiểm thử

- Hệ điều hành: Windows.
- Ngôn ngữ: Python.
- Framework kiểm thử: `unittest`.
- Cơ sở dữ liệu: SQLite.
- Môi trường Python: `.venv`.