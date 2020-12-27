import "express"
import {Application} from "express";
import {AuthController} from "../controllers/auth-controller";


export class AuthRoutesConfig {
    app: Application;
    authController: AuthController = new AuthController();

    constructor(app: Application) {
        this.app = app;
        this.configureRoutes();
    }

    configureRoutes(): Application {
        this.app
            .get("/auth_uri",
                (req, res) => {
                    res.type("json");
                    res.send({
                        "url": this.authController.buildUri()
                    });
                }
            )
            .get("/callback", (req, res) => {
                const code = req.headers.code as string || null;
                if(!code) {
                    res.status(400);
                    return;
                }
                this.authController.requestSessionToken(code)
                    .then(tokens => {
                       console.log(tokens);
                       res.status(200);
                    });
            });
        return this.app;
    }
}
