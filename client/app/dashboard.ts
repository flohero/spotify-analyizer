import {AuthService} from "./services/auth-service";

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || localStorage.getItem("code") || null;
    if(!code) {
        window.location.assign("https://accounts.spotify.com/authorize?response_type=code&client_id=92ff963153ef4dcb9357a0b11c5aad48&scope=user-read-private user-read-email&redirect_uri=http://localhost:1234/app/dashboard.html");
    }
    localStorage.setItem("code", params.get("code"));
    const auth = new AuthService("http://localhost:3000");
}