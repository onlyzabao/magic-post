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
                staffRole.POSTOFFICE_EMMPLOYEE
            ]
        },
        {
            httpMethod: "put",
            path: "/shipment/update/:id",
            method: "update",
            roles: [
                staffRole.POSTOFFICE_EMMPLOYEE
            ]
        },
        // {
        //     httpMethod: "get",
        //     path: "/shipment",
        //     method: "view_collection",
        //     roles: [
        //         "ALL"
        //     ]
        // },
        // {
        //     httpMethod: "get",
        //     path: "/shipment/:id",
        //     method: "view_document",
        //     roles: [
        //         "ALL"
        //     ]
        // }
    ]
}];