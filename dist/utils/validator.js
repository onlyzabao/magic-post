"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _joi = _interopRequireDefault(require("joi"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Validator {
  constructor() {
    _defineProperty(this, "auth_register", body => {
      return _joi.default.object().keys({
        username: _joi.default.string().required(),
        password: _joi.default.string().required()
      }).validate(body);
    });
    _defineProperty(this, "auth_login", body => {
      return _joi.default.object().keys({
        username: _joi.default.string().required(),
        password: _joi.default.string().required()
      }).validate(body);
    });
  }
}
var _default = exports.default = new Validator();