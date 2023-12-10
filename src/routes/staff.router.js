import StaffController from "../controllers/staff.controller";
import staffRole from "../constants/staff.role"

export default [{
    controller: StaffController,
    methods: [
        {
            httpMethod: "post",
            path: "/staff/create/post-office-emp",
            method: "create_postoffice_emp",
            roles: [
                staffRole.POSTOFFICE_MANAGER
            ]
        },
        {
            httpMethod: "post",
            path: "/staff/create/post-office-mng",
            method: "create_postoffice_mng",
            roles: [
                staffRole.BOSS
            ]
        },
        {
            httpMethod: "post",
            path: "/staff/create/storage-emp",
            method: "create_storage_emp",
            roles: [
                staffRole.STORAGE_MANAGER
            ]
        },
        {
            httpMethod: "post",
            path: "/staff/create/storage-mng",
            method: "create_storage_mng",
            roles: [
                staffRole.BOSS
            ]
        },
        // {
        //     httpMethod: "put",
        //     path: "/staff/update/:id",
        //     method: "update",
        //     roles: [
        //         staffRole.BOSS,
        //         staffRole.STORAGE_MANAGER,
        //         staffRole.POSTOFFICE_MANAGER
        //     ]
        // },
        // {
        //     httpMethod: "get",
        //     path: "/staff/:id",
        //     method: "view_document",
        //     roles: [
        //         "ALL"
        //     ]
        // },
        // {
        //     httpMethod: "get",
        //     path: "/staff",
        //     method: "view_collection",
        //     roles: [
        //         "ALL"
        //     ]
        // },
    ]
}];