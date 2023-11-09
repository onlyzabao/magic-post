import log4js from "log4js";
import systemConfig from "config";
log4js.configure(systemConfig.get("log4js"));

const logger = {
  system: log4js.getLogger("file"),
};

export default logger.system;