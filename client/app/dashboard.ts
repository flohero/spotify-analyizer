import {UserService} from "./services/user-service";
import {UserView} from "../../common/src/view/user-view";
import {TrackService} from "./services/track-service";
import {AudioFeatureView} from "../../common/src/view/audio-feature-view";
import {EndpointService} from "./services/endpoint-service";
import * as Chart from "chart.js";
import {ArtistService} from "./services/artist-service";
import {ArtistView} from "../../common/src/view/artist-view";
import {GenreHistoryView} from "../../common/src/view/genre-history-view";
import * as moment from "moment";
import {Dictionary} from "./models/dictionary";
import {GenreSum} from "./models/genre-sum";

// set chart defaults
Chart.defaults.global.defaultFontColor = 'white';

function initUserProfileView(user: UserView): void {
    const img = document.getElementById("profile-image") as HTMLImageElement;
    const name = document.getElementById("profile-name");
    const email = document.getElementById("profile-email");
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
            <div class="bold">${name} ${Math.round(percent)}/100</div>
            <div class="progressbar">
                <div class="progressbar__progress ${cssClass}" style="width:${percent}%;"></div>
            </div>
        </div>`;
}

function createFeatureChart(recentFeature: AudioFeatureView, feature: AudioFeatureView) {
    const chartCanvas = document.getElementById("feature-chart") as HTMLCanvasElement;

    const data = {
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
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "#fff",
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

    const options = {
        responsive: true,
        scale: {
            angleLines: {
                color: "gray",
            },
            gridLines: {
                color: "gray"
            },
            ticks: {
                display: false
            }
        }
    } as Chart.ChartOptions;

    new Chart(chartCanvas, {
        type: 'radar',
        data: data,
        options: options
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

function initTopGenre(artists: ArtistView[]) {
    const genreContainer = document.getElementById("top-genre");
    const genres = artists
        .map(artist => artist.genres)
        .reduce((flat, flatten) => {
            return flat.concat(flatten)
        });
    genreContainer.innerText = genres
        .sort((a, b) =>
            genres.filter(v => v === a).length
            - genres.filter(v => v === b).length
        )
        .pop();
}

function initTopArtistView(artists: ArtistView[]): ArtistView[] {
    const artistTable = document.getElementById("artists");
    artists.slice(0, 6).forEach(artist => {
        artistTable.innerHTML +=
            `<tr class="artist-table__row">
                <td class="artist-table__count artist-table__cell text-size-h5"></td>
                <td class="artist-table__cell"><img class="artist-table__img" src="${artist.image}" alt="${artist.name} Image"></td>
                <td class="text-size-h5 artist-table__cell">${artist.name}</td>
                <td class="artist-table__cell artist-table__popularity ${artist.popularity > 66 ? "artist-table__cell--red" : artist.popularity > 33 ? "artist-table__cell--orange" : "artist-table__cell--blue"}">${artist.popularity}</td>
                <td class="artist-table__cell">
                    <div class="artist-table__genres">
                        ${artist.genres.map(genre => {
                return `<div class="chip chip--primary">${genre}</div>`;
            })
                .join("")}
                    <div>
                </td>
            </tr>`
    });
    return artists;
}

function groupGenreHistory(history: GenreHistoryView[]): Dictionary<GenreSum[]> {

    let dict = new Dictionary<GenreSum[]>();

    history.forEach(h => {
        // HACK fix date
        let date_string = (h.timestamp as any) as string;
        let date = moment(date_string).startOf('day').toISOString();

        if (dict.containsKey(date)) { // date entry already exists
            const value = dict.getItem(date);
            h.genres.forEach(genre => {

                if (value.filter(i => i.genre == genre).length == 0) { // genre is new
                    dict.getItem(date).push({genre: genre, count: 1});
                } else { // genre already exists
                    dict.getItem(date).filter(i => i.genre == genre)[0].count++;
                }
            })
        } else { // new date entry
            dict.add(date, h.genres.map(genre => ({genre: genre, count: 1})));
        }
    });

    return dict;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createTimelineChartData(history: GenreHistoryView[]): Chart.ChartData {
    const genres = groupGenreHistory(history);
    const keys = genres.getKeys();

    const data = {
        labels: keys,
        datasets: []
    } as Chart.ChartData;

    const max = 5;

    keys.forEach(k => {
        const itemsWithSum = genres.getItem(k).slice(0, max);

        // console.log(groupedSums);

        itemsWithSum.forEach(itemWithSum => {

            let dataset = data.datasets.filter(dataset => itemWithSum.genre == dataset.label)?.[0];
            if (dataset) { // dataset already exists
                dataset.data.push(itemWithSum.count);
            } else { // new dataset is necessary
                data.datasets.push({
                    label: itemWithSum.genre,
                    data: [itemWithSum.count],
                    borderColor: getRandomColor(), // TODO random color from given color set
                    fill: false
                });
            }
        });
        // genre does not exist with current date
        data.datasets.filter(d => itemsWithSum.map(s => s.genre).indexOf(d.label) == -1)
            .forEach(d => d.data.push(null));

    });

    return data;
}

function initTimelineView(history: GenreHistoryView[]) {

    const options = {
        responsive: true,
        legend: {
            position: "bottom"
        },
        scales: {
            yAxes: [{
                gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "gray"
                }
            }],
            xAxes: [{
                type: "time",
                ticks: {
                    maxTicksLimit: 10,
                },
                time: {
                    tooltipFormat: "YYYY/MM/DD",
                    minUnit: "day",
                    displayFormats: {
                        day: "YYYY/MM/DD"
                    },
                }
            }]
        }
    } as Chart.ChartOptions;

    new Chart("timeline-chart", {
        type: 'line',
        data: createTimelineChartData(history),
        options: options
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
        .then(initTopGenre);

    trackService.getGenresOfLastHeardTracks(id).then(initTimelineView);
}