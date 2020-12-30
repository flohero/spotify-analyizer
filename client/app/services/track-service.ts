import { AudioFeatureView } from "../../../common/src/view/audio-feature-view";

export class TrackService {
    private readonly endpoint: string;
    constructor(endpoint: string) {
        this.endpoint = `${endpoint}/track/audio-features`;
    }
    
    public async getAudioFeatures(id: string): Promise<AudioFeatureView[]> {
        return fetch(`${this.endpoint}/${id}`)
            .then(r => r.json());
    }
}