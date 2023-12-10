import TransactionService from "../services/transaction.service";
import ShipmentService from "../services/shipment.service";
import shipStatus from "../constants/ship.status";

export default class TransactionController {
    constructor() { }
    receive_shipment = async (req, res) => {
        req.body.meta.start = Date.now();
        req.body.status = shipStatus.PREPARING;
        await ShipmentService.create(req, res);

        req.body = {
            shipment: res.data.payload.shipmentId,
            start: Date.now(),
            end: Date.now() + 1000,
            receiver: req.user._id.toString(),
            des: req.user.department.toString(),
            status: shipStatus.RECEIVED
        };
        await TransactionService.create(req, res);

        if (res.status !== 200) {
            await Shipment.findByIdAndDelete(res.data.payload.shipmentId);
        }
    }
    update = async (req, res) => TransactionService.update(req, res);
}