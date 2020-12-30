import {Application} from "express";
import {ArtistService} from "../services/artist-service";

export class ArtistRoutes {
    private readonly app: Application;
    private readonly artistService: ArtistService = new ArtistService();

    constructor(app: Application) {
        this.app = app;
        this.configureRoutes();
    }

    private configureRoutes(): Application {
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