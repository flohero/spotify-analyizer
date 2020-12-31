export interface AudioFeatureView  {
    readonly valence: number; // in other words happiness
    readonly danceability: number;
    readonly energy: number;
    readonly acousticness: number;
    readonly instrumentalness: number;
    readonly liveness: number;
    readonly speechiness: number;
}