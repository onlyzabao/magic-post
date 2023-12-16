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
            geocoding: Joi.array().items(Joi.number()).min(2).max(2),
            phone: Joi.string().pattern(/^\d{10}$/),
            type: Joi.string().valid(...typeValues),
            cfs: Joi.string(),
            zipcode: Joi.string().pattern(/^\d{6}$/),
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
    async create(body) {
        const validator = new DepartmentValidator;
        const schema_error = validator.schema_validate(body);
        if (schema_error) throw schema_error;

        body.active = true;
        let department = await Department.create(body);

        return department._id;
    }

    async update(id, body) {
        const validator = new DepartmentValidator;
        const schema_error = validator.schema_validate(body);
        if (schema_error) throw schema_error;

        let department = await Department.findById(id);
        if (!department) throw errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS;

        Object.assign(department, body);
        department = await department.save();

        return department._id;
    }

    async view(id) {
        let department = await Department.
            findById(id).
            populate({
                path: 'cfs',
                select: {
                    province: 1,
                    district: 1,
                    street: 1,
                    type: 1
                }
            });

        if (!department) throw errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS;

        return department;
    }

    async list(query) {
        const filter = {};
        const regexFields = ['province', 'district', 'street'];
        const queryFields = ['phone', 'type', 'cfs', 'zipcode', 'active'];
        Object.keys(query).forEach(key => {
            if (regexFields.includes(key)) {
                filter[key] = { $regex: query[key] };
            } else if (queryFields.includes(key)) {
                filter[key] = query[key];
            }
        });

        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        let departments = await Department.
            find(filter).
            select({
                province: 1,
                district: 1,
                street: 1,
                type: 1
            }).
            skip(skip).
            limit(limit);

        return departments;
    }

    async getProvinces() {
        const provinces = await Department.distinct('province', { active: true });
        return provinces;
    }

    async getDistricts(province) {
        const districts = await Department.distinct('district', { province: province, active: true });
        return districts;
    }
}

export default new DepartmentService();