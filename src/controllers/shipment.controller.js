import ShipmentService from "../services/shipment.service";

export default class ShipmentController {
    constructor() {}
    create = async (req, res) => ShipmentService.create(req, res);
    // update = async (req, res) => ShipmentService.update(req, res);
    // view_collection = async (req, res) => ShipmentService.view_collection(req, res);
    // view_document = async (req, res) => ShipmentService.view_document(req, res);
}