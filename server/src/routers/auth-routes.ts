import "express"
import {Application} from "express";
import {AuthController} from "../controllers/auth-controller";
import * as querystring from "querystring";

export class AuthRoutesConfig {
    private readonly app: Application;
    private readonly authController: AuthController = new AuthController();

    constructor(app: Application) {
        this.app = app;
        this.configureRoutes();
    }

    private configureRoutes(): Application {
        return this.app
            .get("/auth_uri",
                (req, res) => {
                    res.type("json");
                    res.send({
                        "url": this.authController.buildUri()
                    });
                }
            )
            .get("/callback", (req, res) => {
                    const code = req.query.code as string || null;
                    if (!code) {
                        res.status(400);
                        res.type("json");
                        res.send({
                            "error": "Missing Query Param 'code'"
                        })
                        return;
                    }

                    this.authController.requestSessionToken(code)
                        .then(user => {
                            res.redirect(`http://localhost:1234/app/dashboard.html?${querystring.stringify({
                                id: user.id
                            })}`);
                        });
                }
            );
    }
}
