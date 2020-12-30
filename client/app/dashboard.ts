import {UserService} from "./services/user-service";
import {UserView} from "../../common/src/view/user-view";
import {TrackService} from "./services/track-service";
import {AudioFeatureView} from "../../common/src/view/audio-feature-view";
import {EndpointService} from "./services/endpoint-service";

function initUserProfileView(user: UserView): void {
    const img = document.getElementById("profile-image") as HTMLImageElement;
    const name = document.getElementById("profile-name");
    const email = document.getElementById("profile-email");
    img.height = img.width;
    if (user.image) {
        img.src = user.image;
    }
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
    const code = params.get("id")  || null;
    if (!code) {
        window.location.assign("/app/index.html");
    }
    const userService = new UserService(EndpointService.getEndpoint());
    userService.getUser(params.get("id"))
        .then(initUserProfileView);

    const trackService = new TrackService(EndpointService.getEndpoint());
    trackService.getAudioFeature(params.get("id")).then(initAudioFeature);
}