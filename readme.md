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
    Body:
    {
        "username": "21020751",
        "password": "21020751"
    }
    ```

- Đổi mật khẩu tài khoản nhân viên.
    ```js
    PUT /auth/password/change
    Body:
    {
        "password": "21020751",
        "newPassword": "21020755"
    }
    ```

### Chức Năng Lãnh Đạo Công Ty
- Quản lý hệ thống các điểm giao dịch và điểm tập kết.
    ```js
    POST /department/create
    Body:
    {
        "province": "Ho Chi Minh",
        "district": "Quan 1",
        "street": "135 Nguyen Hue",
        "phone": "0962142715",
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
    ```js
    GET /shipment/nationwide
    ```
    ```js
    GET /shipment/department/:id/:type // type: send, received
    ```

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
    ```js
    GET /shipment/department/:type // type: send, received
    ```

### Chức Năng Giao Dịch Viên Tại Điểm Giao Dịch
- Ghi nhận hàng cần gửi của khách (người gửi), in giấy biên nhận chuyển phát và phát cho khách hàng.
    
    Note: Sử dụng api để tạo QR code khi in giấy biên nhận.
    ```js
    GET /department/provinces // Available provinces to send shipment
    ```
    ```js
    GET /department/districts?province= // Available district to send shipment
    ```
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
            // Below are optional fields
            "weight": 5000 // gram
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

    Note: In danh sách đơn hàng đã đõng gói, sẵn sàng để gửi lên điểm tập kết.
    ```js
    GET /transaction/ctp/des // Received shipment from customer
    ```
    ```js
    POST /transaction/pts // Push list of shipments to storage
    Body:
    [
        {
            shipment: "654df7b079626d8a284e9a75"
        },
        {
            shipment: "654df7b079626d8a284e9a75"
        }
    ]
    ```
    ```js
    GET /transaction/pts/pos // Send shipments to storage.
    ```

- Xác nhận (đơn) hàng về từ điểm tập kết.
    ```js
    GET /transaction/stp/des // Received shipment from storage
    ```
    ```js
    PUT /transaction/stp
    Body:
    {
        ids: [ ... ], // list of transactions id
        data: {
            status: "RECEIVED" // or HOLD
        } 
    }
    ```
- Tạo đơn hàng cần chuyển đến tay người nhận.
    ```js
    GET /transaction/stp/des // Received shipment from storage
    ```
    ```js
    POST /transaction/ptc
    Body:
    [
        {
            shipment: "654df7b079626d8a284e9a75"
        },
        {
            shipment: "654df7b079626d8a284e9a75"
        }
    ]
    ```

- Xác nhận hàng đã chuyển đến tay người nhận theo. Xác nhận hàng không chuyển được đến người nhận và trả lại điểm giao dịch. Thống kê các hàng đã chuyển thành công, các hàng chuyển không thành công và trả lại điểm giao dịch.
    ```js
    GET /transaction/ptc/pos // Send shipment to customer
    ```
    ```js
    PUT /transaction/ptc
    Body:
    {
        ids: [ ... ], // list of transactions id
        data: {
            status: "RECEIVED" // or HOLD
        } 
    }
    ```

### Chức Năng Trưởng Điểm Tại Điểm Tập Kết
- Quản lý tài khoản cho nhân viên viên tại điểm tập kết.
    ```js
    // Same as Post-office manager
    ```

- Thống kê hàng đi, đến.
    ```js
    // Same as Post-office manager
    ```

### Chức Năng Nhân Viên Tại Điểm Tập Kết
- Xác nhận (đơn) hàng đi từ điểm giao dịch chuyển đến.
    ```js
    GET /transaction/pts/des // Received shipment from postoffice
    ```
    ```js
    PUT /transaction/pts
    Body:
    {
        ids: [ ... ], // list of transactions id
        data: {
            status: "RECEIVED"
        } 
    }
    ```

- Tạo đơn chuyển hàng đến điểm tập kết đích (ứng với điểm giao dịch đích, tức điểm giao dịch phụ trách vùng ứng với địa chỉ của người nhận).
    ```js
    GET /transaction/pts/des // Received shipment from postoffice
    ```
    ```js
    POST /transaction/sts
    Body:
    [
        {
            shipment: "654df7b079626d8a284e9a75"
        },
        {
            shipment: "654df7b079626d8a284e9a75"
        }
    ]
    ```
    ```js
    GET /transaction/sts/pos // Send shipments to storage
    ```
   
- Xác nhận (đơn) hàng nhận về từ điểm tập kết khác.
    ```js
    GET /transaction/sts/des // Received shipment from storage
    ```
    ```js
    PUT /transaction/sts
    Body:
    {
        ids: [ ... ], // list of transactions id
        data: {
            status: "DELIVERING"
        } 
    }
    ```

- Tạo đơn chuyển hàng đến điểm giao dịch đích.
    ```js
    GET /transaction/sts/des // Received shipment from storage
    ```
    ```js
    POST /transaction/stp
    Body:
    [
        {
            shipment: "654df7b079626d8a284e9a75"
        },
        {
            shipment: "654df7b079626d8a284e9a75"
        }
    ]
    ```
    ```js
    GET /transaction/stp/pos
    ```

### Chức Năng Cho Khách Hàng
- Tra cứu trạng thái và tiến trình chuyển phát của kiện hàng mình gửi.
    ```js
    GET /shipment/track/:id
    ```