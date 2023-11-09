"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _uuid = require("uuid");
var _md = _interopRequireDefault(require("md5"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let genUuid = function (password) {
  return (0, _uuid.v4)();
};
let comparePassword = function (password, passwordHash) {
  return _bcrypt.default.compareSync(password, passwordHash);
};
let generateHash = function (password) {
  return _bcrypt.default.hashSync(password, _bcrypt.default.genSaltSync(12), null);
};
let toMd5 = function (str) {
  return (0, _md.default)(str);
};
let randomString = function (length) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
var _default = exports.default = {
  generateHash: generateHash,
  comparePassword: comparePassword,
  genUuid: genUuid,
  toMd5: toMd5,
  randomString: randomString
};