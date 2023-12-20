import helper from "../utils/helper";
import errorCode from "../constants/error.code";
import * as _ from "lodash";
import Staff from "../models/staff";
import staffRole from "../constants/staff.role";
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
}

class StaffService {
    constructor() { }
    async create(body) {
        const validator = new StaffValidator();
        const schema_error = validator.schema_validate(body);
        if (schema_error) throw schema_error;

        body.username = helper.generateID(body.firstname, body.lastname);
        body.password = helper.generateHash(body.username);
        body.active = true;
        let staff = await Staff.create(body);

        return staff.username;
    }

    async view(id) {
        let staff = await Staff.
            findOne({ username: id }).
            populate({
                path: 'department',
                select: {
                    province: 1,
                    district: 1,
                    street: 1,
                    type: 1
                }
            });
        if (!staff) throw errorCode.STAFF.STAFF_NOT_EXISTS;

        delete staff._doc.password;
        return staff;
    }

    async list(query) {
        const filter = {};
        const regexFields = ['username', 'firstname', 'lastname', 'email'];
        const queryFields = ['department', 'role', 'gender', 'active'];
        Object.keys(query).forEach(key => {
            if (regexFields.includes(key)) {
                filter[key] = { $regex: query[key] };
            } else if (queryFields.includes(key)) {
                filter[key] = query[key];
            }
        });

        const sortFields = query.sort || null;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        let staffs = await Staff.
            find(filter).
            sort(sortFields).
            select({
                username: 1,
                firstname: 1,
                lastname: 1,
                active: 1
            }).
            skip(skip).
            limit(limit)

        return staffs;
    }

    async update(id, body) {
        let staff = await Staff.findOne({ username: id });
        if (!staff) throw errorCode.STAFF.STAFF_NOT_EXISTS;

        const validator = new StaffValidator;
        const schema_error = validator.schema_validate(body);
        if (schema_error) throw schema_error;

        if (body.username) delete body.username;
        if (body.password) body.password = helper.generateHash(body.password);
        Object.assign(staff, body);
        staff = await staff.save();

        return staff.username;
    }
}

export default new StaffService();