import fetch from 'node-fetch';
import { SpotifyBaseService } from "./spotify-base-service";
import User, {IUser} from "../model/user-model";

export class TrackService extends SpotifyBaseService {

    public getTopTracks(userId: string) {

        return User.findOne({_id: userId}).then(user => {
            const time_range: string = "medium_term";
            return fetch(`${this.endPoint}/me/top/tracks?time_range=${time_range}&limit=${this.resultLimit}`, {
                headers: {
                    "Authorization": "Bearer " + user.accessToken
                }
            })
            .then(res => {
                if (res.status >= 400) {
                    throw new Error("Was not able to call /me: " + res.statusText);
                }
                return res.json()
            })
            .then(res => res.items) // only items needed
        })
    }

    public getAudioFeatures(userId: string, trackIds: string[]) {
        return User.findOne({_id: userId})
            .then(user => {
                return fetch(`${this.endPoint}/me/audio-features?ids=${trackIds.toString()}`, {
                    headers: {
                        "Authorization": "Bearer " + user.accessToken
                    }
                })
                    .then(res => {
                        if (res.status >= 400) {
                            throw new Error("Was not able to call /me: " + res.statusText);
                        }
                        return res.json()
                    })
                    .then(result => result.audio_features) // only audio_features needed
         });
    }
}