import "express"
import { Application } from "express";
import { AuthService } from "../services/auth-service";
import * as querystring from "querystring";
import { BaseRouter } from "./base-router";
import {ConfigService} from "../services/config-service";

export class AuthRouter extends BaseRouter {
    private readonly authService: AuthService = new AuthService();
    private readonly configService: ConfigService = new ConfigService();

    constructor(app: Application) {
        super(app);
    }

    protected configureRoutes(): Application {
        return this.app
            .get("/auth_uri",
                (req, res) => {
                    res.type("json");
                    res.send({
                        "url": this.authService.buildUri()
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

                this.authService.requestSessionToken(code)
                    .then(user => {
                        res.redirect(`${this.configService.client()}/dashboard.html?${querystring.stringify({
                            id: user.id
                        })}`);
                    });
            }
            );
    }
}
