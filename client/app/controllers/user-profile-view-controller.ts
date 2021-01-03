import {BaseController} from "./base-controller";
import {UserService} from "../services/user-service";
import {EndpointService} from "../services/endpoint-service";

export class UserProfileViewController extends BaseController {
    private readonly userService: UserService = new UserService(EndpointService.getEndpoint());

    constructor(id: string) {
        super(id);
        this.initView();
    }

    public initView() {
        const img = document.getElementById("profile-image") as HTMLImageElement;
        const name = document.getElementById("profile-name");
        const email = document.getElementById("profile-email");
        this.userService.getUser(this.id)
            .then(user => {
                if (user.image) {
                    img.src = user.image;
                }
                name.innerText = user.display_name ?? user.name;
                email.innerText = user.email;
            });

    }
}