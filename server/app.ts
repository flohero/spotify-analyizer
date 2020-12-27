import * as express from "express";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import * as cors from "cors";
import {AuthRoutesConfig} from "./src/routers/auth-routes";

const app: express.Application = express();
const PORT = 3000;

app.use(cors());

const auth = new AuthRoutesConfig(app);

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: {service: "user-service"},
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({filename: "error.log", level: "error"}),
        new winston.transports.File({filename: "combined.log"}),
    ],
});

logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));

app.listen(PORT, () => {});