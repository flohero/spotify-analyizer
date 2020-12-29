import {Application} from "express";
import {TrackService} from "../services/track-service";
import { UserProfileService } from "../services/user-profile-service";
import User, {IUser} from "../model/user-model";

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
            .get("/track/audio-features", (req, res) => {
                this._userService.details(req.params.id).then(user => {

                    if(!user) {
                        res.sendStatus(404);
                        return;
                    }
                    this._trackService.getTopTracks(user.access_token).then(topTracks => {
                        var ids = topTracks.map(tt => tt.id) as string[];
                        this._trackService.getAudioFeatures(user.access_token, ids).then(features => {
                            res.status(200);
                            res.type("json");
                            res.send(features);
                        });
                    });
                });
            });
    }
}