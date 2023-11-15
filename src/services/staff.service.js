import helper from "../utils/helper";
import errorCode from "../constants/error.code";
import jwt from "jsonwebtoken";
import systemConfig from "config";
import ms from "ms";
import * as _ from "lodash";
import Staff from "../models/staff";
import Department from "../models/department";
import staffRole from "../constants/staff.role";
import departmentType from "../constants/department.type";
import Joi from "joi";

class StaffValidator {
    constructor() { }
    schema_validate(body, requiredFields = []) {
        const roleValues = Object.values(staffRole);
        const schema = {
            username: Joi.string(),
            password: Joi.string(),
            role: Joi.string().valid(...roleValues),
            department: Joi.string(),
            name: Joi.string(),
            gender: Joi.string().valid("Male", "Female", "Other"),
            email: Joi.string().email(),
            active: Joi.boolean()
        };

        requiredFields.forEach(field => {
            if (schema[field]) {
                schema[field] = schema[field].required();
            }
        });

        const { error } = Joi.object().keys(schema).validate(body);
        if (error) {
            return {
                ok: false,
                errorCode: errorCode.PARAMS_INVALID,
                message: error.details.map(x => x.message).join(", ")
            };
        }
        return null;
    }
    async username_validate(body) {
        let user = await Staff.findOne({ username: body.username });
        if (user) {
            return {
                ok: false,
                errorCode: errorCode.REGISTER.USERNAME_EXISTS
            }
        }
        return null;
    }
    role_validate(body, payload) {
        if (payload.role === staffRole.POSTOFFICE_MANAGER) {
            if (body.role !== staffRole.POSTOFFICE_EMMPLOYEE) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.PARAMS_INVALID
                }
            }
        }
        if (payload.role === staffRole.STORAGE_MANAGER) {
            if (body.role !== staffRole.STORAGE_EMMPLOYEE) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.PARAMS_INVALID
                }
            }
        }
        return null;
    }
    async department_validate(body, payload) {
        let department = await Department.findById(body.department);
        if (!department) {
            return {
                ok: false,
                errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
            }
        }
        if (payload.role !== staffRole.BOSS) {
            let manager = await Staff.findOne({ username: payload.username });
            if (manager.department !== department._id) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.PERMISSION_DENIED
                }
            }
        }
        if (department.type === departmentType.STORAGE) {
            if (!(body.role === staffRole.STORAGE_EMMPLOYEE || body.role === staffRole.STORAGE_MANAGER)) {
                return {
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.PARAMS_INVALID
                }
            }
        }
        if (department.type === departmentType.POSTOFFICE) {
            if (!(body.role === staffRole.POSTOFFICE_EMMPLOYEE || body.role === staffRole.POSTOFFICE_MANAGER)) {
                return {
                    ok: false,
                    errorCode: errorCode.DEPARTMENT.PARAMS_INVALID
                }
            }
        }
        if (department.active === false) {
            return {
                ok: false,
                errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_ACTIVE
            }
        }
        return null;
    }
}

class StaffService {
    constructor() { }
    async create(req, res, next) {
        try {
            const { body } = req;
            const validator = new StaffValidator;

            const schema_error = validator.schema_validate(body, [
                "username",
                "password",
                "role",
                "name",
                "gender",
                "email"
            ]);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            const username_error = await validator.username_validate(body);
            if (username_error) {
                return res.status(400).join(username_error);
            }

            const role_error = validator.role_validate(body, req.payload);
            if (role_error) {
                return res.status(400).join(role_error);
            }

            const department_error = await validator.department_validate(body, req.payload);
            if (department_error) {
                return res.status(400).join(department_error);
            }

            body.password = helper.generateHash(body.password);
            body.active = true;
            const user = await Staff.create(body);

            const payload = {
                username: user.username,
                role: user.role,
            }
            const token = jwt.sign(payload, systemConfig.get("secret"), {
                expiresIn: ms('1y')
            });
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    token: `Bearer ${token}`,
                    payload: {
                        ...payload,
                        username: payload.username
                    }
                }

            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            })
        }
    }

    async view_document(req, res, next) {
        try {
            const { params } = req;

            const staff = await Staff.findOne({ username: params.id });
            if (!staff) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.STAFF.STAFF_NOT_EXISTS
                });
            }

            const payload = {
                staff: staff
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

            const validator = new StaffValidator;
            const schema_error = validator.schema_validate(query);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            const filter = {};
            const queryFields = ['username', 'role', 'department', 'name', 'gender', 'email', 'active'];
            Object.keys(query).forEach(key => {
                if (queryFields.includes(key)) {
                    filter[key] = query[key];
                }
            });

            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;

            const staffs = await Staff.find(filter).skip(skip).limit(limit);

            const payload = {
                staffs: staffs
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

    async update(req, res, next) {
        try {
            const { body, params } = req;

            let staff = await Staff.findOne({ username: params.id });
            if (!staff) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.STAFF.STAFF_NOT_EXISTS
                });
            }

            const validator = new StaffValidator;

            const schema_error = validator.schema_validate(body);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }
            
            if (body.username) {
                const username_error = await validator.username_validate(body);
                if (username_error) {
                    return res.status(400).join(username_error);
                }
            }
            if (body.password) {
                body.password = helper.generateHash(body.password);
            }
            if (body.role || body.department) {
                const role_error = validator.role_validate(body, req.payload);
                if (role_error) {
                    return res.status(400).join(role_error);
                }
                const department_error = await validator.department_validate(body, req.payload);
                if (department_error) {
                    return res.status(400).join(department_error);
                }
            }

            Object.assign(staff, body);

            staff = await staff.save();

            const payload = {
                staffId: staff.username
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

export default new StaffService();