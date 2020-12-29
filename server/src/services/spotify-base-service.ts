export abstract class SpotifyBaseService {
    /* config */
    protected readonly endPoint = "https://api.spotify.com/v1/me";
    protected readonly resultLimit = 30;

    protected _handleErrors(response: Response) {
        if (!response.ok){
            throw new Error(`${response.status}: ${response.statusText}`);
        } 
        return response;
      }

    protected _getHeaders(accessToken: string) {
        return  { 'Authorization': `Bearer ${accessToken}` } as HeadersInit;
    }
}