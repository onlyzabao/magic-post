import StaffService from "../services/staff.service";
import staffRole from "../constants/staff.role";
import errorCode from "../constants/error.code";
import jwt from "jsonwebtoken";
import systemConfig from "config";
import ms from "ms";
import * as _ from "lodash";

export default class StaffController {
    constructor() {}
    create_employee = async (req, res) => {
        try {
            const { body } = req;
            const manager = req.user;
            body.department = manager.department.toString();
            body.role = manager.role.split("-")[0] + "-EMPLOYEE";
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
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            })
        }
    }

    update_employee = async (req, res) => {
        try {
            const { body, params, cookies } = req;
            if (body.role || body.department) throw errorCode.AUTH.ROLE_INVALID;
            const employee = await StaffService.update(params.id, body);

            const payload = {
                employee: employee
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
            })
        }
    }

    view_employee = async (req, res) => {
        try {
            const { params, cookies } = req;
            const employee = await StaffService.view(params.id);

            const payload = {
                employee: employee
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
            })
        }
    }

    list_employee = async (req, res) => {
        try {
            const { query } = req;
            const manager = req.user;
            query.department = manager.department;
            query.role = staffRole.getEmployee();
            const employees = await StaffService.list(query);

            const payload = {
                ...employees
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
            })
        }
    }

    create_manager = async (req, res) => {
        try {
            const { body } = req;
            if (body.role && !staffRole.isManager(body.role)) throw errorCode.AUTH.ROLE_INVALID;
            const manager = await StaffService.create(body);

            const payload = {
                manager: manager
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
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            })
        }
    }

    update_manager = async (req, res) => {
        try {
            const { body, params } = req;
            if (body.role && !staffRole.isManager(body.role)) throw errorCode.AUTH.ROLE_INVALID;
            const manager = await StaffService.update(params.id, body);

            const payload = {
                manager: manager
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
            })
        }
    }

    view_manager = async (req, res) => {
        try {
            const { params, cookies } = req;
            const manager = await StaffService.view(params.id);

            const payload = {
                manager: manager
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
            })
        }
    }

    list_manager = async (req, res) => {
        try {
            const { query } = req;
            if (!query.role) {
                query.role = staffRole.getManager();
            } else {
                if (staffRole.isEmployee(query.role)) throw errorCode.AUTH.ROLE_INVALID;
            }
            const managers = await StaffService.list(query);

            const payload = {
                ...managers
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
            })
        }
    }
}