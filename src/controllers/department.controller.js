import DepartmentService from "../services/department.service";

export default class DepartmentController {
    constructor() {}
    create = async (req, res) => DepartmentService.create(req, res);
    update = async (req, res) => DepartmentService.update(req, res);
}