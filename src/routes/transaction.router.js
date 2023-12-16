import TransactionController from "../controllers/transaction.controller";
import staffRole from "../constants/staff.role"

export default [{
    controller: TransactionController,
    methods: [
        {
            httpMethod: "post",
            path: "/transaction/receive-shipment",
            method: "receive_shipment",
            roles: [
                staffRole.POSTOFFICE_EMPLOYEE
            ]
        },
        {
            httpMethod: "put",
            path: "/transaction/update/:id",
            method: "update",
            roles: [
                staffRole.POSTOFFICE_EMPLOYEE,
                staffRole.STORAGE_EMPLOYEE
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