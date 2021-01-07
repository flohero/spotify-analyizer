import {SpotifyBaseService} from "./spotify-base-service";

export class ConfigService extends SpotifyBaseService {

    public client(): string {
        return process.env.CLIENT_URL;
    }

    public server(): string {
        return process.env.SERVER_URL;

    }
}