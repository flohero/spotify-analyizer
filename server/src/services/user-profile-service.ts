import fetch from "node-fetch";
import User, {IUser} from "../model/user-model";
import {SpotifyBaseService} from "./spotify-base-service";
import {AccessTokenService} from "./access-token-service";

export class UserProfileService extends SpotifyBaseService {

    private readonly accessTokenService: AccessTokenService = new AccessTokenService();

    public createNewUser(tokens: any): Promise<IUser> {
        return fetch(`${this.endPoint}/me`, {
            headers: this.getAuthenticationHeader(tokens.access_token)
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
                        user.access_token = tokens.access_token;
                        user.refresh_token = tokens.refresh_token;
                        user.expires_at = new Date(Date.now() + tokens["expires_in"] * 1000);
                        return user.save();
                    });
            });
    }

    public details(id: string): Promise<IUser> {
        return User.findById(id)
            .then(user => {
                return this.accessTokenService.getAccessTokenById(user.id)
                    .then(accessToken => {
                        return fetch(`${this.endPoint}/me`, {
                            headers: this.getAuthenticationHeader(accessToken)
                        })
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

    public findById(id: string): Promise<IUser> {
        return User.findById(id)
            .then(user => user);
    }
}
