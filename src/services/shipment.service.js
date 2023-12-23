import errorCode from "../constants/error.code";
import shipStatus from "../constants/ship.status";
import shipmentType from "../constants/shipment.type";
import Shipment from "../models/shipment";
import Transaction from "../models/transaction";
import Department from "../models/department";
import Joi from "joi";

class ShipmentValidator {
    constructor() { }
    schema_validate(body, requiredFields = []) {
        const statusValues = Object.values(shipStatus);
        const typeValues = Object.values(shipmentType);

        const itemSchema = Joi.object({
            name: Joi.string().required(),
            quantity: Joi.number().integer().min(0).required(),
            value: Joi.number().integer().min(0).required(),
        });

        let schema = Joi.object({
            sender: Joi.object({
                name: Joi.string(),
                phone: Joi.string().pattern(/^\d{10}$/),
                province: Joi.string(),
                district: Joi.string(),
                street: Joi.string(),
                zipcode: Joi.string().pattern(/^\d{6}/),
            }),
            receiver: Joi.object({
                name: Joi.string(),
                phone: Joi.string().pattern(/^\d{10}$/),
                province: Joi.string(),
                district: Joi.string(),
                street: Joi.string(),
                zipcode: Joi.string().pattern(/^\d{6}$/),
            }),
            meta: Joi.object({
                type: Joi.string().valid(...typeValues),
                cost: Joi.number().integer().min(0),
                start: Joi.date(),
                end: Joi.date(),
                item: Joi.array().items(itemSchema),
                weight: Joi.number().min(0),
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

    async list(query, src=undefined) {
        const filter = {};
        if (src) filter._id = { $in: src };
        
        const regexFields = [
            'sender.name',
            'sender.province',
            'sender.district',
            'sender.street',
            'sender.phone',
            'sender.zipcode',
            'receiver.name',
            'receiver.province',
            'receiver.district',
            'receiver.street',
            'receiver.phone',
            'receiver.zipcode',
        ];
        const queryFields = [
            'meta.type',
            'status'
        ];
        const rangeFields = [
            'meta.start',
            'meta.end',
            'meta.cost',
            'meta.weight'
        ]
        Object.keys(query).forEach(key => {
            if (regexFields.includes(key)) {
                filter[key] = { $regex: query[key] };
            } else if (queryFields.includes(key)) {
                filter[key] = query[key];
            } else if (rangeFields.includes(key)) {
                let [min, max] = query[key].split(',');
                let range = {}

                const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
                const numberFormatRegex = /^\d+$/;

                if (min.length) {
                    if (dateFormatRegex.test(min)) min = new Date(min);
                    else if (numberFormatRegex.test(min)) min = Number(min);

                    range.$gte = min;
                }
                if (max.length) {
                    if (dateFormatRegex.test(max)) max = new Date(max);
                    else if (numberFormatRegex.test(max)) max = Number(max);

                    range.$lte = max;
                }

                filter[key] = range;
            }
        });

        const totalDocuments = await Shipment.countDocuments(filter);
        const sortFields = query.sort || null;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalDocuments / limit);

        const shipments = await Shipment.
            find(filter).
            sort(sortFields).
            skip(skip).
            limit(limit);

        return {
            page: page,
            totalPages: totalPages,
            shipments: shipments
        }
    }

    async calculateCost(pos_department, des_location, weight) {
        let pos_geocoding = await Department.findById(pos_department).select({ geocoding: 1 });
        if (!pos_geocoding) throw errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS;
        else pos_geocoding = pos_geocoding.geocoding;

        let des_geocoding = await Department.find(des_location).select({ geocoding: 1 });
        if (!des_geocoding.length) throw errorCode.DEPARTMENT.ADDRESS_NOT_SUPPORTED;
        else des_geocoding = des_geocoding[0].geocoding;

        // Calculate distance
        const R = 6371; // metres
        const φ1 = pos_geocoding[0] * Math.PI / 180; // φ, λ in radians
        const φ2 = des_geocoding[0] * Math.PI / 180;
        const Δφ = (des_geocoding[0] - pos_geocoding[0]) * Math.PI / 180;
        const Δλ = (des_geocoding[0] - pos_geocoding[0]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // in kilometers

        // Calculate cost
        let extra;
        if (!weight) extra = 1;
        else if (weight <= 500) extra = 1.1;
        else if (weight <= 1000) extra = 1.2;
        else if (weight <= 2000) extra = 1.3;
        else if (weight <= 4000) extra = 1.4;
        else extra = 1.5;

        const cost = distance * extra;

        return Math.round(cost) * 100
    }
}

export default new ShipmentService();
