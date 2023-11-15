import StaffService from "../services/staff.service";

export default class StaffController {
    constructor() {}
    create = async (req, res) => StaffService.create(req, res);
}