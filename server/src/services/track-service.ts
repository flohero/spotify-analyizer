import { AudioFeature } from "../model/audio_feature";
import { SpotifyBaseService } from "./spotify-base-service";

export class TrackService extends SpotifyBaseService {

    public getTopTracks(accessToken: string) {

        const time_range: string = "medium_term";

        return fetch(`${this.endPoint}/top/tracks?time_range=${time_range}&limit=${this.resultLimit}`, {
            method: 'GET',
            headers: this._getHeaders(accessToken)
        })
        .then(res => this._handleErrors(res))
        .then(res => res.json())
        .then(res => res.items) // only items needed
    }

    public getAudioFeatures(accessToken: string, trackIds: string[]): Promise<AudioFeature[]> {

        return fetch(`${this.endPoint}/audio-features?ids=${trackIds.toString()}`, {
            method: 'GET',
            headers: this._getHeaders(accessToken)
        })
        .then(res => this._handleErrors(res))
        .then(result => result.json())
        .then(result => result.audio_features) // only audio_features needed
    }
}