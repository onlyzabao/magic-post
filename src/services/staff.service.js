import Validator from "../utils/validator";
import helper from "../utils/helper";
import errorCode from "../constants/error.code";
import jwt from "jsonwebtoken";
import systemConfig from "config";
import ms from "ms";
import * as _ from "lodash";
import Staff from "../models/staff";
import Department from "../models/department";
import staffRole from "../constants/staff.role";

class StaffService {
    constructor() { }
    async create(req, res, next) {
        try {
            const { body } = req;
            const { error } = Validator.staff_create(body);
            if (error) {
                return res.status(400).json({
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                });
            }

            let userData = {
                username: body.username,
                password: helper.generateHash(body.password),
                role: body.role,
                name: body.name,
                gender: body.gender,
                email: body.email
            };

            if (body.department && body.role !== staffRole.BOSS) {
                let department = await Department.findById(body.department);
                if (!department) {
                    return res.status(404).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                    })
                }
                userData.department = body.department;
            }

            let user = await Staff.findOne({
                username: body.username
            });
            if (user) {
                return res.status(400).json({
                    ok: false,
                    errorCode: errorCode.REGISTER.USERNAME_EXISTS
                })
            }

            user = await Staff.create(userData);

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
}

export default new StaffService();