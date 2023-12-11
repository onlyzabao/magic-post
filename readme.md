# MagicPost

MagicPost là công ty hoạt động trong lĩnh vực chuyển phát. Công ty này có các điểm giao dịch phủ khắp cả nước. Mỗi điểm giao dịch phụ trách một vùng. Ngoài các điểm giao dịch, công ty cũng có nhiều điểm tập kết hàng hóa. Mỗi điểm giao dịch sẽ làm việc với một điểm tập kết. Ngược lại, một điểm tập kết sẽ làm việc với nhiều điểm giao dịch.

Build:
```bash
npm run build
```
Run:
```bash
npm run start
```

## Chức Năng Cho Từng Đối Tượng Sử Dụng

### Chức Năng Nhân Viên Nói Chung
- Đăng nhập tài khoản nhân viên.
     ```js
    POST /auth/login
    {
        "username": "21020751",
        "password": "21020751"
    }
    ```

- Đổi mật khẩu tài khoản nhân viên.
    ```js
    PUT /auth/password/change
    {
        "password": "21020751",
        "newPassword": "21020755"
    }
    ```

### Chức Năng Lãnh Đạo Công Ty
- Quản lý hệ thống các điểm giao dịch và điểm tập kết.
    ```js
    POST /department/create
    {
        "province": "Ho Chi Minh",
        "district": "Quan 1",
        "street": "135 Nguyen Hue",
        // see constants/department.type.js
        "type": "POSTOFFICE",
        // if department type is STORAGE, no need for these fields below
        "cfs": "654df7b079626d8a284e9a75", // STORAGE id
        "zipcode": "70000"
    }
    ```
    ```js
    PUT /department/update/:id
    ```
    ```js
    GET /department/:id
    ```
    ```js
    GET /department
    ```

- Quản lý tài khoản trưởng điểm điểm tập kết và điểm giao dịch. Mỗi điểm giao dịch hoặc điểm tập kết có một tài khoản trưởng điểm.
    ```js
    POST /staff/manager/create
    Body:
    {
        "role": "POSTOFFICE-MANAGER" // See constants/staff.role.js
        "department": "654df7b079626d8a284e9a75" // Corresponding to role
        "firstname": "Gia Bao",
        "lastname": "Nguyen Tran",
        "gender": "Male",
        "email": "only.zabao@example.com"
    }
    ```
    ```js
    PUT /staff/manager/update/:id
    ```
    ```js
    GET /staff/manager/:id
    ```
    ```js
    GET /staff/manager
    ```

- Thống kê hàng gửi, hàng nhận trên toàn quốc, từng điểm giao dịch hoặc điểm tập kết.

### Chức Năng Trưởng Điểm Tại Điểm Giao Dịch
- Quản lý tài khoản cho giao dịch viên tại điểm giao dịch.
    ```js
    POST /staff/employee/create
    Body:
    {     
        "firstname": "Gia Bao",
        "lastname": "Nguyen Tran",
        "gender": "Male",
        "email": "only.zabao@example.com"
    }
    ```
    ```js
    PUT /staff/employee/update/:id
    ```
    ```js
    GET /staff/employee/:id
    ```
    ```js
    GET /staff/employee
    ```

- Thống kê hàng gửi, hàng nhận tại điểm giao dịch.

### Chức Năng Giao Dịch Viên Tại Điểm Giao Dịch
- Ghi nhận hàng cần gửi của khách (người gửi), in giấy biên nhận chuyển phát và phát cho khách hàng.
    ```js
    POST /shipment/create
    Body:
    {
        // Address field must be correct according to real location
        "sender": {
            "name": "Nguyen Van A",
            "phone": "0945162758",
            "province": "Ha Noi",
            "district": "Nam Tu Liem",
            "street": "17 Trung Van",
            "zipcode": "10000"
        },
        "receiver": {
            "name": "Pham Thi B",
            "phone": "0948153486",
            "province": "Ha Noi",
            "district": "Cau Giay",
            "street": "144 Xuan Thuy",
            "zipcode": "10000"
        },
        "meta": {
            "type": "DOCUMENT", // See constant/shipment.type.js
            "cost": 60000,
            // Below are optional fields
            "note": "As quick as posible",
            "item": [
                {
                    "name": "book",
                    "quantity": 1,
                    "value": 15000
                }
            ]
        }
    }

    ```
- Tạo đơn chuyển hàng gửi đến điểm tập kết mỗi/trước khi đem hàng gửi đến điểm tập kết.
- Xác nhận (đơn) hàng về từ điểm tập kết.
- Tạo đơn hàng cần chuyển đến tay người nhận.
- Xác nhận hàng đã chuyển đến tay người nhận theo .
- Xác nhận hàng không chuyển được đến người nhận và trả lại điểm giao dịch.
- Thống kê các hàng đã chuyển thành công, các hàng chuyển không thành công và trả lại điểm giao dịch.

### Chức Năng Trưởng Điểm Tại Điểm Tập Kết
- Quản lý tài khoản cho nhân viên viên tại điểm tập kết.
    ```js
    // Same as Post-office manager
    ```

- Thống kê hàng đi, đến.

### Chức Năng Nhân Viên Tại Điểm Tập Kết
- Xác nhận (đơn) hàng đi từ điểm giao dịch chuyển đến.
- Tạo đơn chuyển hàng đến điểm tập kết đích (ứng với điểm giao dịch đích, tức điểm giao dịch phụ trách vùng ứng với địa chỉ của người nhận).
- Xác nhận (đơn) hàng nhận về từ điểm tập kết khác.
- Tạo đơn chuyển hàng đến điểm giao dịch đích.

### Chức Năng Cho Khách Hàng
- Tra cứu trạng thái và tiến trình chuyển phát của kiện hàng mình gửi.
    ```js
    GET /shipment/track/:id
    ```