import StaffController from "../controllers/staff.controller";
import staffRole from "../constants/staff.role"

export default [{
    controller: StaffController,
    methods: [
        {
            httpMethod: "post",
            path: "/staff/create",
            method: "create",
            roles: [
                staffRole.BOSS,
                staffRole.STORAGE_MANAGER,
                staffRole.POSTOFFICE_MANAGER
            ]
        },
        {
            httpMethod: "put",
            path: "/staff/update/:id",
            method: "update",
            roles: [
                staffRole.BOSS,
                staffRole.STORAGE_MANAGER,
                staffRole.POSTOFFICE_MANAGER
            ]
        },
        {
            httpMethod: "get",
            path: "/staff/:id",
            method: "view_document",
            roles: [
                "ALL"
            ]
        },
        {
            httpMethod: "get",
            path: "/staff",
            method: "view_collection",
            roles: [
                "ALL"
            ]
        },
    ]
}];