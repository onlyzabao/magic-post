"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _authController = _interopRequireDefault(require("../controllers/authController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Methods is array and item structure is "HTTP_METHOD:API_NAME:ROLE1,ROLE2:STATUS_USER1,STATUS_USER2";
// only checking logined then entering ROLE = ALL or all
// not check status user then STATUS_USER = empty => `GET:login:${role.ADMIN};
var _default = exports.default = [{
  controller: _authController.default,
  methods: [{
    httpMethod: "post",
    path: "/auth/register",
    method: "register"
  }, {
    httpMethod: "post",
    path: "/auth/login",
    method: "login"
  }]
}];