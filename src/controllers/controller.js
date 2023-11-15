import * as _ from "lodash";
import authorization from "../middlewares/authorization";
import logger from "./../utils/logger";

export default function (router, apis) {
    apis.forEach(element => {
        const controller = new element.controller();
        element.methods.forEach(e => {
            const httpMethod = e.httpMethod
            const path = e.path
            const method = e.method
            const roles = e.roles
            const statuses = e.statuses
            if (_.isEmpty(roles)) {
                router[httpMethod](`${path}`, asyncMiddleware(controller, method));
            } else {
                router[httpMethod](`${path}`, authorization(roles, statuses), asyncMiddleware(controller, method));
            }
        })
    });
}

const asyncMiddleware = (controller, method) => (req, res, next) => {
    try {
        const body = _.cloneDeep(req.body);
        delete body.password;
        logger.info("api", JSON.stringify({
            method,
            body: body,
            payload: req.payload
        }));
        Promise.resolve(controller[method](req, res, next))
            .catch(next);
    } catch (e) {
        res.status(500).json({
            ok: false,
            errorCode: "INTERNAL_SERVER_ERROR",
            message: "500 Internal Server Error"
        })
    }
}