-- Khach hang demo duoc dung boi README va bo kiem thu.
INSERT OR IGNORE INTO customer (full_name, phone, email) VALUES
('Nguyễn Minh Anh', '0901234567', 'minhanh@example.com'),
('Trần Quốc Bảo', '0912345678', 'quocbao@example.com');

-- Them khach hang mau
INSERT OR IGNORE INTO customer (full_name, phone, email) VALUES
('Lê Hoàng Nam', '0931000001', 'nam@example.com'),
('Phạm Thu Hà', '0931000002', 'ha@example.com'),
('Võ Minh Khang', '0931000003', 'khang@example.com'),
('Đặng Ngọc Linh', '0931000004', 'linh@example.com'),
('Bùi Gia Bảo', '0931000005', 'bao2@example.com'),
('Ngô Thanh Tâm', '0931000006', 'tam@example.com'),
('Đỗ Quốc Huy', '0931000007', 'huy@example.com'),
('Trương Mỹ Duyên', '0931000008', 'duyen@example.com'),
('Huỳnh Tuấn Kiệt', '0931000009', 'kiet@example.com'),
('Phan Khánh Vy', '0931000010', 'vy@example.com');

-- Hai thiet bi demo co trang thai bao hanh khac nhau.
INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months, brand, model)
SELECT customer_id, 'SN-DEMO-0001', date('now','-3 months'), 12, 'Apple', 'iPhone 15'
FROM customer WHERE phone = '0901234567';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months, brand, model)
SELECT customer_id, 'SN-DEMO-0002', date('now','-18 months'), 12, 'Samsung', 'Galaxy S24'
FROM customer WHERE phone = '0912345678';

-- Them 15 thiet bi, moi khach hang co the co nhieu thiet bi
INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0001', date('now','-2 months'), 12
FROM customer WHERE phone = '0931000001';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0002', date('now','-4 months'), 12
FROM customer WHERE phone = '0931000001';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0003', date('now','-15 months'), 12
FROM customer WHERE phone = '0931000002';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0004', date('now','-1 months'), 12
FROM customer WHERE phone = '0931000002';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0005', date('now','-6 months'), 24
FROM customer WHERE phone = '0931000003';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0006', date('now','-8 months'), 12
FROM customer WHERE phone = '0931000003';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0007', date('now','-20 months'), 12
FROM customer WHERE phone = '0931000004';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0008', date('now','-3 months'), 12
FROM customer WHERE phone = '0931000004';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0009', date('now','-5 months'), 24
FROM customer WHERE phone = '0931000005';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0010', date('now','-14 months'), 12
FROM customer WHERE phone = '0931000005';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0011', date('now','-1 months'), 12
FROM customer WHERE phone = '0931000006';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0012', date('now','-9 months'), 12
FROM customer WHERE phone = '0931000007';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0013', date('now','-2 months'), 24
FROM customer WHERE phone = '0931000008';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0014', date('now','-18 months'), 12
FROM customer WHERE phone = '0931000009';

INSERT OR IGNORE INTO device
    (customer_id, serial_no, purchase_date, warranty_months)
SELECT customer_id, 'SN-TEST-0015', date('now','-4 months'), 12
FROM customer WHERE phone = '0931000010';


-- Cap nhat hang/model cho cac thiet bi mau; an toan khi chay seed nhieu lan.
UPDATE device SET brand = 'Apple', model = 'iPhone 15' WHERE serial_no = 'SN-DEMO-0001';
UPDATE device SET brand = 'Samsung', model = 'Galaxy S24' WHERE serial_no = 'SN-DEMO-0002';
UPDATE device SET brand = 'Apple', model = 'iPhone 13' WHERE serial_no = 'SN-TEST-0001';
UPDATE device SET brand = 'Samsung', model = 'Galaxy A55' WHERE serial_no = 'SN-TEST-0002';
UPDATE device SET brand = 'Xiaomi', model = 'Redmi Note 13' WHERE serial_no = 'SN-TEST-0003';
UPDATE device SET brand = 'OPPO', model = 'Reno11' WHERE serial_no = 'SN-TEST-0004';
UPDATE device SET brand = 'Apple', model = 'iPhone 14' WHERE serial_no = 'SN-TEST-0005';
UPDATE device SET brand = 'Samsung', model = 'Galaxy A35' WHERE serial_no = 'SN-TEST-0006';
UPDATE device SET brand = 'Xiaomi', model = 'Redmi Note 12' WHERE serial_no = 'SN-TEST-0007';
UPDATE device SET brand = 'vivo', model = 'V30' WHERE serial_no = 'SN-TEST-0008';
UPDATE device SET brand = 'OPPO', model = 'Reno12' WHERE serial_no = 'SN-TEST-0009';
UPDATE device SET brand = 'Apple', model = 'iPhone 12' WHERE serial_no = 'SN-TEST-0010';
UPDATE device SET brand = 'Samsung', model = 'Galaxy S23' WHERE serial_no = 'SN-TEST-0011';
UPDATE device SET brand = 'Xiaomi', model = 'Redmi Note 13 Pro' WHERE serial_no = 'SN-TEST-0012';
UPDATE device SET brand = 'vivo', model = 'Y100' WHERE serial_no = 'SN-TEST-0013';
UPDATE device SET brand = 'OPPO', model = 'A79' WHERE serial_no = 'SN-TEST-0014';
UPDATE device SET brand = 'Samsung', model = 'Galaxy A25' WHERE serial_no = 'SN-TEST-0015';

-- Danh muc nhom loi bao hanh
INSERT OR IGNORE INTO issue_category (category_name, description) VALUES
('MAN_HINH', 'Loi man hinh, cam ung'),
('PIN', 'Loi pin va sac'),
('NGUON', 'Loi nguon va khoi dong'),
('PHAN_CUNG', 'Loi linh kien phan cung'),
('PHAN_MEM', 'Loi he dieu hanh va phan mem');
