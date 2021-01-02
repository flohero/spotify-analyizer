import {SpotifyBaseService} from "./spotify-base-service";
import {AccessTokenService} from "./access-token-service";
import {ArtistView} from "../../../common/src/view/artist-view";
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
}
