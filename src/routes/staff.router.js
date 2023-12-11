import StaffController from "../controllers/staff.controller";
import staffRole from "../constants/staff.role"

export default [{
    controller: StaffController,
    methods: [
        {
            httpMethod: "post",
            path: "/staff/employee/create",
            method: "create_employee",
            roles: [
                staffRole.POSTOFFICE_MANAGER,
                staffRole.STORAGE_MANAGER
            ]
        },
        {
            httpMethod: "post",
            path: "/staff/manager/create",
            method: "create_manager",
            roles: [
                staffRole.BOSS
            ]
        },
        {
            httpMethod: "put",
            path: "/staff/employee/update/:id",
            method: "update_employee",
            roles: [
                staffRole.POSTOFFICE_MANAGER,
                staffRole.STORAGE_MANAGER
            ]
        },
        {
            httpMethod: "put",
            path: "/staff/manager/update/:id",
            method: "update_manager",
            roles: [
                staffRole.BOSS
            ]
        },
        {
            httpMethod: "get",
            path: "/staff/employee/:id",
            method: "view_employee",
            roles: [
                staffRole.POSTOFFICE_MANAGER,
                staffRole.STORAGE_MANAGER
            ]
        },
        {
            httpMethod: "get",
            path: "/staff/employee",
            method: "list_employee",
            roles: [
                staffRole.POSTOFFICE_MANAGER,
                staffRole.STORAGE_MANAGER
            ]
        },
        {
            httpMethod: "get",
            path: "/staff/manager/:id",
            method: "view_manager",
            roles: [
                staffRole.BOSS
            ]
        },
        {
            httpMethod: "get",
            path: "/staff/manager",
            method: "list_manager",
            roles: [
                staffRole.BOSS
            ]
        },
    ]
}];