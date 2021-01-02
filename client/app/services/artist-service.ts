import {ArtistView} from "../../../common/src/view/artist-view";

export class ArtistService {
    private readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = `${endpoint}/artists/top`
    }

    public getTopArtists(id: string, limit: Number = 50): Promise<ArtistView[]> {
        return fetch(`${this.endpoint}/${id}?limit=${limit}`)
            .then(r => {
                return r.json();
            });
    }
}