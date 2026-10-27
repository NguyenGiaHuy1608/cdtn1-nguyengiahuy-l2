# Khai báo sử dụng công cụ AI — Bài tập 2

| Công cụ | Phần áp dụng | Cách sử dụng | Việc sinh viên cần tự kiểm chứng |
|---|---|---|---|
| ChatGPT | Rà soát kiến trúc, test, README và báo cáo | Hỗ trợ phân tích yêu cầu, đề xuất cấu trúc tài liệu và ca kiểm thử | Đọc và hiểu từng thay đổi; chạy test; sửa nội dung không phù hợp với kết quả thực tế trước khi nộp |
| ChatGPT | `scripts/data_pipeline.py` | Hỗ trợ thiết kế pipeline load → validate → normalize/export và năm nhóm kiểm tra dữ liệu | Chạy pipeline trên CSV; kiểm tra số dòng, nhãn hợp lệ, dữ liệu rỗng và trùng lặp |
| ChatGPT | `scripts/train_baseline.py` | Hỗ trợ xây dựng mô hình phân loại cơ sở Multinomial Naive Bayes bằng Python standard library | Chạy script huấn luyện; kiểm tra các ví dụ dự đoán; ghi rõ đây là mô hình demo, không phải mô hình đã được đánh giá trên tập dữ liệu lớn |
| ChatGPT | `tests/`, `README.md`, `BT2_2374802010181_NguyenGiaHuy.pdf` | Hỗ trợ soạn ca kiểm thử, hướng dẫn tái lập và bố cục báo cáo | Chạy toàn bộ lệnh trên máy; chụp ảnh màn hình thực tế; thay các khung chờ ảnh trong PDF bằng bằng chứng của lần chạy thật |

## Trách nhiệm

Sinh viên phải đọc, hiểu, kiểm chứng và chịu trách nhiệm với mã nguồn và nội dung nộp. Không được khai báo một bài kiểm thử là PASS nếu chưa thực sự chạy thành công. Các ảnh minh chứng phải được chụp từ ứng dụng/terminal thật, không dùng ảnh dựng hoặc hình minh họa thay thế.

**Họ tên:** Nguyễn Gia Huy  
**MSSV:** 2374802010181  
**Repo:** https://github.com/NguyenGiaHuy1608/cdtn1-nguyengiahuy-l2
