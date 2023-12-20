import Transaction from "../models/transaction";
import shipStatus from "../constants/ship.status";
import errorCode from "../constants/error.code";
import Joi from "joi";

class TransactionValidator {
    constructor() { }
    schema_validate(body, requiredFields = []) {
        const statusValues = Object.values(shipStatus);
        let schema = Joi.object({
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
        const queryFields = ['sender', 'receiver', 'pos', 'des', 'shipment', 'status'];
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

        const transactions = await Transaction.find(filter);

        return transactions;
    }

    async update(req, res, next) {
        try {
            const { body, params } = req;
            const validator = new TransactionValidator;
            const schema_error = validator.schema_validate(body);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            let transaction = await Transaction.findById(params.id);
            if (!transaction) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.TRANSACTION.TRANSACTION_NOT_EXISTS
                });
            }
            Object.assign(transaction, body);
            transaction = await transaction.save();

            const payload = {
                transactionId: transaction._id
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

export default new TransactionService()