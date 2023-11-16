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
        },
        {
            httpMethod: "put",
            path: "/department/update/:id",
            method: "update",
            roles: [
                staffRole.BOSS
            ]
        },
        {
            httpMethod: "get",
            path: "/department",
            method: "view_collection",
            roles: [
                "ALL"
            ]
        },
        {
            httpMethod: "get",
            path: "/department/:id",
            method: "view_document",
            roles: [
                "ALL"
            ]
        }
    ]
}];