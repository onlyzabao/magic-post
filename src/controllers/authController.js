import AuthService from "../services/auth.service";

export default class AuthController {
    constructor() {}
    register = async (req, res) => AuthService.register(req, res);
    login = async (req, res) => AuthService.login(req, res);
}