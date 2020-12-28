import {Document, Schema} from "mongoose";
import * as mongoose from "mongoose";

export interface IUser extends Document {
    email: string;
    name?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true},
    name: { type: String, required: false},
    refresh_token: {type: String, required: false},
    access_token: {type: String, required: false},
    expires_at: {type: Date, required: false}
})

export default mongoose.model<IUser>("User", UserSchema);
