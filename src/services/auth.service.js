import Validator from "../utils/validator";
import helper from "../utils/helper";
import moment from "moment/moment";
import errorCode from "../constants/error.code";
import jwt from "jsonwebtoken";
import systemConfig from "config";
import ms from "ms";
import * as _ from "lodash";
import logger from "../utils/logger";
import Staff from "../models/staff";
import Department from "../models/department";

class AuthService {
    constructor() { }
    async login(req, res, next) {
        try {
            const { body } = req;
            const { error } = Validator.auth_login(body);
            if (error) {
                return res.status(400).json({
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                });
            }

            const result = await Staff.findOne({
                username: body.username
            });
            let msg;
            if (!result) {
                msg = errorCode.LOGIN.USER_NOT_FOUND;
            }
            if (!msg && !helper.comparePassword(body.password, result.password)) {
                msg = errorCode.LOGIN.PASSWORD_INVALID;
            }
            if (msg) {
                return res.status(400).json({
                    ok: false,
                    ...msg
                })
            }

            const payload = {
                username: result.username,
                role: result.role,
                expired_time: moment().add(1, 'days'),
                created_token: new Date(),
            }
            const token = jwt.sign(payload, systemConfig.get("secret"), {
                expiresIn: ms('1d')
            });
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    token: `Bearer ${token}`,
                    payload: payload
                }

            })
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            })
        }
    }

    async register(req, res, next) {
        try {
            const { body } = req;
            const { error } = Validator.auth_register(body);
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

            if (body.department) {
                userData.department = body.department;

                let department = await Department.findById(body.department);
                if (!department) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.CREATE_USER.DEPARTMENT_NOT_EXISTS
                    })
                }
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

            })
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

export default new AuthService();