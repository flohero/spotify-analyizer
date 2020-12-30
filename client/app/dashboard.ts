import {UserService} from "./services/user-service";
import {UserView} from "../../common/src/view/user-view";
import { TrackService } from "./services/track-service";
import { AudioFeatureView } from "../../common/src/view/audio-feature-view";
import Chart from "chart.js";

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

function createFeatureChart(feature: AudioFeatureView) {
    var chartCanvas = document.getElementById("audioFeatureChart") as HTMLCanvasElement;

    var chartData = {
        labels: ["ACOUSTICNESS", "ENERGY", "HAPPINESS", "INSTRUMENTALNESS", "LIVENESS", "SPEECHINESS", "DANCEABILITY"],
        datasets: [{
          label: "",
          backgroundColor: "rgba(29, 185, 84, 0.1)",
          borderColor: "#1db954",
          data: [
              Math.round(feature.acousticness * 100)
            , Math.round(feature.energy * 100)
            , Math.round(feature.valence * 100)
            , Math.round(feature.instrumentalness * 100)
            , Math.round(feature.liveness * 100)
            , Math.round(feature.speechiness * 100)
            , Math.round(feature.danceability * 100)
            ]
        }]
      };

    Chart.defaults.global.defaultFontColor = 'white';
    Chart.defaults.global.legend.display = false;
    Chart.defaults.scale.ticks.display = false;

    var chartOptions = {
        title: { text: "RADAR", display: true },
        responsive: true,
        maintainAspectRatio: true,
        scale: {
            angleLines: {
                color: "gray",
            },
            gridLines: {
                color: "gray"
            }
        }
    } as Chart.ChartOptions;

    new Chart(chartCanvas, {
        type: 'radar',
        data: chartData,
        options: chartOptions
    });
}

function initAudioFeatureView(feature: AudioFeatureView) {

    var featureHTML = "";
    featureHTML += createFeatureItem("Acousticness", feature.acousticness);
    featureHTML += createFeatureItem("Energy", feature.energy);
    featureHTML += createFeatureItem("Happiness", feature.valence);
    featureHTML += createFeatureItem("Instrumentalness", feature.instrumentalness);
    featureHTML += createFeatureItem("Liveness", feature.liveness);
    featureHTML += createFeatureItem("Speechiness", feature.speechiness);
    featureHTML += createFeatureItem("Danceability", feature.danceability);

    document.getElementById("featureContainer").innerHTML = featureHTML;

    createFeatureChart(feature);
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
    trackService.getAudioFeature(params.get("id")).then(initAudioFeatureView);
}