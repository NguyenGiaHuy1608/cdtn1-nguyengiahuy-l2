# Test Report – Hệ thống quản lý bảo hành thiết bị

## 1. Thông tin chung

- **Tên hệ thống:** Hệ thống tiếp nhận và quản lý phiếu bảo hành.
- **Công cụ kiểm thử:** Python `unittest`.
- **Thư mục kiểm thử:** `tests/`.
- **Số lần chạy kiểm thử:** 2 lần liên tiếp.
- **Kết quả:** Cả hai lần chạy đều thành công với 27 test PASS.

Lệnh chạy toàn bộ bộ kiểm thử:

```powershell
python -m unittest discover -s tests -v
```

Kết quả kiểm thử mới nhất:

```text
Ran 27 tests

OK
```

Ảnh chụp kết quả chạy thực tế được lưu tại:

`docs/screenshots/test-all-pass.png`

---

## 2. Test Cases đã thực hiện

Bảng dưới đây lựa chọn 12 test case từ bộ kiểm thử tự động đã được chạy thực tế.

| Mã | Tiền điều kiện | Các bước | Dữ liệu thử | Kết quả mong đợi | Mức ưu tiên | Kết quả thực tế | PASS/FAIL |
|---|---|---|---|---|---|---|---|
| TC-01 – Luồng đúng | Hệ thống đã khởi tạo dữ liệu kiểm thử; khách hàng và thiết bị hợp lệ tồn tại. | Gửi yêu cầu tạo phiếu bảo hành. | `customer_id=1`, `device_id=1`, `category_id=1`, mô tả hợp lệ, mức ưu tiên hợp lệ. | Tạo phiếu thành công, trả mã `201`, có mã phiếu và trạng thái `MOI`. | Cao | API tạo phiếu thành công và trả dữ liệu đúng mong đợi. | PASS |
| TC-02 – Quy tắc thiết bị hết hạn | Có thiết bị đã hết hạn bảo hành. | Gửi yêu cầu tạo phiếu cho thiết bị hết hạn. | ID khách hàng và thiết bị hết hạn. | Hệ thống từ chối tạo phiếu theo quy tắc bảo hành. | Cao | Yêu cầu bị từ chối đúng theo quy tắc nghiệp vụ. | PASS |
| TC-03 – Quy tắc phiếu đang mở | Có thiết bị đang có phiếu bảo hành mở. | Gửi yêu cầu tạo thêm phiếu cho cùng thiết bị. | Dữ liệu phiếu hợp lệ cho thiết bị đã có phiếu mở. | Không tạo phiếu trùng; hệ thống trả lỗi phù hợp. | Cao | Hệ thống từ chối tạo phiếu đang mở trùng. | PASS |
| TC-04 – Quy tắc thiết bị thuộc khách hàng | Có khách hàng hợp lệ. | Tạo thiết bị cho khách hàng, sau đó lọc danh sách theo khách hàng. | Thông tin thiết bị hợp lệ và ID khách hàng. | Thiết bị được tạo và chỉ xuất hiện khi lọc đúng khách hàng sở hữu. | Cao | Thiết bị được tạo và lọc đúng theo khách hàng. | PASS |
| TC-05 – Giá trị biên dưới | Dữ liệu khách hàng, thiết bị và nhóm lỗi hợp lệ tồn tại. | Gửi yêu cầu tạo phiếu với mô tả 9 ký tự. | `issue_desc` gồm 9 ký tự. | Hệ thống từ chối vì mô tả chưa đạt tối thiểu 10 ký tự; trả lỗi `400`. | Trung bình | Hệ thống từ chối dữ liệu biên dưới đúng mong đợi. | PASS |
| TC-06 – Giá trị biên hợp lệ | Dữ liệu khách hàng, thiết bị và nhóm lỗi hợp lệ tồn tại. | Gửi yêu cầu tạo phiếu với mô tả đúng 10 ký tự. | `issue_desc = 1234567890`. | Hệ thống chấp nhận dữ liệu đúng giới hạn và tạo phiếu thành công với mã `201`. | Trung bình | Phiếu được tạo thành công với dữ liệu đúng 10 ký tự. | PASS |
| TC-07 – Dữ liệu sai: số điện thoại | API đã sẵn sàng nhận yêu cầu. | Gửi yêu cầu với số điện thoại không đúng định dạng. | Số điện thoại không phải 10–11 chữ số hợp lệ. | Hệ thống trả mã `400` và thông báo lỗi dữ liệu không hợp lệ. | Cao | API trả đúng mã trạng thái và thông báo lỗi. | PASS |
| TC-08 – Dữ liệu sai: loại thiết bị | Khách hàng hợp lệ tồn tại. | Gửi yêu cầu tạo thiết bị với loại thiết bị không được hỗ trợ. | `device_type` không hợp lệ. | Hệ thống trả mã `400` và lỗi `LOAI_THIET_BI_KHONG_HOP_LE`. | Cao | API từ chối dữ liệu và trả đúng lỗi mong đợi. | PASS |
| TC-09 – Bảo mật | Không cung cấp token xác thực. | Gọi API nghiệp vụ yêu cầu xác thực. | Không có header `Authorization`. | Hệ thống từ chối truy cập, trả `401` và lỗi `TOKEN_KHONG_HOP_LE`. | Cao | API yêu cầu xác thực và từ chối truy cập không có token. | PASS |
| TC-10 – Tính tái lập | Bộ kiểm thử và môi trường `.venv` đã sẵn sàng. | Chạy toàn bộ bộ test lần thứ nhất, sau đó chạy lại lần thứ hai bằng cùng lệnh. | `python -m unittest discover -s tests -v`. | Hai lần chạy cho kết quả giống nhau, không có FAIL hoặc ERROR. | Cao | Cả hai lần chạy đều đạt 27 tests và `OK`. | PASS |
| TC-11 – Quy tắc xóa khách hàng | Có khách hàng đang liên kết với thiết bị. | Gửi yêu cầu xóa khách hàng. | ID khách hàng đang sở hữu thiết bị. | Hệ thống không cho xóa để đảm bảo tính toàn vẹn dữ liệu. | Cao | Hệ thống từ chối thao tác xóa khách hàng đang có thiết bị. | PASS |
| TC-12 – Luồng xóa phiếu | Có phiếu bảo hành tồn tại trong dữ liệu kiểm thử. | Xóa phiếu, sau đó kiểm tra lại bản ghi. | ID phiếu bảo hành hợp lệ. | Phiếu được xóa và không còn tồn tại trong hệ thống. | Trung bình | Phiếu được xóa thành công và không còn được tìm thấy. | PASS |

