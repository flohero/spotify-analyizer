import {ArtistView} from "../../../common/src/view/artist-view";
import { BaseService } from "./base-service";

export class ArtistService extends BaseService {

    constructor(endpoint: string) {
        super(`${endpoint}/artists/top`);
    }

    public getTopArtists(id: string, limit: Number = 50): Promise<ArtistView[]> {
        return fetch(`${this.endpoint}/${id}?limit=${limit}`)
            .then(r => {
                return r.json();
            });
    }
}