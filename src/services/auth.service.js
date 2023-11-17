import helper from "../utils/helper";
import moment from "moment/moment";
import errorCode from "../constants/error.code";
import jwt from "jsonwebtoken";
import systemConfig from "config";
import ms from "ms";
import * as _ from "lodash";
import logger from "../utils/logger";
import Staff from "../models/staff";
import Joi from "joi";

class AuthValidator {
    schema_validate = (body, requiredFields = []) => {
        let schema = Joi.object({
            username: Joi.string(),
            password: Joi.string(),
            newPassword: Joi.string()
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

class AuthService {
    constructor() { }
    async login(req, res, next) {
        try {
            const { body } = req;
            const validator = new AuthValidator;
            const schema_error = validator.schema_validate(body, [ "username", "password" ]);
            if (schema_error) {
                return res.status(400).json(schema_error);
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

    async change_password(req, res, next) {
        try {
            const { body } = req;
            const validator = new AuthValidator;

            const schema_error = validator.schema_validate(body, [ "password", "newPassword" ]);
            if (schema_error) {
                return res.status(400).json(schema_error);
            }

            const self = await Staff.findOne({ username: req.payload.username });
            if (!self) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.LOGIN.USER_NOT_FOUND
                });
            }

            if (!helper.comparePassword(body.password, self.password)) {
                return res.status(400).json({
                    ok: false,
                    errorCode: errorCode.LOGIN.PASSWORD_INVALID
                });
            }

            self.password = helper.generateHash(body.newPassword);
            self = await self.save();

            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
}

export default new AuthService();