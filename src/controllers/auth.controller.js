import AuthService from "../services/auth.service";

export default class AuthController {
    constructor() {}
    login = async (req, res) => AuthService.login(req, res);
    change_password = async (req, res) => AuthService.change_password(req, res);
}