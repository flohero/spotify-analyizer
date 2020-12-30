import {UserService} from "./services/user-service";
import {UserView} from "../../common/src/view/user-view";
import { TrackService } from "./services/track-service";
import { AudioFeatureView } from "../../common/src/view/audio-feature-view";

function initUserProfileView(user: UserView): void {
    console.log(user);
    const img = document.getElementById("profile-image") as HTMLImageElement;
    const name = document.getElementById("profile-name");
    const email = document.getElementById("profile-email");
    img.src = user.image;
    name.innerText = user.name;
    email.innerText = user.email;
}

function createFeatureItem(name: string, value: number) {
    const percent = Math.round(value * 100);
        
    return `
        <div>
            ${name} ${Math.round(percent)}/100
            <div class="progressbar">
                <div class="progressbar__progress " style="width:${percent}%; background-color: #1db954;"></div>
            </div>
        </div>`;
}

function initAudioFeature(feature: AudioFeatureView) {
    console.log(feature);

    var featureHTML = "";
    featureHTML += createFeatureItem("Acousticness", feature.acousticness);
    featureHTML += createFeatureItem("Energy", feature.energy);
    featureHTML += createFeatureItem("Happiness", feature.valence);
    featureHTML += createFeatureItem("Instrumentalness", feature.instrumentalness);
    featureHTML += createFeatureItem("Liveness", feature.liveness);
    featureHTML += createFeatureItem("Speechiness", feature.speechiness);
    featureHTML += createFeatureItem("Danceability", feature.danceability);

    document.getElementById("featureContainer").innerHTML = featureHTML;
}

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("id") || localStorage.getItem("id") || null;
    if(!code) {
        window.location.assign("/app/index.html");
    }
    localStorage.setItem("id", params.get("id"));
    const PORT = 3000;
    const hostname = window.location.hostname;
    const userService = new UserService(`http://${hostname}:${PORT}`);
    userService.getUser(params.get("id"))
        .then(initUserProfileView);

    const trackService = new TrackService("http://localhost:3000");
    trackService.getAudioFeature(params.get("id")).then(initAudioFeature);
}