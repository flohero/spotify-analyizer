import {SpotifyBaseService} from "./spotify-base-service";
import * as fetch from "node-fetch";
import {UserProfileService} from "./user-profile-service";
import {AccessTokenService} from "./access-token-service";
import {TrackService} from "./track-service";

export class PlaylistService extends SpotifyBaseService {
    private readonly userProfileService: UserProfileService = new UserProfileService();
    private readonly trackService: TrackService = new TrackService();
    private readonly accessTokenService: AccessTokenService = new AccessTokenService();

    createPlaylist(userId: string, name = undefined) {
        if (!name) {
            name = "Top Tracks: " + new Date().toISOString();
        }
        return this.accessTokenService.getAccessTokenById(userId)
            .then(token => {
                let headers = this.getAuthenticationHeader(token);
                headers["Content-Type"] = "application/json";
                return this.userProfileService.findById(userId)
                    .then((user) => {
                        return fetch(`${this.endPoint}/users/${user.name}/playlists`,
                            {
                                method: "POST",
                                headers: headers,
                                body: JSON.stringify({
                                    "name": name
                                }),
                            });
                    })
                    .then(this.handleErrors)
                    .then(res => res.json())
                    .then(playlist => {
                        return this.trackService.getTopTracks(userId, "short_term")
                            .then(tracks => {
                                const trackUris = tracks.map(track => track.uri);
                                return fetch(`${this.endPoint}/playlists/${playlist.id}/tracks`,
                                    {
                                        method: "POST",
                                        headers: headers,
                                        body: JSON.stringify({
                                            uris: trackUris
                                        })
                                    })
                                    .then(this.handleErrors)
                            })
                    });
            })

    }
}