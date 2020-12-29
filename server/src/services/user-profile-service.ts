import fetch from "node-fetch";
import User, {IUser} from "../model/user-model";
import { SpotifyBaseService } from "./spotify-base-service";

export class UserProfileService extends SpotifyBaseService {

    public detailsWithAccessToken(accessToken: string): Promise<IUser> {

        return fetch(`${this.endPoint}/me`, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })
            .then(res => {
                if (res.status >= 400) {
                    throw new Error("Was not able to call /me: " + res.statusText);
                }
                return res.json()
            })
            .then(res => {
                return User.findOne({name: res.id})
                    .then(user => {
                        if (!user) {
                            user = new User({
                                name: res.id,
                                email: res.email,
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
                return fetch(`${this.endPoint}/me`, {
                    headers: {
                        "Authorization": "Bearer " + user.access_token
                    }
                })
                    .then(res => {
                        if (res.status >= 400) {
                            throw new Error("Was not able to call /me: " + res.statusText);
                        }
                        return res.json();
                    })
                    .then(res => {
                        user.profile_image = res.images[0].url;
                        return user;
                    });
            });
    }
}
