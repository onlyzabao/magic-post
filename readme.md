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
## Manage Staff Account
1. Create Staff Account

    For boss to create manager's accounts and manager to create employee's accounts
    - HTTP Method: POST
    - Path: /api/v1/auth/register
    - Data:
        ```json
        {
            /* staff id */
            "username": "21020751",
            "password": "21020751",
            /* see constants/staff.role.js */
            "role": "STORAGE-MANAGER",
            /* if staff role is BOSS, no need for this field. Otherwise, it's the department id that the staff is working on */
            "department": "654df7b079626d8a284e9a75",  
            "name": "Nguyen Tran Gia Bao",
            "gender": "Male",
            "email": "only.zabao@example.com"
        }

        ```
