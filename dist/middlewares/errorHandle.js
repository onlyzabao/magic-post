"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const errorHandle = (req, res, next) => {
  res.status(404).json({
    ok: false,
    data: null,
    errorCode: "URL_NOT_FOUND",
    message: "URL_NOT_FOUND"
  });
};
var _default = exports.default = errorHandle;