"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _validator = _interopRequireDefault(require("../utils/validator"));
var _UserModel = _interopRequireDefault(require("../models/UserModel"));
var _helper = _interopRequireDefault(require("../utils/helper"));
var _moment = _interopRequireDefault(require("moment/moment"));
var _error = _interopRequireDefault(require("../constants/error.code"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = _interopRequireDefault(require("config"));
var _ms = _interopRequireDefault(require("ms"));
var _ = _interopRequireWildcard(require("lodash"));
var _role = _interopRequireDefault(require("../constants/role"));
var _logger = _interopRequireDefault(require("../utils/logger"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class AuthService {
  constructor() {}
  async login(req, res, next) {
    try {
      const {
        body
      } = req;
      const {
        error
      } = _validator.default.auth_login(body);
      if (error) {
        return res.status(400).json({
          ok: false,
          errorCode: _error.default.PARAMS_INVALID,
          message: error.details.map(x => x.message).join(", ")
        });
      }
      const result = await _UserModel.default.findOne({
        username: body.username
      });
      let msg;
      if (!result) {
        msg = _error.default.LOGIN.USER_NOT_FOUND;
      }
      if (!msg && !_helper.default.comparePassword(body.password, result.password)) {
        msg = _error.default.LOGIN.PASSWORD_INVALID;
      }
      if (msg) {
        return res.status(400).json(_objectSpread({
          ok: false
        }, msg));
      }
      const payload = {
        username: result.username,
        role: result.role,
        expired_time: (0, _moment.default)().add(1, 'days'),
        created_token: new Date()
      };
      const token = _jsonwebtoken.default.sign(payload, _config.default.get("secret"), {
        expiresIn: (0, _ms.default)('1d')
      });
      res.status(200).json({
        ok: true,
        errorCode: _error.default.SUCCESS,
        data: {
          token: `Bearer ${token}`,
          payload: payload
        }
      });
    } catch (e) {
      return res.status(400).json({
        ok: false,
        errorCode: _error.default.GENERAL_ERROR,
        message: e.message
      });
    }
  }
  async register(req, res, next) {
    try {
      const {
        body
      } = req;
      const {
        error
      } = _validator.default.auth_register(body);
      if (error) {
        return res.status(400).json({
          ok: false,
          errorCode: _error.default.PARAMS_INVALID,
          message: error.details.map(x => x.message).join(", ")
        });
      }
      let user = await _UserModel.default.findOne({
        username: body.username
      });
      if (user) {
        return res.status(400).json({
          ok: false,
          errorCode: _error.default.REGISTER.USERNAME_EXISTS
        });
      }
      const uuid = _helper.default.genUuid();
      user = await _UserModel.default.create({
        uuid: uuid,
        username: body.username,
        password: _helper.default.generateHash(body.password),
        role: _role.default.USER
      });
      const payload = {
        uuid: user.uuid,
        username: user.username,
        role: user.role
      };
      const token = _jsonwebtoken.default.sign(payload, _config.default.get("secret"), {
        expiresIn: (0, _ms.default)('1y')
      });
      res.status(200).json({
        ok: true,
        errorCode: _error.default.SUCCESS,
        data: {
          token: `Bearer ${token}`,
          payload: _objectSpread(_objectSpread({}, payload), {}, {
            username: payload.username.slice(0, constant.Username_length)
          })
        }
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        ok: false,
        errorCode: _error.default.GENERAL_ERROR,
        message: e.message
      });
    }
  }
}
var _default = exports.default = new AuthService();