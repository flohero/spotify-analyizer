import * as express from "express";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import * as cors from "cors";
import {AuthRouter} from "./src/routers/auth-router";
import {MongoConfig} from "./src/config/mongo-config";
import {UserProfileRouter} from "./src/routers/user-profile-router";
import {TrackRouter} from "./src/routers/track-router";
import {ArtistRouter} from "./src/routers/artist-router";

const app: express.Application = express();
const PORT = 3000;

app.use(cors());

new AuthRouter(app);
new UserProfileRouter(app);
new TrackRouter(app);
new ArtistRouter(app);

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

// Connect to MongoDB
const mongoConfig: MongoConfig = new MongoConfig(logger);
mongoConfig.connect();

// Start Web Server
app.listen(PORT, () => {
});

process.on('exit', () => {
    mongoConfig.disconnect();
});
