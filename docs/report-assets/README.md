## Chạy hệ thống

Yêu cầu: Đã cài đặt Docker Desktop và Docker Compose.

Mở terminal tại thư mục gốc của repository và chạy:

```powershell
docker compose up -d --build
docker compose ps
```

Sau khi dịch vụ khởi động, mở trình duyệt tại:

`http://127.0.0.1:5000`

Để kiểm tra API đang hoạt động, truy cập:

`http://127.0.0.1:5000/api/health`

Bộ kiểm thử tự động có thể chạy bằng lệnh:

```powershell
docker compose exec warranty python -m unittest discover -s tests -v
```