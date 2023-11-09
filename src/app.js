import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import router from "./routes/router";
import mongoConnect from "./utils/mongo.connector";
import errorHandle from "./middlewares/errorHandle";
import systemConfig from "config";
const HOSTNAME = systemConfig.get('hostname') || 'localhost';
const PORT = systemConfig.get('port') || 3000;
import logger from "./utils/logger";

mongoConnect();

const app = express();
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '25mb'
}));
app.use(bodyParser.json({
    limit: '25mb'
}));
app.use(bodyParser.raw({
    limit: '25mb'
}));
app.use("/api/v1", router);
app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
});
app.use(errorHandle)
var server = http.createServer(app);
server.listen(PORT, HOSTNAME, () => {
    logger.info(`Server started running at ${HOSTNAME}:${PORT}`);
});