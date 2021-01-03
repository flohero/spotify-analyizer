import {BaseController} from "./base-controller";
import {PlaylistService} from "../services/playlist-service";
import {EndpointService} from "../services/endpoint-service";

export class ExportPlaylistController extends BaseController {

    playlistService: PlaylistService = new PlaylistService(EndpointService.getEndpoint());

    constructor(id: string) {
        super(id);
        this.initView();
    }

    protected initView() {
        const btn = document.getElementById("export");
        const feedback = document.getElementById("export-feedback");
        btn.onclick = () => {
            this.playlistService.exportTopTracksToPlaylist(this.id)
                .then(res => {
                    feedback.innerText = res ? "Successfully exported Playlist" : "Error while exporting Playlist";
                });
        };
    }
}