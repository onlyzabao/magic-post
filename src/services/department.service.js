import errorCode from "../constants/error.code";
import validator from "../utils/validator";
import Department from "../models/department";
import departmentType from "../constants/department.type";
import logger from "../utils/logger";

class DepartmentService {
    constructor() { }
    async create(req, res, next) {
        try {
            const { body } = req;
            const { error } = validator.department_create(body);
            if (error) {
                return res.status(400).json({
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                });
            }

            let departmentData = {
                province: body.province,
                district: body.district,
                street: body.street,
                type: body.type
            }

            if (body.type === departmentType.POSTOFFICE) {
                if (!body.cfs || !body.zipcode) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.PARAMS_MISSING
                    })
                }

                let department = await Department.findById(body.cfs);
                if (!department) {
                    return res.status(404).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                    })
                }
                departmentData.cfs = body.cfs;
                departmentData.zipcode = body.zipcode;
            }

            let department = await Department.create(departmentData);

            const payload = {
                departmentId: department._id
            }
            // const token = jwt.sign(payload, systemConfig.get("secret"), {
            //     expiresIn: ms('1y')
            // });
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    // token: `Bearer ${token}`,
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
            const { error } = validator.department_update(body);
            if (error) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                });
            }
            
            const updateFields = {};
            if (body.province) updateFields.province = body.province;
            if (body.district) updateFields.district = body.district;
            if (body.street) updateFields.street = body.street;
            if (body.type) updateFields.type = body.type;
            
            const departmentId = params.id;
            let department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                });
            }
            if (department.type === departmentType.POSTOFFICE || updateFields.type === departmentType.POSTOFFICE) {
                if (!body.cfs || !body.zipcode) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.PARAMS_MISSING
                    })
                }

                let department = await Department.findById(body.cfs);
                if (!department) {
                    return res.status(404).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                    })
                }
                updateFields.cfs = body.cfs;
                updateFields.zipcode = body.zipcode;
            }

            Object.assign(department, updateFields);

            department = await department.save();

            const payload = {
                departmentId: department._id
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
            return res.status(500).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
}

export default new DepartmentService();