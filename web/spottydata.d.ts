declare namespace Spottydata {
  // interface for CalendarCoordinates -- the datapoint
  // required for the nivo calendar plot
  interface CalendarCoordinate {
    day: string
    value: number
  }

  // interface for the feature analysis object
  // that comes out of the data manipulation
  // done serverside to organize each track into
  // it's own fundamental datapoint
  interface PlaylistTrackFeatureObject {
    acousticness: number
    danceability: number
    energy: number
    instrumentalness: number
    liveness: number
    loudness: number
    playlist: SpotifyApi.PlaylistObjectFull
    speechiness: number
    tempo: number
    track: SpotifyApi.TrackObjectFull
    valence: number
    [feature: string]: number
  }

  // interface for a top genre's datapoint that
  // is required for the nivo PieChart
  interface TopGenre {
    id: string
    lavel: string
    value: number
  }

  interface KeyCounts {
    [key: string]: {
      Major: number
      Minor: number
    }
  }

  // interface for a profiles entire analysis
  // this is returned from the Google Cloud Functions
  interface ProfileAnalysis {
    artist_map: string[]
    calendar_coordinates: CalendarCoordinate[]
    collaboration_matrix: [][]
    feature_data: {
      [playlist: string]: PlaylistTrackFeatureObject[]
    }
    key_counts: KeyCounts
    top_genres: TopGenre[]
  }

  // authentication payload object
  interface AuthPayload {
    grant_type: string
    code: string
    redirect_uri: string
  }

  // auth data interface
  interface AuthData {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
    scope: string
  }
}
