"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongooseLong = _interopRequireDefault(require("mongoose-long"));
var _config = _interopRequireDefault(require("config"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const mongoConnect = () => {
  _mongoose.default.connect(_config.default.get("database.url"), _config.default.get("database.options"));
  (0, _mongooseLong.default)(_mongoose.default); // INT 64bit
  const databaseTest = _mongoose.default.connection;
  databaseTest.on('error', error => {
    console.log("errorDB", error);
  });
  databaseTest.once('connected', () => {
    console.log('Database Connected');
  });
};
var _default = exports.default = mongoConnect;