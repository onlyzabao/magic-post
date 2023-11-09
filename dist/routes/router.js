"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _apiv = _interopRequireDefault(require("./apiv1"));
var _controller = _interopRequireDefault(require("../controllers/controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = (0, _express.Router)();
(0, _controller.default)(router, _apiv.default);
var _default = exports.default = router;