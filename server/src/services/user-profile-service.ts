import * as fetch from "node-fetch";
import User, {IUser} from "../model/user-model";

export class UserProfileService {
    private readonly accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    public details(): Promise<IUser> {

        return fetch(" https://api.spotify.com/v1/me", {
            headers: {
                "Authorization": "Bearer " + this.accessToken
            }
        })
            .then(res => {
                if(res.statusCode > 400) {
                    throw new Error("Was not able to call /me: "+ res.statusText);
                }
                return res.json();
            })
            .then(res => {
                return User.findOne({ name: res.id })
                    .then(user => {
                        if(!user) {
                            user =  new User({
                                name: res.id,
                                email: res.email,
                            });
                        }
                        user.access_token = this.accessToken;
                        return user.save();
                    });
            });
    }
}
