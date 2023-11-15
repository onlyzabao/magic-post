import AuthService from "../services/auth.service";

export default class AuthController {
    constructor() {}
    login = async (req, res) => AuthService.login(req, res);
}