import * as fetch from "node-fetch";
import User, {IUser} from "../model/user-model";

export class UserProfileService {
    private readonly endPoint = "https://api.spotify.com/v1/me";

    constructor() {
    }

    public detailsWithAccessToken(accessToken: string): Promise<IUser> {

        return fetch(this.endPoint, {
            headers: {
                "Authorization": "Bearer " + accessToken
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
                                profile_image: res.images[0].url
                            });
                        }
                        user.access_token = accessToken;
                        return user.save();
                    });
            });
    }

    public details(id: string): Promise<IUser> {
        return User.findOne({_id: id})
            .then(user => {
                return user;
            });
    }
}
