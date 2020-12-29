import { AudioFeatureView } from "../../../common/src/view/audio_feature_view";

const LIMIT = 30;
const TOKEN = "BQAmlzKsBUz-cXPlUKMjNy7dyFpnLqCw-IX0DNlJ71J_7DE2glyz8l_tjhFppoO0zljYGnx_yrmxDNhwmz00S-rcmXZG8LMnbJ92wvoQ5A9pEi5pcz1CTqAXF0-ZBXD1PmukGga9DvoRilzHhztQ0HqZCZO3tH0pmgYw2do";

export class TrackService {
    private readonly endpoint: string;
    constructor(endpoint: string) {
        this.endpoint = `${endpoint}/track`;
    }
    
    public async getAudioFeatures(id: string): Promise<AudioFeatureView[]> {
        return fetch(`${this.endpoint}?id=${id}`)
            .then(r => r.json());
    }
}