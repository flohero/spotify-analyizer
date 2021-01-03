import {BaseRouter} from "./base-router";
import {PlaylistService} from "../services/playlist-service";
import {Application} from "express";

export class PlaylistRouter extends BaseRouter {
    private readonly playlistService: PlaylistService = new PlaylistService();

    constructor(app: Application) {
        super(app);
    }

    protected configureRoutes(): void {
        this.app
            .get("/playlists/create/:id", (res, req) => {
                this.playlistService.createPlaylist(res.params.id);
                req.sendStatus(201);
            });
    }

}