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
            .get("/playlists/create/:id", (req, res) => {
                this.playlistService.createPlaylist(req.params.id)
                    .then(() => {
                        res.sendStatus(201);
                    })
                    .catch(() => {
                        res.sendStatus(400);
                    });

            });
    }

}