import fetch from 'node-fetch';
import {SpotifyBaseService} from "./spotify-base-service";
import {AudioFeatureView} from "../../../common/src/view/audio-feature-view";
import {ArtistPlayedOnView} from "../../../common/src/view/artist-played-on-view";
import {GenreHistoryView} from "../../../common/src/view/genre-history-view";
import {AccessTokenService} from "./access-token-service";
import UserHistory, {IUserHistory} from "../model/user-history-model";
import {UserProfileService} from "./user-profile-service";
import {ArtistService} from "./artist-service";
import * as mongoose from "mongoose";

export class TrackService extends SpotifyBaseService {

    private readonly accessTokenService: AccessTokenService = new AccessTokenService();
    private readonly userProfileService: UserProfileService = new UserProfileService();
    private readonly artistService: ArtistService = new ArtistService();

    public getTopTracks(userId: string, time_range: string) {

        return this.accessTokenService.getAccessTokenById(userId).then(accessToken => {
            return fetch(`${this.endPoint}/me/top/tracks?time_range=${time_range}&limit=${this.resultLimit}`, {
                headers: this.getAuthenticationHeader(accessToken)
            })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(res => res.items) // only items needed
        })
    }

    public getAudioFeatures(userId: string, trackIds: string[]) {
        return this.accessTokenService.getAccessTokenById(userId)
            .then(accessToken => {
                return fetch(`${this.endPoint}/audio-features?ids=${trackIds.toString()}`, {
                    headers: this.getAuthenticationHeader(accessToken)
                })
                    .then(this.handleErrors)
                    .then(res => res.json())
                    .then(res => {

                        const features = res.audio_features;

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

    public updateRecentlyPlayedTracks(userId: string): Promise<IUserHistory[]> {
        return this.accessTokenService.getAccessTokenById(userId)
            .then(accessToken => {
                return fetch(`${this.endPoint}/me/player/recently-played?limit=50`, {
                    headers: this.getAuthenticationHeader(accessToken)
                })
                    .then(this.handleErrors)
                    .then(res => res.json())
                    .then(res => {
                        return this.userProfileService.findById(userId)
                            .then(user => {
                                const tracks: IUserHistory[] = res.items.map(item => {
                                    return <IUserHistory>{
                                        user: user._id,
                                        track_id: item.track.id,
                                        artist_id: item.track.artists[0].id,
                                        played_at: new Date(item.played_at)
                                    };
                                });
                                return tracks;
                            })
                    })
            })
            .then(histories => {
                histories.map(track => {
                    return UserHistory.create(track, () => {

                    });
                });
                return histories;
            });
    }

    public getAllPlayedTracks(userId: string): Promise<IUserHistory[]> {
        return this.updateRecentlyPlayedTracks(userId)
            .then(() => {
                // @ts-ignore
                return UserHistory.find({"user": mongoose.Types.ObjectId(userId)}).sort({played_at: 'descending'})
                    .then(res => {
                        return res;
                    });
            });
    }

    public getGenresOfAllPlayedTracks(userId: string): Promise<GenreHistoryView[]> {
        return this.getAllPlayedTracks(userId)
            .then(histories => {
                return this.artistService.getGenresOfArtists(userId,
                    histories.map(item => <ArtistPlayedOnView>{timestamp: item.played_at, artist: item.artist_id}));
            });
    }
}