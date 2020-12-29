import {Application} from "express";
import {TrackService} from "../services/track-service";
import { UserProfileService } from "../services/user-profile-service";

export class UserProfileRouter {
    private readonly _app: Application;
    private readonly _trackService = new TrackService();
    private readonly _userService = new UserProfileService();
    constructor(app: Application) {
        this._app = app;
        this.configureRoutes();
    }

    private configureRoutes(): Application {
        return this._app
            .get("/track/audio-features?id", (req, res) => {
                this._trackService.getTopTracks(req.params.id).then(topTracks => {
                    var ids = topTracks.map(tt => tt.id) as string[];
                    this._trackService.getAudioFeatures(req.params.id, ids).then(features => {
                        res.status(200);
                        res.type("json");
                        res.send(features);
                    });
                });
            });
    }
}