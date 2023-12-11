import errorCode from "../constants/error.code";
import shipStatus from "../constants/ship.status";
import shipmentType from "../constants/shipment.type";
import Shipment from "../models/shipment";
import Transaction from "../models/transaction";
import Joi from "joi";

class ShipmentValidator {
    constructor() { }
    schema_validate(body, requiredFields = []) {
        const statusValues = Object.values(shipStatus);
        const typeValues = Object.values(shipmentType);

        const itemSchema = Joi.object({
            name: Joi.string().required(),
            quantity: Joi.number().required(),
            value: Joi.number().required(),
        });

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
                item: Joi.array().items(itemSchema),
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

    async create(body) {
        const validator = new ShipmentValidator();
        const schema_error = validator.schema_validate(body);
        if (schema_error) throw schema_error;

        let shipment = await Shipment.create(body);

        return shipment._id;
    }

    async update(id, body) {
        const validator = new ShipmentValidator;
        const schema_error = validator.schema_validate(body);
        if (schema_error) throw schema_error;

        let shipment = await Shipment.findById(id);
        if (!shipment) throw errorCode.SHIPMENT.SHIPMENT_NOT_EXISTS

        for (const prop in body) {
            if (typeof body[prop] === "object" && shipment[prop]) {
                for (const subProp in body[prop]) {
                    shipment[prop][subProp] = body[prop][subProp] || shipment[prop][subProp];
                }
            } else {
                shipment[prop] = body[prop] || shipment[prop];
            }
        }
        shipment = await shipment.save();

        return shipment._id;
    }

    async view(id) {
        let shipment = await Shipment.
            findById(id).
            select({ __v: 0 });
        if (!shipment) throw errorCode.SHIPMENT.SHIPMENT_NOT_EXISTS;

        return shipment;
    }

    async track(id) {
        let transactions = await Transaction.
            find({ shipment: id }).
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

        return transactions;
    }

    async list(query) {
        const filter = query;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const shipments = await Shipment.find(filter).skip(skip).limit(limit);

        return shipments;
    }
}

export default new ShipmentService();
