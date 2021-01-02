import {SpotifyBaseService} from "./spotify-base-service";

export class CredentialService extends SpotifyBaseService{
    readonly #clientId = process.env.SPOTIFY_CLIENT_ID;
    readonly #clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    public clientId(): string {
        return this.#clientId;
    }

    public clientSecret(): string {
        return this.#clientSecret;
    }

    public toBase64(): string {
        return Buffer.from(this.clientId() + ':' + this.clientSecret())
            .toString('base64');
    }

    public authorizationHeader() {
        return {
            "Authorization": "Basic " + this.toBase64()
        }
    }
}