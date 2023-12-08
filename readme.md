# Magic Post
Build:
```bash
npm run build
```
Run:
```bash
npm run start
```
# API
## Authentication
1. Login

    - HTTP Method: POST
    - Path: /auth/login
    - Req body:
        ```json
        {
            "username": "21020751",
            "password": "21020751"
        }
        ```
    - Res payload: Token

2. Change password

    - HTTP Method: PUT
    - Path: /auth/password/change
    - Req body:
        ```json
        {
            "password": "21020751",
            "newPassword": "21020755"
        }
        ```

## Manage Staff
1. Create Staff Account

    For BOSS to create MANAGER's accounts and for MANAGER to create EMPLOYEE's accounts
    - HTTP Method: POST
    - Path: /staff/create
    - Req Data:
        ```json
        { 
            //see constants/staff.role.js
            "role": "STORAGE-MANAGER",
            
            // if staff role is BOSS, no need for this field. 
            // Otherwise, it's the department id that the staff is working on
            "department": "654df7b079626d8a284e9a75",  
            
            "name": "Nguyen Tran Gia Bao",
            "gender": "Male",
            "email": "only.zabao@example.com"
        }

        ```
2. View one Staff

    To see data of a Staff
    - HTTP Method: GET
    - Path: /staff/:id

3. View a list of Staffs

    To see a list of Staffs
    - HTTP Method: GET
    - Path: /staff
    - Req Params: Same as update req data, page, limit

4. Update Staff

    For BOSS, MANAGER to update Staff
    - HTTP Method: PUT
    - Paht: /staff/update/:id
    - Req Data:
        ```json
        {
            // only provide fields that are need to be updated
            "username": "21020751",
            "password": "21020751",
            "role": "STORAGE-MANAGER",
            "department": "654df7b079626d8a284e9a75",  
            "name": "Nguyen Tran Gia Bao",
            "gender": "Male",
            "email": "only.zabao@example.com",
            "active": false
        }
        ```

## Manage Department
1. Create Department

    For BOSS to create Department
    - HTTP Method: POST
    - Path: /department/create
    - Req Data:
        ```json
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
2. Update Department

    For BOSS to update Department
    - HTTP Method: PUT
    - Paht: /department/update/:id
    - Req Data:
        ```json
        {
            // only provide fields that are need to be updated
            "province": "Ho Chi Minh",
            "district": "Quan 1",
            "street": "135 Nguyen Hue",
            "type": "POSTOFFICE",
            "cfs": "654df7b079626d8a284e9a75",
            "zipcode": "70000",
            "active": false
        }
        ```
3. View one Department

    For BOSS, MANAGER to see data of a Department
    - HTTP Method: GET
    - Path: /department/:id

4. View a list of Departments

    For BOSS to see a list of Department with filter
    - HTTP Method: GET
    - Path: /department
    - Req Params: Same as update req data, page, limit

## Manage Shipment
1. Create shipment

    For POSTOFFICE-EMPLOYEE to create new shipment
    - HTTP Method: POST
    - Path: /shipment/create
    - Req Data:
        ```json
        {
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
                "type": "DOCUMENT",
                "cost": 60000,
                // Below are optional fields
                "weight": 55,
                "value": 15000,
                "note": "As quick as posible"
            }
        }

        ```

2. Update Shipment

     For POSTOFFICE-EMPLOYEE to update shipment
    - HTTP Method: POST
    - Path: /shipment/update/:id
    - Req Data: Fields to be updated