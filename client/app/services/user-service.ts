export class UserService {
    private readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint + "/user/";
    }

    public getUser(id: string): Promise<User> {
        return fetch(this.endpoint + id)
            .then( res => {
                if(res.status == 404) {
                    throw new Error("User not found");
                }
                return res.json();
            })
            .then(userData => {
                return new User(userData.name, userData.email, userData.profile_image);
            })
    }
}

export class User {
    constructor(readonly name, readonly email, readonly image) {
    }
}