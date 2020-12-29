import * as querystring from "querystring";
import fetch from "node-fetch";
import {UserProfileService} from "../services/user-profile-service";
import {IUser} from "../model/user-model";

export class AuthController {
    private static client_id = process.env.SPOTIFY_CLIENT_ID;
    private static client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    private static redirect_uri = "http://localhost:3000/callback";
    private static req_uri = "https://accounts.spotify.com/authorize";
    private static scope = "user-read-private user-read-email user-read-recently-played";

    constructor() {
    }

    public buildUri(): string {
        const query = querystring.stringify({
            response_type: "code",
            client_id: AuthController.client_id,
            scope: AuthController.scope,
            redirect_uri: AuthController.redirect_uri,
        });

        return AuthController.req_uri + "?" + query;
    }

    public requestSessionToken(code: string): Promise<IUser> {
        const formData = new URLSearchParams();
        formData.append("code", code);
        formData.append("redirect_uri", AuthController.redirect_uri);
        formData.append("grant_type", "authorization_code");
        return fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (
                    Buffer.from(AuthController.client_id + ':' + AuthController.client_secret)
                        .toString('base64'))
            },
            body: formData
        })
            .then(res => {
                return res.json();
            })
            .then(token => {
                const userProfileService: UserProfileService = new UserProfileService()
                return userProfileService.detailsWithAccessToken(token["access_token"])
                    .then(user => {
                        user.refresh_token = token["refresh_token"];
                        user.expires_at = new Date(Date.now() + token["expires_in"] * 1000);
                        return user.save();
                    });
            });
    }
}