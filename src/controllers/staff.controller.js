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
            if (!cookies['view-employee']) throw errorCode.AUTH.ROLE_INVALID;
            if (body.role || body.department) throw errorCode.AUTH.ROLE_INVALID;
            const employee = await StaffService.update(params.id, body);

            res.clearCookie('view-employee');

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
            if (!cookies['list-employee']) throw errorCode.AUTH.ROLE_INVALID;
            const employee = await StaffService.view(params.id);

            res.clearCookie('list-employee');
            res.cookie('view-employee', true, { httpOnly: true });

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
            const employees = await StaffService.list(query);

            res.cookie('list-employee', true, { httpOnly: true });

            const payload = {
                employees: employees
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
            if (!cookies['view-manager']) throw errorCode.AUTH.ROLE_INVALID;
            if (body.role && !staffRole.isManager(body.role)) throw errorCode.AUTH.ROLE_INVALID;
            const manager = await StaffService.update(params.id, body);

            res.clearCookie('view-manager');

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
            if (!cookies['list-manager']) throw errorCode.AUTH.ROLE_INVALID;
            const manager = await StaffService.view(params.id);

            res.clearCookie('list-manager');
            res.cookie('view-manager', true, { httpOnly: true });

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
            query.role = [ staffRole.POSTOFFICE_MANAGER, staffRole.STORAGE_MANAGER ];
            const managers = await StaffService.list(query);

            res.cookie('list-manager', true, { httpOnly: true });

            const payload = {
                managers: managers
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