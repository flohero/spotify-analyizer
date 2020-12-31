import { Application } from "express";
import { TrackService } from "../services/track-service";
import { BaseRouter } from "./base-router";

export class TrackRouter extends BaseRouter {
    private readonly trackService = new TrackService();
    
    constructor(app: Application) {
        super(app);
    }

    protected configureRoutes(): Application {
        return this.app
            .get("/track/audio-features/:id", (req, res) => {
                this.trackService.getTopTracks(req.params.id).then(topTracks => {
                    const ids = topTracks.map(tt => tt.id) as string[];
                    this.trackService.getAudioFeatures(req.params.id, ids).then(features => {
                        res.status(200);
                        res.type("json");
                        res.send(features);
                    });
                });
            });
    }
}