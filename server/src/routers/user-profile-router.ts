import {Application} from "express";
import {UserProfileService} from "../services/user-profile-service";
import {UserView} from "../../../common/src/view/user-view"
import { BaseRouter } from "./base-router";

export class UserProfileRouter extends BaseRouter {
    private readonly userProfileService = new UserProfileService();

    constructor(app: Application) {
        super(app);
    }

    protected configureRoutes(): Application {
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
                        res.send({
                            name: user.name,
                            email: user.email,
                            display_name: user.display_name,
                            image: user.profile_image
                        } as UserView);
                    })
                    .catch(() => {
                        res.sendStatus(401);
                    })
            });
    }
}