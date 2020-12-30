export abstract class SpotifyBaseService {
    /* config */
    protected readonly endPoint = "https://api.spotify.com/v1";
    protected readonly resultLimit = 30;

    protected handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    protected getAuthenticationHeader(accessToken: string): any {
        return {
            "Authorization": "Bearer " + accessToken
        }
    }
}