import * as mongoose from "mongoose";
import {Logger} from "winston";

export class MongoConfig {
    private readonly opts = {useNewUrlParser: true, useUnifiedTopology: true};
    readonly connectionString = process.env.MONGODB_CONNECTION_STRING;

    constructor(private readonly logger: Logger) {

    }

    public connect() {
        mongoose.connect(this.connectionString, this.opts)
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

