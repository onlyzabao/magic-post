import Joi from "joi";

class Validator {
    auth_register = (body) => {
        return Joi.object()
            .keys({
                username: Joi.string().required(),
                password: Joi.string().required()
            })
            .validate(body);
    }
    auth_login = (body) => {
        return Joi.object()
            .keys({
                username: Joi.string().required(),
                password: Joi.string().required()
            })
            .validate(body);
    }
}
export default new Validator();