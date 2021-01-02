import "express"
import { Application } from "express";
import { AuthService } from "../services/auth-service";
import * as querystring from "querystring";
import { BaseRouter } from "./base-router";

export class AuthRouter extends BaseRouter {
    private readonly authController: AuthService = new AuthService();

    constructor(app: Application) {
        super(app);
    }

    protected configureRoutes(): Application {
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
                        res.redirect(`http://localhost:1234/dashboard.html?${querystring.stringify({
                            id: user.id
                        })}`);
                    });
            }
            );
    }
}
