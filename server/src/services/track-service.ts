import fetch from 'node-fetch';
import { SpotifyBaseService } from "./spotify-base-service";
import User from "../model/user-model";
import { AudioFeatureView } from "../../../common/src/view/audio-feature-view";

export class TrackService extends SpotifyBaseService {

    public getTopTracks(userId: string) {

        return User.findOne({ _id: userId }).then(user => {
            const time_range: string = "medium_term";
            return fetch(`${this.endPoint}/me/top/tracks?time_range=${time_range}&limit=${this.resultLimit}`, {
                headers: {
                    "Authorization": "Bearer " + user.access_token
                }
            })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(res => res.items) // only items needed
        })
    }

    public getAudioFeatures(userId: string, trackIds: string[]) {
        return User.findOne({ _id: userId })
            .then(user => {
                return fetch(`${this.endPoint}/audio-features?ids=${trackIds.toString()}`, {
                    headers: {
                        "Authorization": "Bearer " + user.access_token
                    }
                })
                    .then(this.handleErrors)
                    .then(res => res.json())
                    .then(res => {

                        var features = res.audio_features;

                        return {
                            acousticness: features.map(f => f.acousticness).reduce((a, b) => a + b, 0) / features.length,
                            energy: features.map(f => f.energy).reduce((a, b) => a + b, 0) / features.length,
                            valence: features.map(f => f.valence).reduce((a, b) => a + b, 0) / features.length,
                            instrumentalness: features.map(f => f.instrumentalness).reduce((a, b) => a + b, 0) / features.length,
                            liveness: features.map(f => f.liveness).reduce((a, b) => a + b, 0) / features.length,
                            speechiness: features.map(f => f.speechiness).reduce((a, b) => a + b, 0) / features.length,
                            danceability: features.map(f => f.danceability).reduce((a, b) => a + b, 0) / features.length
                        } as AudioFeatureView;
                    });
            });
    }
}