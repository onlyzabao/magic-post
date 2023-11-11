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
## Manage Staff
1. Create Staff Account

    For BOSS to create MANAGER's accounts and for MANAGER to create EMPLOYEE's accounts
    - HTTP Method: POST
    - Path: /auth/register
    - Req Data:
        ```json
        {
            // staff id
            "username": "21020751",
            
            "password": "21020751",
            
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

## Manage Department
1. Create Department

    For BOSS to create Department
    - HTTP Method: POST
    - Path: department/create
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