---

## 3. Tổng hợp theo nhóm kiểm thử

| Nhóm kiểm thử | Test case | Kết quả |
|---|---|---|
| Luồng đúng và quy tắc nghiệp vụ | TC-01, TC-02, TC-03, TC-04, TC-11, TC-12 | PASS |
| Giá trị biên | TC-05, TC-06 | PASS |
| Dữ liệu sai | TC-07, TC-08 | PASS |
| Bảo mật | TC-09 | PASS |
| Tính tái lập | TC-10 | PASS |

## 4. Kết quả kiểm thử

Toàn bộ các test case được ghi trong báo cáo đều dựa trên bộ kiểm thử tự động đã được chạy thực tế trong môi trường dự án.

Bộ kiểm thử hiện có **27 test**. Toàn bộ test đã chạy thành công với kết quả:

```text
Ran 27 tests

OK
```

Để kiểm tra tính tái lập, toàn bộ bộ kiểm thử đã được chạy **hai lần liên tiếp** bằng cùng một lệnh. Cả hai lần đều cho kết quả **27 test PASS, không có FAIL hoặc ERROR**.

## 5. Kết luận

Bộ kiểm thử đã kiểm tra các quy tắc nghiệp vụ chính, dữ liệu tại ranh giới tối thiểu của mô tả lỗi, các trường hợp dữ liệu không hợp lệ, yêu cầu xác thực API và khả năng tái lập kết quả kiểm thử.

Tại thời điểm lập báo cáo, toàn bộ 27 test trong bộ kiểm thử đều PASS. Các test case được lựa chọn trong báo cáo có thể được chạy lại bằng lệnh:

```powershell
python -m unittest discover -s tests -v
```