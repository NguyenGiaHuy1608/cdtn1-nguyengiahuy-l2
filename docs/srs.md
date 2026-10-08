# SRS rút gọn — L2 Tiếp nhận và phân loại yêu cầu bảo hành

**Sinh viên:** Nguyễn Gia Huy  
**MSSV:** 2374802010181  
**Track:** Software Engineering (SE)  
**Luồng:** L2 — Tiếp nhận và phân loại yêu cầu bảo hành

## 1. Giới thiệu và phạm vi
**Phạm vi:** Nhân viên tiếp nhận tra cứu khách hàng, ghi nhận thiết bị và lỗi, tạo phiếu bảo hành, phân loại yêu cầu, xác định mức ưu tiên và theo dõi danh sách/hạn xử lý.

**WON'T:** phân công kỹ thuật viên; sửa chữa; thanh toán; SMS/email tự động; quản lý kho linh kiện.

### Bảng thuật ngữ
| Thuật ngữ | Định nghĩa |
|---|---|
| Khách hàng | Người mang thiết bị đến yêu cầu bảo hành |
| Thiết bị | Sản phẩm được tiếp nhận |
| Phiếu bảo hành / ticket | Bản ghi yêu cầu bảo hành sau khi tiếp nhận |
| Nhóm lỗi | Danh mục dùng để phân loại lỗi |
| Mức ưu tiên | CAO, TRUNG_BINH, THAP |
| Hạn xử lý | Thời điểm cam kết xử lý phiếu |

## 2. Các bên liên quan và vai trò
| Vai trò | Được làm | Không được làm trong L2 |
|---|---|---|
| Nhân viên tiếp nhận | Tra cứu KH; ghi nhận thiết bị/lỗi; tạo, phân loại, ưu tiên và theo dõi phiếu | Không phân công KTV, sửa chữa, thanh toán |
| Quản lý trung tâm | Xem danh sách và hạn xử lý để giám sát | Không thao tác sửa chữa/kho trong L2 |

## 3. Yêu cầu chức năng, User Story và MoSCoW
| FR | Yêu cầu | US | MoSCoW |
|---|---|---|---|
| FR01 | Tra cứu khách hàng bằng SĐT | US01 | MUST |
| FR02 | Ghi nhận/chọn thiết bị | US02 | SHOULD |
| FR03 | Tạo phiếu và sinh mã duy nhất | US03 | MUST |
| FR04 | Ghi nhận mô tả lỗi | US04 | SHOULD |
| FR05 | Gán nhóm lỗi | US05 | MUST |
| FR06 | Xác định mức ưu tiên | US06 | SHOULD |
| FR07 | Xem danh sách và hạn xử lý | US07 | SHOULD |

### User Stories
- US01: Là nhân viên tiếp nhận, tôi muốn tra cứu khách hàng bằng số điện thoại để lấy đúng hồ sơ.
- US02: Là nhân viên tiếp nhận, tôi muốn ghi nhận thiết bị để biết thiết bị nào đang được tiếp nhận.
- US03: Là nhân viên tiếp nhận, tôi muốn tạo phiếu bảo hành để lưu yêu cầu có mã theo dõi.
- US04: Là nhân viên tiếp nhận, tôi muốn ghi nhận mô tả lỗi để có thông tin ban đầu về sự cố.
- US05: Là nhân viên tiếp nhận, tôi muốn phân loại theo nhóm lỗi để chuẩn hóa bước tiếp nhận.
- US06: Là nhân viên tiếp nhận, tôi muốn xác định mức ưu tiên để hỗ trợ sắp xếp xử lý.
- US07: Là nhân viên tiếp nhận hoặc quản lý trung tâm, tôi muốn xem danh sách phiếu và hạn xử lý để theo dõi yêu cầu.

### GWT cho MUST
**US01**
1. Given SĐT tồn tại → When tra cứu → Then hiển thị đúng khách hàng.
2. Given SĐT không tồn tại → When tra cứu → Then thông báo không tìm thấy.

**US03**
1. Given KH, thiết bị và lỗi hợp lệ → When tạo phiếu → Then sinh ticket_code duy nhất và status `MOI`.
2. Given thiếu dữ liệu bắt buộc → When tạo → Then không lưu và chỉ rõ trường thiếu.

**US05**
1. Given phiếu có mô tả lỗi → When chọn nhóm lỗi hợp lệ → Then lưu category.
2. Given chưa chọn nhóm lỗi → When xác nhận → Then yêu cầu bổ sung nhóm lỗi.

## 4. Yêu cầu phi chức năng
| ID | Ngưỡng đo được |
|---|---|
| NFR01 | Danh sách/tra cứu phản hồi dưới **2 giây** với tối đa **10.000 phiếu**. |
| NFR02 | Tạo/cập nhật phân loại hoàn tất dưới **3 giây** với tối đa **20 người dùng đồng thời** trong môi trường thử nghiệm. |
| NFR03 | Khi đổi một quy tắc nghiệp vụ, không phải sửa quá **1 module nghiệp vụ**. |

## 5. Ràng buộc và quy tắc nghiệp vụ
- QT-01: Thiết bị phải còn hạn bảo hành khi tiếp nhận.
- QT-02: Số điện thoại khách hàng phải có 10–11 chữ số.
- QT-03: Phiếu phải liên kết khách hàng và thiết bị.
- QT-04: Hạn xử lý được sinh theo quy tắc cam kết của workflow và lưu tại `due_date`.
- QT-05: Phiếu mới có trạng thái `MOI`.
- QT-06: Mã phiếu `ticket_code` là duy nhất.
- QT-07: `priority` chỉ nhận `CAO`, `TRUNG_BINH`, `THAP`.

## 6. Bảng truy vết
| FR | US | Use Case | MoSCoW |
|---|---|---|---|
| FR01 | US01 | UC01 | MUST |
| FR02 | US02 | UC02 | SHOULD |
| FR03 | US03 | UC03 | MUST |
| FR04 | US04 | UC04 | SHOULD |
| FR05 | US05 | UC05 | MUST |
| FR06 | US06 | UC06 | SHOULD |
| FR07 | US07 | UC07 | SHOULD |

> **Ghi chú thiết kế:** Mỗi bảng/cột trong ERD phải trả lời được nó phục vụ FR/US nào. `ticket_status_log` tồn tại để lưu lịch sử trạng thái, phục vụ US07 và tránh mất thông tin khi `status` bị ghi đè.
