import errorCode from "../constants/error.code";
import shipStatus from "../constants/ship.status";
import shipmentType from "../constants/shipment.type";
import Shipment from "../models/shipment";
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

                "status"
            ]);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            body.meta.start = Date.now();
            body.meta.end = null;
            let shipment = await Shipment.create(body);

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

            next();
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
}

export default new ShipmentService();
