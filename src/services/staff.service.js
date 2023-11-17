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
        let schema = Joi.object({
            username: Joi.string(),
            password: Joi.string(),
            role: Joi.string().valid(...roleValues),
            department: Joi.string(),
            firstname: Joi.string(),
            lastname: Joi.string(),
            gender: Joi.string().valid("Male", "Female", "Other"),
            email: Joi.string().email(),
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
    async username_validate(body) {
        let user = await Staff.findOne({ username: body.username });
        if (user) {
            return {
                ok: false,
                errorCode: errorCode.STAFF.USERNAME_EXISTS
            }
        }
        return null;
    }
    async department_validate(body) {
        let department = await Department.findById(body.department);
        if (!department) {
            return {
                ok: false,
                errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
            }
        }
        if (department.type === departmentType.STORAGE) {
            if (!(body.role === staffRole.STORAGE_EMMPLOYEE || body.role === staffRole.STORAGE_MANAGER)) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.DEPARTMENT_PARAMS_INVALID
                }
            }
        }
        if (department.type === departmentType.POSTOFFICE) {
            if (!(body.role === staffRole.POSTOFFICE_EMMPLOYEE || body.role === staffRole.POSTOFFICE_MANAGER)) {
                return {
                    ok: false,
                    errorCode: errorCode.STAFF.DEPARTMENT_PARAMS_INVALID
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
            
            const schema_error = validator.schema_validate(body, [ "role", "firstname", "lastname", "gender", "email" ]);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }
            
            if (staffRole.isManager(req.payload.role)) {
                let manager = await Staff.findOne({ username: req.payload.username });
                if (!manager) {
                    return res.status(404).json({
                        ok: false,
                        errorCode: errorCode.STAFF.STAFF_NOT_EXISTS
                    });
                }
                if (manager.department.toString() !== body.department) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.AUTH.ROLE_INVALID
                    });
                }
                if (body.role === staffRole.BOSS || body.role === staffRole.STORAGE_MANAGER || body.role === staffRole.POSTOFFICE_MANAGER) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.AUTH.ROLE_INVALID
                    });
                }
            }

            const department_error = await validator.department_validate(body);
            if (department_error) {
                return res.status(400).join(department_error);
            }

            body.username = helper.generateID(body.firstname, body.lastname);
            body.password = helper.generateHash(body.username);
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

            let staff = await Staff.findOne({ username: params.id });
            if (!staff) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.STAFF.STAFF_NOT_EXISTS
                });
            }
            delete staff._doc.password;

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

            const filter = {};
            const queryFields = ['username', 'role', 'department', 'firstname', 'lastname', 'gender', 'email', 'active'];
            Object.keys(query).forEach(key => {
                if (queryFields.includes(key)) {
                    filter[key] = query[key];
                }
            });

            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;

            let staffs = await Staff.find(filter).skip(skip).limit(limit);
            staffs.forEach(staff => {
                delete staff._doc.password;
            });

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

            if (staffRole.isManager(req.payload.role)) {
                let manager = await Staff.findOne({ username: req.payload.username });
                if (!manager) {
                    return res.status(404).json({
                        ok: false,
                        errorCode: errorCode.STAFF.STAFF_NOT_EXISTS
                    });
                }
                if (manager.department.toString() !== staff.department.toString()) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.AUTH.ROLE_INVALID
                    });
                }
                if (body.role === staffRole.BOSS || body.role === staffRole.STORAGE_MANAGER || body.role === staffRole.POSTOFFICE_MANAGER) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.AUTH.ROLE_INVALID
                    });
                }
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
                const department_error = await validator.department_validate(body);
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