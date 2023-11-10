import Joi from "joi";
import staffRole from "../constants/staff.role"

class Validator {
    auth_register = (body) => {
        const roleValues = Object.values(staffRole);
        const staffSchema = Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().valid(...roleValues).required(),
            department: Joi.string(),
            name: Joi.string().required(),
            gender: Joi.string().valid("Male", "Female", "Other").required(),
            email: Joi.string().email().required()
        });
        return staffSchema.validate(body);
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