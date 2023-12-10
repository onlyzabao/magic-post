import StaffService from "../services/staff.service";
import staffRole from "../constants/staff.role";
import errorCode from "../constants/error.code";
import jwt from "jsonwebtoken";
import systemConfig from "config";
import ms from "ms";
import * as _ from "lodash";

export default class StaffController {
    constructor() {}
    create_postoffice_emp = async (req, res) => {
        try {
            const { body } = req;
            const manager = req.user;
            body.department = manager.department.toString();
            body.role = staffRole.POSTOFFICE_EMMPLOYEE;
            const employee = await StaffService.create(body);

            const payload = {
                employee: employee
            }
            const token = jwt.sign(payload, systemConfig.get("secret"), {
                expiresIn: ms('1y')
            });
            return res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    token: `Bearer ${token}`,
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode,
                message: e.message
            })
        }
    }

    create_postoffice_mng = async (req, res) => {
        try {
            const { body } = req;
            body.role = staffRole.POSTOFFICE_MANAGER;
            const employee = await StaffService.create(body);

            const payload = {
                employee: employee
            }
            const token = jwt.sign(payload, systemConfig.get("secret"), {
                expiresIn: ms('1y')
            });
            return res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    token: `Bearer ${token}`,
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode,
                message: e.message
            })
        }
    }

    create_storage_emp = async (req, res) => {
        try {
            const { body } = req;
            const manager = req.user;
            body.department = manager.department.toString();
            body.role = staffRole.STORAGE_EMMPLOYEE;
            const employee = await StaffService.create(body);

            const payload = {
                employee: employee
            }
            const token = jwt.sign(payload, systemConfig.get("secret"), {
                expiresIn: ms('1y')
            });
            return res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    token: `Bearer ${token}`,
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode,
                message: e.message
            })
        }
    }

    create_storage_mng = async (req, res) => {
        try {
            const { body } = req;
            body.role = staffRole.STORAGE_MANAGER;
            const employee = await StaffService.create(body);

            const payload = {
                employee: employee
            }
            const token = jwt.sign(payload, systemConfig.get("secret"), {
                expiresIn: ms('1y')
            });
            return res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    token: `Bearer ${token}`,
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode,
                message: e.message
            })
        }
    }

    // view_document = async (req, res) => StaffService.view_document(req, res);
    // view_collection = async (req, res) => StaffService.view_collection(req, res);
    // update = async (req, res) => StaffService.update(req, res);
}