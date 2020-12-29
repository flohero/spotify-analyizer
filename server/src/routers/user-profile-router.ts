import {Application} from "express";
import {UserProfileService} from "../services/user-profile-service";
import {UserView} from "../../../common/src/view/user-view"

export class UserProfileRouter {
    private readonly app: Application;
    private readonly userProfileService = new UserProfileService();

    constructor(app: Application) {
        this.app = app;
        this.configureRoutes();
    }

    private configureRoutes(): Application {
        return this.app
            .get("/user/:id", (req, res) => {
                this.userProfileService.details(req.params.id)
                    .then(user => {
                        if (!user) {
                            res.sendStatus(404);
                            return;
                        }
                        res.status(200);
                        res.type("json");
                        res.send(new UserView(
                            user.name,
                            user.email,
                            user.profile_image
                        ));
                    })
                    .catch(() => {
                        res.sendStatus(401);
                    })
            });
    }
}