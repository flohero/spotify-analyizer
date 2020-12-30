import {AuthService} from "./services/auth-service";
import {EndpointService} from "./services/endpoint-service";

window.onload = () => {
    const auth = new AuthService(EndpointService.getEndpoint());
    auth.getAuthUri()
        .then(res => {
            return res.json()
        })
        .then( uri => {
            console.log(uri.url);
            window.location.assign(uri.url);
        });
};