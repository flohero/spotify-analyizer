import {Application} from "express";
import {UserProfileService} from "../services/user-profile-service";

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
                        if(!user) {
                            res.sendStatus(404);
                            return;
                        }
                        res.status(200);
                        res.type("json");
                        res.send({
                            name: user.name,
                            email: user.email,
                            profile_image: user.profile_image
                        });
                    })
            });
    }
}