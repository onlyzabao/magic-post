import mongoose from "mongoose";
import shipStatus from "../constants/ship.status";
import Staff from "../models/staff";
import errorCode from "../constants/error.code";
import Transaction from "../models/transaction";
import Department from "../models/department";
import Shipment from "../models/shipment";
import Joi from "joi";
import staffRole from "../constants/staff.role";

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
    async department_validate(body, required = false) {
        if (body.pos) {
            let pos_department = Department.findById(body.pos);
            if (!pos_department) {
                return {
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                };
            }
            if (pos_department.active === false) {
                return {
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_ACTIVE
                };
            }
        }
        if (body.des) {
            let des_department = Department.findById(body.des);
            if (!des_department) {
                return {
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                };
            }
            if (des_department.active === false) {
                return {
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_ACTIVE
                };
            }
        }
        if (required && !(body.pos || body.des)) {
            return {
                ok: false,
                errorCode: errorCode.TRANSACTION.PARAMS_REQUIRED
            };
        }
        return null;
    }
    async staff_validate(body) {
        if (body.sender) {
            let sender = Staff.findById(body.sender);
            if (!sender) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.STAFF_NOT_EXISTS
                };
            }
            if (sender.active === false) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.STAFF_NOT_ACTIVE
                };
            }
        }
        if (body.receiver) {
            let receiver = Staff.findById(body.receiver);
            if (!receiver) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.STAFF_NOT_EXISTS
                };
            }
            if (sender.active === false) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.STAFF_NOT_ACTIVE
                };
            }
        }
        return null;
    }
    async shipment_validate(body) {
        if (body.shipment) {
            let shipment = Shipment.findById(body.shipment);
            if (!shipment) {
                return {
                    ok: false,
                    errorCode: errorCode.SHIPMENT.SHIPMENT_NOT_EXISTS
                };
            }
        }
        return null;
    }
}

class TransactionService {
    constructor() { }
    async create(req, res, next) {
        try {
            const { body } = req;

            const validator = new TransactionValidator;
            const schema_error = validator.schema_validate(body, ["shipment", "status"]);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }
            const shipment_error = await validator.shipment_validate(body);
            if (shipment_error) {
                return res.status(400).json(shipment_error);
            }
            const department_error = await validator.department_validate(body, true);
            if (department_error) {
                return res.status(400).json(department_error);
            }

            body.start = Date.now();
            body.sender = req.user._id;
            body.pos = req.user.department;
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
    async update(req, res, next) {
        try {
            const { body, params } = req;

            const validator = new TransactionValidator;
            const schema_error = validator.schema_validate(body);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }
            const shipment_error = await validator.shipment_validate(body);
            if (shipment_error) {
                return res.status(400).json(shipment_error);
            }
            const department_error = await validator.department_validate(body);
            if (department_error) {
                return res.status(400).json(department_error);
            }
            const staff_error = await validator.staff_validate(body);
            if (staff_error) {
                return res.status(400).json(staff_error);
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