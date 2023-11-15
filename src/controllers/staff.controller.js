import StaffService from "../services/staff.service";

export default class StaffController {
    constructor() {}
    create = async (req, res) => StaffService.create(req, res);
    view_document = async (req, res) => StaffService.view_document(req, res);
    view_collection = async (req, res) => StaffService.view_collection(req, res);
}