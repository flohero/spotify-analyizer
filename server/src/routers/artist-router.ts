import { Application } from "express";
import { ArtistService } from "../services/artist-service";
import { BaseRouter } from "./base-router";

export class ArtistRouter extends BaseRouter {
    private readonly artistService: ArtistService = new ArtistService();

    constructor(app: Application) {
        super(app);
    }

    protected configureRoutes(): Application {
        return this.app
            .get("/artists/top/:id", (req, res) => {
                const id = req.params.id;
                if (!id) {
                    res.sendStatus(422);
                    return;
                }
                this.artistService.getTopArtists(id)
                    .then(artists => {
                        res.status(200);
                        res.type("json");
                        res.send(artists);
                    })
            })
    }
}