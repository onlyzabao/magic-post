"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _role = _interopRequireDefault(require("./../constants/role"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let Schema = new _mongoose.default.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    hide: true
  },
  role: {
    type: String,
    required: true,
    default: () => _role.default.USER
  }
});
var _default = exports.default = _mongoose.default.model('Users', Schema);