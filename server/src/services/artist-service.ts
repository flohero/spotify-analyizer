import {SpotifyBaseService} from "./spotify-base-service";
import {AccessTokenService} from "./access-token-service";
import {ArtistView} from "../../../common/src/view/artist-view";
import {ArtistPlayedOnView} from "../../../common/src/view/artist-played-on-view";
import {GenreHistoryView} from "../../../common/src/view/genre-history-view";
import fetch from "node-fetch";

export class ArtistService extends SpotifyBaseService {
    private readonly accessTokenService: AccessTokenService = new AccessTokenService();

    public getTopArtists(id: string, limit: Number = 5, timeRange: string = "short_term"): Promise<ArtistView[]> {
        return this.accessTokenService.getAccessTokenById(id)
            .then(accessToken => {
                return fetch(`${this.endPoint}/me/top/artists?limit=${limit}&time_range=${timeRange}`,
                    {headers: this.getAuthenticationHeader(accessToken)});
            })
            .then(this.handleErrors)
            .then(res => res.json())
            .then(artists => {
                return artists.items.map(item => {
                    const image = item.images[0] ? item.images[0].url : null;
                    return <ArtistView>{
                        name: item.name,
                        image: image,
                        popularity: item.popularity,
                        genres: item.genres
                    }
                })
            });
    }

    public getGenresOfArtists(userId: string, artists: ArtistPlayedOnView[]) {
        artists = artists.slice(0, 50);
        return this.accessTokenService.getAccessTokenById(userId)
            .then(accessToken => {
                return fetch(`${this.endPoint}/artists?ids=${artists.map(artist => artist.artist).join(",")}`,
                    {headers: this.getAuthenticationHeader(accessToken)});
            })
            .then(this.handleErrors)
            .then(res => res.json())
            .then(content => {
                return artists.map(artist => {
                    const el = content.artists.find(element => element.id == artist.artist);
                    return <GenreHistoryView>{
                        timestamp: artist.timestamp,
                        genres: el ? el.genres : []
                    }
                })
            });
    }
}
