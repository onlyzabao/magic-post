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
                type: body.type,
                active: true
            }

            if (body.type === departmentType.POSTOFFICE) {
                if (!body.cfs || !body.zipcode) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.PARAMS_MISSING
                    })
                }

                let cfs = await Department.findById(body.cfs);
                if (!cfs) {
                    return res.status(404).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                    })
                }
                if (cfs.active === false) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_ACTIVE
                    })
                }
                departmentData.cfs = body.cfs;
                departmentData.zipcode = body.zipcode;
            }

            let department = await Department.create(departmentData);

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
            if (body.active !== undefined) updateFields.active = body.active;
            
            const departmentId = params.id;
            let department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                });
            }
            if (department.type !== departmentType.POSTOFFICE && updateFields.type === departmentType.POSTOFFICE) {
                if (!body.cfs || !body.zipcode) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.PARAMS_MISSING
                    })
                }

                let cfs = await Department.findById(body.cfs);
                if (!cfs) {
                    return res.status(404).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                    })
                }
                if (cfs.active === false) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_ACTIVE
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

    async view_document(req, res, next) {
        try {
            const { params } = req;

            const department = await Department.findById(params.id);
    
            if (!department) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                });
            }
            
            const payload = {
                department: department
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

    async view_collection(req, res, next) {
        try {
            const { query } = req;
            const { error } = validator.department_update(query);
            if (error) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                });
            }

            const filter = {};
            if (query.province) filter.province = query.province;
            if (query.district) filter.district = query.district;
            if (query.street) filter.street = query.street;
            if (query.type) filter.type = query.type;
            if (query.cfs) filter.cfs = query.cfs;
            if (query.zipcode) filter.zipcode = query.zipcode;
            if (query.active !== undefined) filter.active = query.active;

            const departments = await Department.find(filter);
            
            const payload = {
                departments: departments                
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