import {AuthService} from "./services/auth-service";

window.onload = () => {
    const PORT = 3000;
    const hostname = window.location.hostname;
    const auth = new AuthService(`http://${hostname}:${PORT}`);
    auth.getAuthUri()
        .then(res => {
            return res.json()
        })
        .then( uri => {
            console.log(uri.url);
            window.location.assign(uri.url);
        });
};