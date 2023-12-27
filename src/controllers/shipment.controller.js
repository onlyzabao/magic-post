import ShipmentService from "../services/shipment.service";
import TransactionService from "../services/transaction.service";
import errorCode from "../constants/error.code";
import shipStatus from "../constants/ship.status";
import transactionType from "../constants/transaction.type";
import Shipment from "../models/shipment";
import Department from "../models/department";
import * as _ from "lodash";
import Transaction from "../models/transaction";
import shipment from "../models/shipment";

export default class ShipmentController {
    constructor() { }
    create = async (req, res) => {
        try {
            const { body } = req;

            let pos_department = await Department.findById(req.user.department).select({ geocoding: 1 });

            let des_department = await Department.find({
                province: body.receiver.province,
                district: body.receiver.district
            }).select({ geocoding: 1 });
            if (!des_department.length) throw errorCode.DEPARTMENT.ADDRESS_NOT_SUPPORTED;
            else des_department = des_department[0];

            body.meta.cost = await ShipmentService.calculateCost(
                pos_department.geocoding,
                des_department.geocoding,
                body.weight || 0
            );
            body.meta.start = Date.now();
            body.status = shipStatus.PREPARING;
            var shipment = await ShipmentService.create(body);

            const transaction_body = {
                type: transactionType.CtP,
                shipment: shipment.toString(),
                start: Date.now(),
                end: Date.now() + 1000,
                receiver: req.user.username.toString(),
                des: req.user.department.toString(),
                status: shipStatus.RECEIVED
            };
            var transaction = await TransactionService.create(transaction_body);

            const payload = {
                shipment: shipment,
            };
            return res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            if (!transaction) await Shipment.findByIdAndDelete(shipment)

            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }

    nationwide_list = async (req, res) => {
        try {
            const { query } = req;
            var shipments = await ShipmentService.list(query);

            const payload = {
                ...shipments
            }
            return res.status(200).json({
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
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }

    department_list = async (req, res) => {
        try {
            const { query, params } = req;

            // List shipments that belong to a department
            const department = params.id ? params.id : req.user.department;
            var transactions_list = await TransactionService.list(
                {
                    [params.type === 'send' ? 'pos' : 'des']: department,
                    ...(query.employee ? { [params.type === 'send' ? 'sender' : 'receiver']: query.employee } : {}),
                    ...(query.type ? { type: query.type } : {}),
                    ...(query.start ? { start: query.start } : {}),
                    ...(query.end ? { end: query.end } : {}),
                    ...(query.transaction_status ? { status: query.transaction_status } : {}),
                    limit: 1000000
                },
                {
                    [params.type === 'send' ? 'receiver' : 'sender']: 0,
                    [params.type === 'send' ? 'pos' : 'des']: 0,
                }
            );
            var transactions = transactions_list.transactions;

            // Query from that listed shipments
            var shipments_list = await ShipmentService.list(query, transactions.map(element => element.shipment));
            var shipments = shipments_list.shipments;

            transactions = transactions.map(transaction => {
                const shipment = shipments.find(shipment => shipment._id.toString() === transaction.shipment.toString());
                if (!shipment) return null;
                delete transaction._doc.shipment;
                return { ...transaction._doc, shipment: shipment };
            }).filter(Boolean);

            const payload = {
                page: transactions_list.page,
                totalPages: transactions_list.totalPages,
                transactions: transactions
            }
            return res.status(200).json({
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
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }

    track = async (req, res) => {
        try {
            const { params } = req;
            var shipment = await ShipmentService.view(params.id);
            var transactions = await ShipmentService.track(params.id);

            const payload = {
                shipment: shipment,
                transactions: transactions
            }
            return res.status(200).json({
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
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }

    calculate_cost = async (req, res) => {
        try {
            const { body } = req;

            let pos_department = await Department.find({
                province: body.sender.province,
                district: body.sender.district
            }).select({ geocoding: 1 });
            if (!pos_department.length) throw errorCode.DEPARTMENT.ADDRESS_NOT_SUPPORTED;
            else pos_department = pos_department[0];

            let des_department = await Department.find({
                province: body.receiver.province,
                district: body.receiver.district
            }).select({ geocoding: 1 });
            if (!des_department.length) throw errorCode.DEPARTMENT.ADDRESS_NOT_SUPPORTED;
            else des_department = des_department[0];

            const cost = await ShipmentService.calculateCost(
                pos_department.geocoding,
                des_department.geocoding,
                body.weight || 0
            );

            const payload = {
                cost: cost
            }
            return res.status(200).json({
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
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
}