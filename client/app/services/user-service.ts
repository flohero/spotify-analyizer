import {UserView} from "../../../common/src/view/user-view";

export class UserService {
    private readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint + "/user/";
    }

    public getUser(id: string): Promise<UserView> {
        return fetch(this.endpoint + id)
            .then( res => {
                if(res.status == 404) {
                    throw new Error("User not found");
                }
                return res.json();
            })
            .then(userData => {
                return new UserView(userData.name, userData.email, userData.image);
            });
    }
}
