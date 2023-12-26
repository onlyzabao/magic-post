import Transaction from "../models/transaction";
import shipStatus from "../constants/ship.status";
import transactionType from "../constants/transaction.type";
import errorCode from "../constants/error.code";
import Joi from "joi";
import { forEach } from "lodash";

class TransactionValidator {
    constructor() { }
    schema_validate(body, requiredFields = []) {
        const statusValues = [ shipStatus.SENT, shipStatus.RECEIVED, shipStatus.HOLD, shipStatus.PASSED ];
        const transactionValue = Object.values(transactionType);
        let schema = Joi.object({
            type: Joi.string().valid(...transactionValue),
            shipment: Joi.string(),
            sender: Joi.string(),
            receiver: Joi.string(),
            start: Joi.date(),
            end: Joi.date(),
            pos: Joi.string(),
            des: Joi.string(),
            status: Joi.string().valid(...statusValues)
        });
        schema = schema.fork(requiredFields, (field) => field.required());

        if (Array.isArray(body)) {
            body.forEach(object => {
                const { error } = schema.validate(body);
                if (error) {
                    return {
                        ok: false,
                        errorCode: errorCode.PARAMS_INVALID,
                        message: error.details.map(x => x.message).join(", ")
                    };
                }
            });
        } else {
            const { error } = schema.validate(body);
            if (error) {
                return {
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                };
            }
        }
        return null;
    }
}

class TransactionService {
    constructor() { }
    async create(body) {
        const validator = new TransactionValidator;
        const schema_error = validator.schema_validate(body);
        if (schema_error) throw schema_error;

        let transaction = await Transaction.create(body);

        return transaction;
    }

    async list(query) {
        const filter = {};
        const queryFields = ['sender', 'receiver', 'pos', 'des', 'shipment', 'status', 'type'];
        const rangeFields = ['start', 'end'];
        Object.keys(query).forEach(key => {
            if (queryFields.includes(key)) {
                filter[key] = query[key];
            } else if (rangeFields.includes(key)) {
                let [min, max] = query[key].split(',');
                let range = {}
                if (min.length) range.$gte = new Date(min);
                if (max.length) range.$lte = new Date(max);
                filter[key] = range;
            }
        });

        const totalDocuments = await Transaction.countDocuments(filter);
        const sortFields = query.sort || null;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalDocuments / limit);

        const transactions = await Transaction.
            find(filter).
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
            }).
            select({
                type: 0
            }).
            sort(sortFields).
            skip(skip).
            limit(limit);

        return {
            page: page,
            totalPages: totalPages,
            transactions: transactions
        }
    }

    async update_many(ids, body) {
        const validator = new TransactionValidator;
        const schema_error = validator.schema_validate(body);
        if (schema_error) throw schema_error;

        let transactions = await Transaction.updateMany({ _id: { $in: ids } }, body);

        return transactions;
    }
}

export default new TransactionService()