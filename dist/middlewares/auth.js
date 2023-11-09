"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = _interopRequireDefault(require("config"));
var _error = _interopRequireDefault(require("../constants/error.code"));
var _moment = _interopRequireDefault(require("moment"));
var _UserModel = _interopRequireDefault(require("../models/UserModel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const authorization = (roles, statuses) => async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice('Bearer '.length);
    var secret = _config.default.get("secret");
    if (token) {
      try {
        console.log("auth");
        _jsonwebtoken.default.verify(token, secret, async function (err, payload) {
          if (payload) {
            req.payload = payload;
            const user = await _UserModel.default.findOne({
              username: payload.username
            });
            if (roles && roles.length && !roles.includes(payload.role) && !roles.includes("all") && !roles.includes("ALL")) {
              return res.status(403).json(_objectSpread({
                ok: false
              }, _error.default.AUTH.ROLE_INVALID));
            }
            req.user = user;
            if (!user) {
              return res.status(403).json(_objectSpread({
                ok: false
              }, _error.default.AUTH.USER_DELETED));
            }
            next();
          } else {
            if (err && err.name == 'TokenExpiredError') {
              return res.status(403).json(_objectSpread({
                ok: false
              }, _error.default.AUTH.TOKEN_EXPIRED));
            } else {
              return res.status(403).json(_objectSpread({
                ok: false
              }, _error.default.AUTH.TOKEN_INVALID));
            }
          }
        });
      } catch (err) {
        return res.status(403).json(_objectSpread({
          ok: false
        }, _error.default.AUTH.TOKEN_INVALID));
      }
    } else {
      return res.status(403).json(error);
    }
  } else {
    res.status(403).json(_objectSpread({
      ok: false
    }, _error.default.AUTH.TOKEN_NOT_FOUND));
  }
};
var _default = exports.default = authorization;