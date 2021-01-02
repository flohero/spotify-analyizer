import {UserService} from "./services/user-service";
import {UserView} from "../../common/src/view/user-view";
import {TrackService} from "./services/track-service";
import {AudioFeatureView} from "../../common/src/view/audio-feature-view";
import {EndpointService} from "./services/endpoint-service";
import {Chart} from "chart.js";
import {ArtistService} from "./services/artist-service";
import {ArtistView} from "../../common/src/view/artist-view";

function initUserProfileView(user: UserView): void {
    const img = document.getElementById("profile-image") as HTMLImageElement;
    const name = document.getElementById("profile-name");
    const email = document.getElementById("profile-email");
    img.height = img.width;
    window.onresize = () => img.height = img.width;
    if (user.image) {
        img.src = user.image;
    }
    name.innerText = user.display_name ?? user.name;
    email.innerText = user.email;
}

function createFeatureItem(name: string, value: number) {
    const percent = Math.round(value * 100);

    const cssClass = name == "Happiness" ? "valence" : name.toLowerCase();

    return `
        <div>
            ${name} ${Math.round(percent)}/100
            <div class="progressbar">
                <div class="progressbar__progress ${cssClass}" style="width:${percent}%;"></div>
            </div>
        </div>`;
}

function createFeatureChart(recentFeature: AudioFeatureView, feature: AudioFeatureView) {
    const chartCanvas = document.getElementById("feature-chart") as HTMLCanvasElement;

    const chartData = {
        labels: ["ACOUSTICNESS", "ENERGY", "HAPPINESS", "INSTRUMENTALNESS", "LIVENESS", "SPEECHINESS", "DANCEABILITY"],
        datasets: [
            {
                label: "Last 4 weeks",
                backgroundColor: "rgba(29, 185, 84, 0.1)",
                borderColor: "#1db954",
                data: [
                    Math.round(recentFeature.acousticness * 100)
                    , Math.round(recentFeature.energy * 100)
                    , Math.round(recentFeature.valence * 100)
                    , Math.round(recentFeature.instrumentalness * 100)
                    , Math.round(recentFeature.liveness * 100)
                    , Math.round(recentFeature.speechiness * 100)
                    , Math.round(recentFeature.danceability * 100)
                ]
            },
            {
                label: "Overall",
                backgroundColor: "rgb(203, 21, 130, 0.1)",
                borderColor: "#cb1582",
                data: [
                    Math.round(feature.acousticness * 100)
                    , Math.round(feature.energy * 100)
                    , Math.round(feature.valence * 100)
                    , Math.round(feature.instrumentalness * 100)
                    , Math.round(feature.liveness * 100)
                    , Math.round(feature.speechiness * 100)
                    , Math.round(feature.danceability * 100)
                ]
            }
        ]
    } as Chart.ChartData;

    Chart.defaults.global.defaultFontColor = 'white';
    Chart.defaults.scale.ticks.display = false;

    const chartOptions = {
        responsive: true,
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

function initAudioFeatureView(recentFeature: AudioFeatureView, feature: AudioFeatureView) {

    let featureHTML = "";
    featureHTML += createFeatureItem("Acousticness", recentFeature.acousticness);
    featureHTML += createFeatureItem("Energy", recentFeature.energy);
    featureHTML += createFeatureItem("Happiness", recentFeature.valence);
    featureHTML += createFeatureItem("Instrumentalness", recentFeature.instrumentalness);
    featureHTML += createFeatureItem("Liveness", recentFeature.liveness);
    featureHTML += createFeatureItem("Speechiness", recentFeature.speechiness);
    featureHTML += createFeatureItem("Danceability", recentFeature.danceability);

    document.getElementById("feature-percentage").innerHTML = featureHTML;

    createFeatureChart(recentFeature, feature);
}

function initTopArtistView(artists: ArtistView[]): void {
    console.log(artists);
    const artistTable = document.getElementById("artists");
    artists.forEach(artist => {
        artistTable.innerHTML +=
            `<tr class="artist-table__row">
                <td class="artist-table__cell"><img class="artist-table__img" src="${artist.image}" alt="${artist.name} Image"></td>
                <td class="text-size-h4 artist-table__cell">${artist.name}</td>
                <td class="artist-table__cell">${artist.popularity}</td>
                <td class="artist-table__cell">
                    <div class="artist-table__genres">
                        ${artist.genres.map(genre => {
                            return `<div class="chip chip--primary">${genre}</div>`;
                        }).join("")}
                    <div>
                </td>
            </tr>`
    });
}

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || null;
    if (!id) {
        window.location.assign("login.html");
    }
    const userService = new UserService(EndpointService.getEndpoint());
    userService.getUser(id)
        .then(initUserProfileView);

    const trackService = new TrackService(EndpointService.getEndpoint());
    trackService.getRecentAudioFeature(id).then(recentFeature => {
        trackService.getAudioFeature(id).then(feature => initAudioFeatureView(recentFeature, feature));
    });

    const artistService = new ArtistService(EndpointService.getEndpoint());
    artistService.getTopArtists(id)
        .then(initTopArtistView)
}