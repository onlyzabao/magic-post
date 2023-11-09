"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _ = _interopRequireWildcard(require("lodash"));
var _auth = _interopRequireDefault(require("./../middlewares/auth"));
var _logger = _interopRequireDefault(require("./../utils/logger"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _default(router, apis) {
  apis.forEach(element => {
    const controller = new element.controller();
    element.methods.forEach(e => {
      const httpMethod = e.httpMethod;
      const path = e.path;
      const method = e.method;
      const roles = e.roles;
      const statuses = e.statuses;
      if (_.isEmpty(roles)) {
        router[httpMethod](`${path}`, asyncMiddleware(controller, method));
      } else {
        router[httpMethod](`${path}`, (0, _auth.default)(roles, statuses), asyncMiddleware(controller, method));
      }
    });
  });
}
const asyncMiddleware = (controller, method) => (req, res, next) => {
  try {
    const body = _.cloneDeep(req.body);
    delete body.password;
    _logger.default.info("api", JSON.stringify({
      method,
      body: body,
      payload: req.payload
    }));
    Promise.resolve(controller[method](req, res, next)).catch(next);
  } catch (e) {
    res.status(500).json({
      ok: false,
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "500 Internal Server Error"
    });
  }
};