import mongoose from "mongoose";
import shipStatus from "../constants/ship.status";
import Staff from "../models/staff";
import errorCode from "../constants/error.code";
import Transaction from "../models/transaction";
import Joi from "joi";

class TransactionValidator {
    constructor() { }
    schema_validate(body, requiredFields = []) {
        const statusValues = Object.values(shipStatus);
        let schema = Joi.object({
            shipment: Joi.string(),
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
    async create(req, res, next) {
        try {
            const { body } = req;

            const validator = new TransactionValidator();
            const schema_error = validator.schema_validate(body, [ "shipment", "pos", "des", "status" ]);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            const idRegex = /^[0-9a-fA-F]{24}$/;
            if (body.pos.match(idRegex)) {
                body.pos = new mongoose.Types.ObjectId(body.pos);
            }
            if (body.des.match(idRegex)) {
                body.des = new mongoose.Types.ObjectId(body.des);
            }
            body.start = Date.now();
            if (body.status === shipStatus.RECEIVED) {
                body.end = Date.now();
            } else {
                body.end = null;
            }

            let transaction = await Transaction.create(body);

            const payload = {
                transactionId: transaction._id,
                shipmentId: transaction.shipment
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