import errorCode from "../constants/error.code";
import Department from "../models/department";
import departmentType from "../constants/department.type";
import logger from "../utils/logger";
import Joi from "joi";

class DepartmentValidator {
    constructor() { }
    schema_validate(body, requiredFields = []) {
        const typeValues = Object.values(departmentType);
        let schema = Joi.object({
            province: Joi.string(),
            district: Joi.string(),
            street: Joi.string(),
            type: Joi.string().valid(...typeValues),
            cfs: Joi.string(),
            zipcode: Joi.string(),
            active: Joi.boolean()
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

class DepartmentService {
    constructor() { }
    async create(req, res, next) {
        try {
            const { body } = req;
            const validator = new DepartmentValidator;

            const schema_error = validator.schema_validate(body, [
                "province",
                "district",
                "street",
                "type"
            ]);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            body.active = true;

            let department = await Department.create(body);

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
            const validator = new DepartmentValidator;

            const schema_error = validator.schema_validate(body);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }
        
            let department = await Department.findById(params.id);
            if (!department) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                });
            }
            
            if (body.type) {
                const type_error = await validator.type_validate(body);
                if (type_error) {
                    return res.status(400).json(type_error);
                }
                if (body.type === departmentType.STORAGE) {
                    body.cfs = undefined;
                    body.zipcode = undefined;
                }
            }

            Object.assign(department, body);

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

            const filter = {};
            const queryFields = ['province', 'district', 'street', 'type', 'cfs', 'zipcode', 'active'];
            Object.keys(query).forEach(key => {
                if (queryFields.includes(key)) {
                    filter[key] = query[key];
                }
            });

            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;

            const departments = await Department.find(filter).skip(skip).limit(limit);
            
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