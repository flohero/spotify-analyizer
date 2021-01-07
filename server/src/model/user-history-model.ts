import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface IUserHistory extends Document {
    user: mongoose.Schema.Types.ObjectId;
    track_id: string;
    artist_id: string;
    played_at: Date;
}

const UserHistory: Schema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    track_id: {type: String, required: true},
    artist_id: {type: String, required: true},
    played_at: {type: Date, required: true}
});

export default mongoose.model<IUserHistory>("UserHistory", UserHistory);