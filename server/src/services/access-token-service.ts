import User from "../model/user-model";

export class AccessTokenService {

    public getAccessTokenById(id: string): Promise<string> {
        return User.findOne({_id: id})
            .then(user => {
                if (!user) {
                    throw new UserNotFoundError();
                }
                return user.access_token;
            });
    }
}

export class UserNotFoundError extends Error {
    constructor() {
        super("User not found");
    }
}
