import errorCode from "../constants/error.code";
import shipStatus from "../constants/ship.status";
import shipmentType from "../constants/shipment.type";
import Shipment from "../models/shipment";
import Joi from "joi";

class ShipmentValidator {
    constructor() { }
    schema_validate(body) {
        const statusValues = Object.values(shipStatus);
        const typeValues = Object.values(shipmentType);
        const schema = Joi.object({
            sender: Joi.object({
                name: Joi.string().required(),
                phone: Joi.string().required(),
                province: Joi.string().required(),
                district: Joi.string().required(),
                street: Joi.string().required(),
                zipcode: Joi.string().required(),
            }).required(),
            receiver: Joi.object({
                name: Joi.string().required(),
                phone: Joi.string().required(),
                province: Joi.string().required(),
                district: Joi.string().required(),
                street: Joi.string().required(),
                zipcode: Joi.string().required(),
            }).required(),
            meta: Joi.object({
                type: Joi.string().valid(...typeValues).required(),
                cost: Joi.number().required(),
                value: Joi.number(),
                weight: Joi.number(),
                note: Joi.string(),
            }).required(),
            status: Joi.string().valid(...statusValues).required()
        });

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
            const schema_error = validator.schema_validate(body);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

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
