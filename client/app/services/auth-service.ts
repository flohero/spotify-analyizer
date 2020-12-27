export class AuthService {
    private readonly endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAuthUri(): Promise<Response> {
        return fetch(this.endpoint + "/auth_uri");
    }
}