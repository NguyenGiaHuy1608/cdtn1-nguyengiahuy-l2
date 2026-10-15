INSERT OR IGNORE INTO customer(customer_id, full_name, phone, email) VALUES
(1, 'Nguyễn Minh Anh', '0901234567', 'anh@example.com'),
(2, 'Trần Quốc Bảo', '0912345678', 'bao@example.com');

INSERT OR IGNORE INTO device(device_id, customer_id, serial_no, purchase_date, warranty_months) VALUES
(1, 1, 'SN-DEMO-0001', date('now','-3 months'), 12),
(2, 2, 'SN-DEMO-0002', date('now','-18 months'), 12);

INSERT OR IGNORE INTO issue_category(category_id, category_name, description) VALUES
(1, 'MAN_HINH', 'Lỗi màn hình'),
(2, 'PIN', 'Lỗi pin hoặc sạc'),
(3, 'PHAN_MEM', 'Lỗi phần mềm');
