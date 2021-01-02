import { AudioFeatureView } from "../../../common/src/view/audio-feature-view";

export class TrackService {
    private readonly endpoint: string;
    constructor(endpoint: string) {
        this.endpoint = `${endpoint}/track`;
    }
    
    public getRecentAudioFeature(id: string): Promise<AudioFeatureView> {
        return fetch(`${this.endpoint}/recent-audio-features/${id}`)
            .then(r => r.json());
    }

    public getAudioFeature(id: string): Promise<AudioFeatureView> {
        return fetch(`${this.endpoint}/audio-features/${id}`)
            .then(r => r.json());
    }
}