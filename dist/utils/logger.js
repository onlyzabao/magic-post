"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _log4js = _interopRequireDefault(require("log4js"));
var _config = _interopRequireDefault(require("config"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_log4js.default.configure(_config.default.get("log4js"));
const logger = {
  system: _log4js.default.getLogger("file")
};
var _default = exports.default = logger.system;