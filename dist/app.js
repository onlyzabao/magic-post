"use strict";

var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _http = _interopRequireDefault(require("http"));
var _router = _interopRequireDefault(require("./routes/router"));
var _mongo = _interopRequireDefault(require("./utils/mongo.connector"));
var _errorHandle = _interopRequireDefault(require("./middlewares/errorHandle"));
var _config = _interopRequireDefault(require("config"));
var _logger = _interopRequireDefault(require("./utils/logger"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const HOSTNAME = _config.default.get('hostname') || 'localhost';
const PORT = _config.default.get('port') || 3000;
(0, _mongo.default)();
const app = (0, _express.default)();
app.use((0, _cors.default)({
  origin: '*',
  optionsSuccessStatus: 200
}));
app.use(_bodyParser.default.urlencoded({
  extended: false,
  limit: '25mb'
}));
app.use(_bodyParser.default.json({
  limit: '25mb'
}));
app.use(_bodyParser.default.raw({
  limit: '25mb'
}));
app.use("/api/v1", _router.default);
app.get("/status", (request, response) => {
  const status = {
    "Status": "Running"
  };
  response.send(status);
});
app.use(_errorHandle.default);
var server = _http.default.createServer(app);
server.listen(PORT, HOSTNAME, () => {
  _logger.default.info(`Server started running at ${HOSTNAME}:${PORT}`);
});