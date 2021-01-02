import {SpotifyBaseService} from "./spotify-base-service";
import {AccessTokenService} from "./access-token-service";
import {ArtistView} from "../../../common/src/view/artist-view";
import fetch from "node-fetch";

export class ArtistService extends SpotifyBaseService {
    private readonly accessTokenService: AccessTokenService = new AccessTokenService();

    public getTopArtists(id: string, limit: Number = 8, timeRange: string = "medium_term"): Promise<ArtistView[]> {
        return this.accessTokenService.getAccessTokenById(id)
            .then(accessToken => {
                return fetch(`${this.endPoint}/me/top/artists?limit=${limit}&time_range=${timeRange}`,
                    {headers: this.getAuthenticationHeader(accessToken)});
            })
            .then(res => {
                if (res.status != 200) {
                    throw new Error(res.statusText + " " + res.status);
                }

                return res.json();
            })
            .then(artists => {
                return artists.items.map(item => {
                    return <ArtistView>{
                        name: item.name,
                        image: item.images[0].url,
                        popularity: item.popularity,
                        genres: item.genres
                    }
                })
            });
    }
}
