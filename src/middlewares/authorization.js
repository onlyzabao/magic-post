import jwt from "jsonwebtoken";
import systemConfig from "config";
import errorCode from "../constants/error.code";
import Staff from "../models/staff";

const authorization = (roles, statuses) => async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.slice('Bearer '.length);
        var secret = systemConfig.get("secret");
        if (token) {
            try {
                jwt.verify(token, secret, async function (err, payload) {
                    if (payload) {
                        req.payload = payload;
                        const user = await Staff.findOne({
                            username: payload.username
                        });
                        if (roles && roles.length && !roles.includes(payload.role) && !roles.includes("all") && !roles.includes("ALL")) {
                            return res.status(403).json({
                                ok: false,
                                ...errorCode.AUTH.ROLE_INVALID,
                            });
                        }
                        req.user = user;
                        if (!user || !user.active) {
                            return res.status(403).json({
                                ok: false,
                                ...errorCode.AUTH.USER_DELETED,
                            });
                        }
                        next();
                    } else {
                        if (err && err.name == 'TokenExpiredError') {
                            return res.status(403).json({
                                ok: false,
                                ...errorCode.AUTH.TOKEN_EXPIRED,
                            });
                        } else {
                            return res.status(403).json({
                                ok: false,
                                ...errorCode.AUTH.TOKEN_INVALID,
                            });
                        }
                    }
                });
            } catch (err) {
                return res.status(403).json({
                    ok: false,
                    ...errorCode.AUTH.TOKEN_INVALID,
                });
            }
        } else {
            return res.status(403).json(error);
        }
    } else {
        res.status(403).json({
            ok: false,
            ...errorCode.AUTH.TOKEN_NOT_FOUND,
        })
    }
};
export default authorization;