import { BaseService } from "./base-service";

export class AuthService extends BaseService {

    constructor(endpoint: string) {
        super(endpoint);
    }

    getAuthUri(): Promise<Response> {
        return fetch(`${this.endpoint}/auth_uri`);
    }
}