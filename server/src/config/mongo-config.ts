import * as mongoose from "mongoose";
import {Logger} from "winston";

export class MongoConfig {
    private readonly opts = {useNewUrlParser: true, useUnifiedTopology: true};
    private readonly url = "mongodb://root:example@localhost:27017/";
    constructor(private readonly logger: Logger) {

    }

    public connect() {
        mongoose.connect(this.url, this.opts)
            .then(() => {
                this.logger.info("Established connection to MongoDB");
            })
            .catch(err => {
                this.logger.error("Error when connecting to MongoDB", err);
            });
    }

    public disconnect() {
        mongoose.disconnect()
            .then(() => {
                this.logger.info("Disconnecting from MongoDB...");
            })
    }
}

