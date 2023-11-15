import AuthController from "../controllers/auth.controller";
import staffRole from "../constants/staff.role"
// Methods is array and item structure is "HTTP_METHOD:API_NAME:ROLE1,ROLE2:STATUS_USER1,STATUS_USER2";
// only checking logined then entering ROLE = ALL or all
// not check status user then STATUS_USER = empty => `GET:login:${role.ADMIN};

export default [{
    controller: AuthController,
    methods: [
        {
            httpMethod: "post",
            path: "/auth/login",
            method: "login"
        },
    ]
}];