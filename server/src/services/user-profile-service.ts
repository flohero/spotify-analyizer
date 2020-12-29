import User, {IUser} from "../model/user-model";
import { SpotifyBaseService } from "./spotify-base-service";

export class UserProfileService extends SpotifyBaseService {

    public detailsWithAccessToken(accessToken: string): Promise<IUser> {

        return fetch(this.endPoint, {
            headers: this._getHeaders(accessToken)
        })
            .then(res => this._handleErrors(res))
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
                return fetch(this.endPoint, {
                    headers: {
                        "Authorization": "Bearer " + user.access_token
                    }
                })
                    .then(res => this._handleErrors(res))
                    .then(res => res.json())
                    .then(res => {
                        user.profile_image = res.images[0].url;
                        return user;
                    });
            });
    }
}
