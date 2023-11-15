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
    ]
}];