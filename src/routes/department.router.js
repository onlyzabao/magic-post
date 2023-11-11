import DepartmentController from "../controllers/department.controller";
import staffRole from "../constants/staff.role"

export default [{
    controller: DepartmentController,
    methods: [
        {
            httpMethod: "post",
            path: "/department/create",
            method: "create",
            roles: [
                staffRole.BOSS
            ]
        }
    ]
}];