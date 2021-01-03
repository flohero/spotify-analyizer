import {BaseService} from "./base-service";

export class PlaylistService extends BaseService {

    constructor(endpoint: string) {
        super(`${endpoint}/playlists`);
    }

    public exportTopTracksToPlaylist(id: string): Promise<boolean> {
        return fetch(`${this.endpoint}/create/${id}`)
            .then(res => res.status == 200 || res.status == 201);
    }
}