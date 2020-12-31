import fetch from "node-fetch";
import User, {IUser} from "../model/user-model";
import { SpotifyBaseService } from "./spotify-base-service";

export class UserProfileService extends SpotifyBaseService {

    public detailsWithAccessToken(accessToken: string): Promise<IUser> {
        return fetch(`${this.endPoint}/me`, {
            headers: this.getAuthenticationHeader(accessToken)
        })
            .then(this.handleErrors)
            .then(res => res.json())
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
                    headers: this.getAuthenticationHeader(user.access_token)
                })
                    .then(this.handleErrors)
                    .then(res => res.json())
                    .then(res => {
                        user.display_name = res.display_name;
                        user.profile_image = res.images.length > 0 ? res.images[0].url : null;
                        return user;
                    });
            });
    }
}
