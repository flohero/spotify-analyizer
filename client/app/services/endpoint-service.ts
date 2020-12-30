export class EndpointService {
    private static readonly PORT = 3000;
    public static getEndpoint():string {
        return `http://${window.location.hostname}:${EndpointService.PORT}`;
    }
}