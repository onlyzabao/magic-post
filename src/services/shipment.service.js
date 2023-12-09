import errorCode from "../constants/error.code";
import shipStatus from "../constants/ship.status";
import shipmentType from "../constants/shipment.type";
import Shipment from "../models/shipment";
import transaction from "../models/transaction";
import Transaction from "../models/transaction";
import Joi from "joi";

class ShipmentValidator {
    constructor() { }
    schema_validate(body, requiredFields = []) {
        const statusValues = Object.values(shipStatus);
        const typeValues = Object.values(shipmentType);
        let schema = Joi.object({
            sender: Joi.object({
                name: Joi.string(),
                phone: Joi.string(),
                province: Joi.string(),
                district: Joi.string(),
                street: Joi.string(),
                zipcode: Joi.string(),
            }),
            receiver: Joi.object({
                name: Joi.string(),
                phone: Joi.string(),
                province: Joi.string(),
                district: Joi.string(),
                street: Joi.string(),
                zipcode: Joi.string(),
            }),
            meta: Joi.object({
                type: Joi.string().valid(...typeValues),
                cost: Joi.number(),
                start: Joi.date(),
                end: Joi.date(),
                value: Joi.number(),
                weight: Joi.number(),
                note: Joi.string(),
            }),
            status: Joi.string().valid(...statusValues)
        });
        schema = schema.fork(requiredFields, (field) => field.required());

        const { error } = schema.validate(body);
        if (error) {
            return {
                ok: false,
                errorCode: errorCode.PARAMS_INVALID,
                message: error.details.map(x => x.message).join(", ")
            };
        }
        return null;
    }
}


class ShipmentService {
    constructor() { }
    async create(req, res, next) {
        try {
            const { body } = req;

            const validator = new ShipmentValidator();
            const schema_error = validator.schema_validate(body, [
                "sender",
                    "sender.name",
                    "sender.phone",
                    "sender.province",
                    "sender.district",
                    "sender.street",
                    "sender.zipcode",

                "receiver",
                    "receiver.name",
                    "receiver.phone",
                    "receiver.province",
                    "receiver.district",
                    "receiver.street",
                    "receiver.zipcode",

                "meta.type",
                "meta.cost",
            ]);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            body.meta.start = Date.now();
            body.status = shipStatus.PREPARING;
            let shipment = await Shipment.create(body);

            req.body = {
                shipment: shipment._id.toString(),
                end: Date.now() + 1000,
                receiver: req.user._id.toString(),
                des: req.user.department.toString(),
                status: shipStatus.RECEIVED
            };

            next(req, res);

            if (res.statusCode !== 200) {
                await Shipment.findByIdAndDelete(shipment._id);
            }
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
    async update(req, res, next) {
        try {
            const { body, params } = req;
            const validator = new ShipmentValidator;

            const schema_error = validator.schema_validate(body);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            let shipment = await Shipment.findById(params.id);
            if (!shipment) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.SHIPMENT.SHIPMENT_NOT_EXISTS
                });
            }

            for (const prop in req.body) {
                if (typeof req.body[prop] === "object" && shipment[prop]) {
                    for (const subProp in req.body[prop]) {
                        shipment[prop][subProp] = req.body[prop][subProp] || shipment[prop][subProp];
                    }
                } else {
                    shipment[prop] = req.body[prop] || shipment[prop];
                }
            }
            shipment = await shipment.save();

            const payload = {
                shipmentId: shipment._id
            }
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
    async view_document(req, res, next) {
        try {
            const { params } = req;

            const shipment = await Shipment.
                findById(params.id).
                select({ __v: 0 });
            if (!shipment) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.SHIPMENT.SHIPMENT_NOT_EXISTS
                });
            }

            const transactions = await Transaction.
                find({ shipment: params.id }).
                select({ start: 1, end: 1, pos: 1, des: 1, status: 1 }).
                populate({
                    path: 'pos',
                    select: {
                        province: 1,
                        district: 1,
                        street: 1,
                        type: 1
                    }
                }).
                populate({
                    path: 'des',
                    select: {
                        province: 1,
                        district: 1,
                        street: 1,
                        type: 1
                    }
                });

            const payload = {
                shipment: shipment,
                transactions: transactions
            }
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(500).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
    async view_collection(req, res, next) {
        try {
            const { query } = req;

            const filter = query;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;
            const shipments = await Shipment.find(filter).skip(skip).limit(limit);

            const payload = {
                shipments: shipments
            }
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(500).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
}

export default new ShipmentService();
