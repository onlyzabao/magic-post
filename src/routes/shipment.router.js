import ShipmentController from "../controllers/shipment.controller";
import staffRole from "../constants/staff.role"

export default [{
    controller: ShipmentController,
    methods: [
        {
            httpMethod: "post",
            path: "/shipment/create",
            method: "create",
            roles: [
                staffRole.POSTOFFICE_EMPLOYEE
            ]
        },
        {
            httpMethod: "get",
            path: "/shipment/track/:id",
            method: "track"
        },
        {
            httpMethod: "get",
            path: "/shipment/all",
            method: "list_all",
            roles: [
                staffRole.BOSS
            ]
        },
        {
            httpMethod: "get",
            path: "/shipment/department/:id",
            method: "list_from_department",
            roles: [
                staffRole.BOSS,
                staffRole.POSTOFFICE_MANAGER,
                staffRole.STORAGE_MANAGER
            ]
        },
        // {
        //     httpMethod: "put",
        //     path: "/shipment/update-info/:id",
        //     method: "update_info",
        //     roles: [
        //         staffRole.POSTOFFICE_EMPLOYEE
        //     ]
        // },
    ]
}];