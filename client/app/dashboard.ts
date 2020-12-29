import {UserService} from "./services/user-service";
import {UserView} from "../../common/src/view/user-view";

function initUserProfileView(user: UserView): void {
    console.log(user);
    const img = document.getElementById("profile-image") as HTMLImageElement;
    const name = document.getElementById("profile-name");
    const email = document.getElementById("profile-email");
    img.src = user.image;
    name.innerText = user.name;
    email.innerText = user.email;
}

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("id") || localStorage.getItem("id") || null;
    if(!code) {
        window.location.assign("/app/index.html");
    }
    localStorage.setItem("id", params.get("id"));
    const userService = new UserService("http://localhost:3000");
    userService.getUser(params.get("id"))
        .then(initUserProfileView);
}