import User, {IUser} from "../model/user-model";
import fetch from "node-fetch";
import {CredentialService} from "./credential-service";
import {SpotifyBaseService} from "./spotify-base-service";

export class AccessTokenService extends SpotifyBaseService {
    private static readonly endpoint = "https://accounts.spotify.com/api/token";
    private readonly credentialService: CredentialService = new CredentialService();

    public getAccessTokenById(id: string): Promise<string> {
        return User.findById(id)
            .then(user => {
                if (!user) {
                    throw new UserNotFoundError();
                }
                if(user.expires_at.getMilliseconds() <= Date.now()) {
                    return this.refreshAccessToken(user)
                        .then(user => user.access_token);
                }
                return user.access_token;
            });
    }


    private refreshAccessToken(user: IUser): Promise<IUser> {
        const formData = new URLSearchParams();
        formData.append("grant_type", "refresh_token");
        formData.append("refresh_token", user.refresh_token);
        return fetch(AccessTokenService.endpoint, {
            method: "POST",
            body: formData,
            headers: this.credentialService.authorizationHeader()
        })
            .then(this.handleErrors)
            .then(res => res.json())
            .then(res => {
                user.access_token = res.access_token;
                user.expires_at = new Date(Date.now() + res.expires_in * 1000);
                return user.save()
            });
    }
}

export class UserNotFoundError extends Error {
    constructor() {
        super("User not found");
    }
}
