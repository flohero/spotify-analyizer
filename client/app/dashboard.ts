import {TrackService} from "./services/track-service";
import {AudioFeatureView} from "../../common/src/view/audio-feature-view";
import {EndpointService} from "./services/endpoint-service";
import Chart from "chart.js";
import {GenreHistoryView} from "../../common/src/view/genre-history-view";
import moment from "moment";
import {Dictionary} from "./models/dictionary";
import {GenreSum} from "./models/genre-sum";
import {UserProfileViewController} from "./controllers/user-profile-view-controller";
import {TopArtistViewController} from "./controllers/top-artist-view-controller";
import {ExportPlaylistController} from "./controllers/export-playlist-controller";

// global chart configuration
Chart.defaults.global.defaultFontColor = "white";

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

    new Chart("feature-chart", {
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

function groupGenreHistory(history: GenreHistoryView[], groupByHours: boolean): Dictionary<GenreSum[]> {

    let dict = new Dictionary<GenreSum[]>();

    history.forEach(h => {
        let date = moment(h.timestamp).startOf(groupByHours ? 'hour' : 'day').toISOString();

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

    history = history.reverse();

    if(history.length == 0) {
        return {
            datasets: [],
            labels: []
        } as Chart.ChartData;
    }

    const max_hours = 48;
    const minDate = moment(history[0].timestamp);
    const maxDate = moment(history[history.length - 1].timestamp);
    const duration = moment.duration(maxDate.diff(minDate)).hours();
    const genres = groupGenreHistory(history, duration < max_hours);

    const keys = genres.getKeys();

    const data = {
        labels: keys,
        datasets: []
    } as Chart.ChartData;

    let index = 0;

    keys.forEach(k => {

        const genreSums = genres.getItem(k).filter(i => i.count > 0);

        genreSums.forEach(itemWithSum => {

            const dataset = data.datasets.filter(dataset => itemWithSum.genre == dataset.label)?.[0];

            if (dataset) { // dataset already exists
                dataset.data.splice(index, 1, itemWithSum.count);
            } else { // new dataset is necessary
                const items = new Array(keys.length).fill(0);
                items.splice(index, 1, itemWithSum.count);
                const randomColor = getRandomColor();

                data.datasets.push({
                    label: itemWithSum.genre,
                    data: items,
                    borderColor: randomColor,
                    radius: 5
                });
            }
        });
        index++;
        
    });

    return data;
}

function initTimelineView(history: GenreHistoryView[]) {

    const gridColor = "gray";

    const options = {
        responsive: true,
        legend: {
            position: "bottom"
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    labelString: "Plays",
                    display: true
                },
                ticks: {
                    beginAtZero: true,
                },
                gridLines: {
                    display: true,
                    color: gridColor,
                    zeroLineColor: gridColor
                }
            }],
            xAxes: [{
                scaleLabel: {
                    labelString: "Listen time",
                    display: true
                },
                gridLines: {
                    display: false
                },
                type: "time",
                ticks: {
                    maxTicksLimit: 5,
                },
                time: {
                    tooltipFormat: "YYYY/MM/DD hh:mm",
                    minUnit: "hour",
                    displayFormats: {
                        day: "YYYY/MM/DD"
                    }
                }
            }]
        }
    } as Chart.ChartOptions;

    const timelineChart = new Chart("timeline-chart", {
        type: 'line',
        data: createTimelineChartData(history),
        options: options
    });

    const toggleButton = document.getElementById("toggleGenres");

    toggleButton.addEventListener("click", function() {
        timelineChart.data.datasets.forEach(ds => ds.hidden = !ds.hidden);
        timelineChart.update();
    });
}

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || null;
    if (!id) {
        window.location.assign("login.html");
    }
    new UserProfileViewController(id);
    new TopArtistViewController(id);
    new ExportPlaylistController(id);
    const trackService = new TrackService(EndpointService.getEndpoint());
    trackService.getRecentAudioFeature(id).then(recentFeature => {
        trackService.getAudioFeature(id).then(feature => initAudioFeatureView(recentFeature, feature));
    });

    trackService.getGenresOfLastHeardTracks(id).then(initTimelineView);
    
    
}