import DepartmentService from "../services/department.service";

export default class DepartmentController {
    constructor() {}
    create = async (req, res) => {
        // try {
        //     const { body } = req;
        //     const validator = new DepartmentValidator;

        //     const schema_error = validator.schema_validate(body, [
        //         "province",
        //         "district",
        //         "street",
        //         "type"
        //     ]);
        //     if (schema_error) {
        //         return res.status(400).json(schema_error);
        //     }

        //     const type_error = await validator.type_validate(body);
        //     if (type_error) {
        //         return res.status(400).json(type_error);
        //     }

        //     body.active = true;

        //     let department = await Department.create(body);

        //     const payload = {
        //         departmentId: department._id
        //     }
        //     res.status(200).json({
        //         ok: true,
        //         errorCode: errorCode.SUCCESS,
        //         data: {
        //             payload: {
        //                 ...payload
        //             }
        //         }
        //     });
        // } catch (e) {
        //     return res.status(400).json({
        //         ok: false,
        //         errorCode: errorCode.GENERAL_ERROR,
        //         message: e.message
        //     });
        // }
        DepartmentService.create(req, res);
    }
    update = async (req, res) => DepartmentService.update(req, res);
    view_collection = async (req, res) => DepartmentService.view_collection(req, res);
    view_document = async (req, res) => DepartmentService.view_document(req, res);
}