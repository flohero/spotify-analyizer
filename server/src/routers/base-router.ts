import { Application } from "express";

export abstract class BaseRouter {

    protected readonly app: Application;

    protected constructor(app: Application) {
        this.app = app;
        this.configureRoutes();
    }

    protected abstract configureRoutes(): void;
}