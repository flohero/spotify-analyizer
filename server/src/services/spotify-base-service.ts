import fetch from "node-fetch";

export abstract class SpotifyBaseService {
    /* config */
    protected readonly endPoint = "https://api.spotify.com/v1";
    protected readonly resultLimit = 30;
}