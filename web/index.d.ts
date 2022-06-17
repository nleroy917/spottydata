/// <reference types="@typesspotify-api" />
/// <reference types="@types/react" />
/// <reference types="@types/react-select" />

declare module '*.png'

// interface for CalendarCoordinates -- the datapoint
// required for the nivo calendar plot
export interface CalendarCoordinate {
  day: string
  value: number
}

// interface for the feature analysis object
// that comes out of the data manipulation
// done serverside to organize each track into
// it's own fundamental datapoint
export interface PlaylistTrackFeatureObject {
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
export interface TopGenre {
  id: string
  lavel: string
  value: number
}

export interface KeyCounts {
  [key: string]: {
    Major: number
    Minor: number
  }
}

// interface for a profiles entire analysis
// this is returned from the Google Cloud Functions
export interface ProfileAnalysis {
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
export interface AuthPayload {
  grant_type: string
  code: string
  redirect_uri: string
}

// auth data interface
export interface AuthData {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface Artist {
  api_path: string
  header_image_url: string
  id: number
  image_url: string
  is_meme_verified: boolean
  is_verified: boolean
  name: string
  url: string
}

export interface Stats {
  accepted_annotations: number
  contributors: number
  iq_earners: number
  transcribers: number
  unreviewed_annotations: number
  verified_annotations: number
  hot: boolean
  pageviews: number
}

export interface Album {
  api_path: string
  cover_art_url: string
  full_title: string
  id: number
  name: string
  url: string
  artist: Artist
}

export interface Relationship {
  relationship_type: string
  type: string
  url: string
  songs: object[]
}

export interface HtmlDescription {
  html: string
}

export interface CustomPerformances {
  label: string
  artists: Artist[]
}

export interface Interfactions {
  [key: string]: boolean
}

export interface Relationships {
  [key: string]: string
}

export interface IqByAction {
  [action: string]: {
    [type: string]: {
      multiplier: number
      base: number
      applicable: boolean
    }
  }
}

export interface UserMetadata {
  permissions: string[]
  excluded_permissions: string[]
  interactions: Interfactions
  relationships: Relationships
  iq_by_action: IqByAction
}

export interface Avatar {
  [size: string]: {
    url: string
    bounding_box: {
      width: number
      height: number
    }
  }
}

export interface User {
  api_path: string
  avatar: Avatar
  header_image_url: string
  human_readable_role_for_display: string
  id: number
  iq: number
  login: string
  name: string
  role_for_display: string
  url: string
  current_user_metadata: UserMetadata
}

export interface Author {
  attribution: number
  pinned_role: string
  user: User
}

export interface AnnotationHtml {
  api_path: string
  body: {
    html: string
  }
  comment_count: number
  community: boolean
  custom_preview: string
  has_voters: boolean
  id: number
  pinned: boolean
  share_url: string
  source: string
  state: string
  url: string
  verified: boolean
  votes_total: number
  current_user_metadata: UserMetadata
  authors: Authors[]
  cosigned_by: User[]
  rejection_comment: null
  verified_by: User[]
}

export interface DescriptionAnnotation {
  _type: string
  annotator_id: number
  annotator_login: string
  api_path: string
  classification: string
  fragment: string
  id: number
  is_description: boolean
  path: string
  range: {
    content: string
  }
  song_id: number
  url: string
  verified_annotator_ids: number[]
  annotatable: {
    api_path: string
    client_timestamps: {
      updated_by_human_at: number
      lyrics_updated_at: number
    }
    context: string
    id: number
    image_url: string
    link_title: string
    title: string
    type: string
    url: string
  }
  annotations: AnnotationHtml[]
}

export interface SongObject {
  annotation_count: number
  api_path: string
  apple_music_id: string
  apple_music_player_url: string
  artist_names: string
  description: HtmlDescription
  embed_content: string
  featured_video: boolean
  full_title: string
  header_image_thumbnail_url: string
  header_image_url: string
  id: number
  lyrics_owner_id: number
  lyrics_placeholder_reason: string
  lyrics_state: string
  path: string
  pyongs_count: number
  recording_location: string
  relationships_index_url: string
  release_date: string
  release_date_for_display: string
  song_art_image_thumbnail_url: string
  song_art_image_url: string
  stats: Stats
  title: string
  title_with_featured: string
  url: string
  current_user_metadata: UserMetadata
  album: Album
  custom_performances: CustomPerformances[]
  description_annotation: DescriptionAnnotation
  featured_artists: Artist[]
  lyrics_marked_complete_by: string
  lyrics_marked_staff_approved_by: string
  media: object[]
  primary_artist: Artist
  producer_artists: Artist[]
  song_relationships: Relationship[]
  writer_artists: Artist[]
}

export interface SongResponse {
  meta: {
    status: number
  }
  response: {
    song: SongObject
  }
}

export interface DateComponents {
  year: number
  month: number
  day: number
}

export interface SongSearchResult {
  annotation_count: number
  api_path: string
  artist_names: string
  full_title: string
  header_image_thumbnail_url: string
  header_image_url: string
  id: number
  lyrics_owner_id: number
  lyrics_state: string
  path: string
  pyongs_count: number
  relationships_index_url: string
  release_date_components: DateComponents
  release_date_for_display: string
  song_art_image_thumbnail_url: string
  song_art_image_url: string
  stats: Stats
  title: string
  title_with_featured: string
  url: string
  featured_artists: Artist[]
  primary_artist: Artist[]
}

export interface SearchHit {
  highlights: object[]
  index: string
  type: string
  result: SongSearchResult
}

export interface SearchResponse {
  meta: {
    status: number
  }
  response: {
    hits: SearchHit[]
  }
}

// extend window for
// gtag
declare global {
  interface Window {
    gtag?: any
  }
}
