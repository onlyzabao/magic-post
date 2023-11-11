import errorCode from "../constants/error.code";
import validator from "../utils/validator";
import Department from "../models/department";
import departmentType from "../constants/department.type";

class DepartmentService {
    constructor() { }
    async create(req, res, next) {
        try {
            const { body } = req;
            const { error } = validator.department_create(body);
            if (error) {
                return res.status(400).json({
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                });
            }

            let departmentData = {
                province: body.province,
                district: body.district,
                street: body.street,
                type: body.type
            }

            if (body.type === departmentType.POSTOFFICE) {
                if ((body.cfs && !body.zipcode) || (!body.cfs && body.zipcode)) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.PARAMS_MISSING
                    })
                }
                
                if (body.department) {
                    let department = await Department.findById(body.cfs);
                    if (!department) {
                        return res.status(400).json({
                            ok: false,
                            errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                        })
                    }
                    departmentData.cfs = body.cfs;
                    departmentData.zipcode = body.zipcode;
                }
            }

            let department = await Department.create(departmentData);

            const payload = { 
                departmentID: department._id
            }
            // const token = jwt.sign(payload, systemConfig.get("secret"), {
            //     expiresIn: ms('1y')
            // });
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    // token: `Bearer ${token}`,
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
}

export default new DepartmentService();