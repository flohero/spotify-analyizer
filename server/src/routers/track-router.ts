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
            .get("/track/recent-audio-features/:id", (req, res) => {
                this.trackService.getTopTracks(req.params.id, "short_term").then(topTracks => {
                    this.trackService.getAudioFeatures(req.params.id, topTracks.map(track => track.id)).then(features => {
                        res.status(200);
                        res.type("json");
                        res.send(features);
                    });
                });
            })
            .get("/track/audio-features/:id", (req, res) => {
                this.trackService.getTopTracks(req.params.id, "long_term").then(topTracks => {
                    this.trackService.getAudioFeatures(req.params.id, topTracks.map(track => track.id)).then(features => {
                        res.status(200);
                        res.type("json");
                        res.send(features);
                    });
                });
            });
    }
}