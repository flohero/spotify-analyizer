import {AuthService} from "./services/auth-service";

window.onload = () => {
    const auth = new AuthService("http://localhost:3000");
    auth.getAuthUri()
        .then(res => {
            return res.json()
        })
        .then( uri => {
            console.log(uri.url);
            window.location.assign(uri.url);
        });
};