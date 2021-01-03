import {BaseController} from "./base-controller";
import {ArtistService} from "../services/artist-service";
import {EndpointService} from "../services/endpoint-service";

export class TopArtistViewController extends BaseController {
    private readonly artistService: ArtistService = new ArtistService(EndpointService.getEndpoint());

    constructor(id: string) {
        super(id);
        this.initView();
    }

    protected initView() {
        const artistTable = document.getElementById("artists");
        const genreContainer = document.getElementById("top-genre");

        this.artistService.getTopArtists(this.id)
            .then(artists => {
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
            });

    }

}