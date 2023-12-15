import DepartmentService from "../services/department.service";
import errorCode from "../constants/error.code";
import helper from "../utils/helper";

export default class DepartmentController {
    constructor() { }
    create = async (req, res) => {
        try {
            const { body } = req;
            const query = `${body.street}, ${body.district}, ${body.province}`;
            const { latitude, longitude } = await helper.getGeocoding(query);
            body.geocoding = [latitude, longitude];

            let department = await DepartmentService.create(body);

            const payload = {
                department: department
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

    update = async (req, res) => {
        try {
            const { body, params } = req;

            if (body.street || body.district || body.province) {
                if (!body.street || !body.district || !body.province) throw errorCode.DEPARTMENT.ADDRESS_PARAMS_INVALID;

                const query = `${body.street}, ${body.district}, ${body.province}`;
                const { latitude, longitude } = await helper.getGeocoding(query);
                body.geocoding = [latitude, longitude];
            }

            const department = await DepartmentService.update(params.id, body);

            const payload = {
                department: department
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


    list = async (req, res) => {
        try {
            const { query } = req;
            const departments = await DepartmentService.list(query);

            const payload = {
                departments: departments
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

    view = async (req, res) => {
        try {
            const { params } = req;
            const department = await DepartmentService.view(params.id);

            const payload = {
                department: department
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