import DepartmentService from "../services/department.service";

export default class DepartmentController {
    constructor() {}
    create = async (req, res) => DepartmentService.create(req, res);
    update = async (req, res) => DepartmentService.update(req, res);
    view_collection = async (req, res) => DepartmentService.view_collection(req, res);
    view_document = async (req, res) => DepartmentService.view_document(req, res);
}