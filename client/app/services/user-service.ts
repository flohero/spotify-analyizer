import {UserView} from "../../../common/src/view/user-view";
import { BaseService } from "./base-service";

export class UserService extends BaseService {

    constructor(endpoint: string) {
        super(`${endpoint}/user`);
    }

    public getUser(id: string): Promise<UserView> {
        return fetch(`${this.endpoint}/${id}`)
            .then(res => {
                if (res.status == 404) {
                    throw new Error("User not found");
                }
                return res.json();
            })
            .then(userData => {
                return {
                    name: userData.name,
                    email: userData.email,
                    image: userData.image,
                    display_name: userData.display_name
                } as UserView;
            });
    }
}
