declare namespace GeniusApi {
  interface Artist {
    api_path: string
    header_image_url: string
    id: number
    image_url: string
    is_meme_verified: boolean
    is_verified: boolean
    name: string
    url: string
  }

  interface Stats {
    accepted_annotations: number
    contributors: number
    iq_earners: number
    transcribers: number
    unreviewed_annotations: number
    verified_annotations: number
    hot: boolean
    pageviews: number
  }

  interface Album {
    api_path: string
    cover_art_url: string
    full_title: string
    id: number
    name: string
    url: string
    artist: Artist
  }

  interface Relationship {
    relationship_type: string
    type: string
    url: string
    songs: object[]
  }

  interface HtmlDescription {
    html: string
  }

  interface CustomPerformances {
    label: string
    artists: Artist[]
  }

  interface Interfactions {
    [key: string]: boolean
  }

  interface Relationships {
    [key: string]: string
  }

  interface IqByAction {
    [action: string]: {
      [type: string]: {
        multiplier: number
        base: number
        applicable: boolean
      }
    }
  }

  interface UserMetadata {
    permissions: string[]
    excluded_permissions: string[]
    interactions: Interfactions
    relationships: Relationships
    iq_by_action: IqByAction
  }

  interface Avatar {
    [size: string]: {
      url: string
      bounding_box: {
        width: number
        height: number
      }
    }
  }

  interface User {
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

  interface Author {
    attribution: number
    pinned_role: string
    user: User
  }

  interface AnnotationHtml {
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

  interface DescriptionAnnotation {
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

  interface SongObject {
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

  interface SongResponse {
    meta: {
      status: number
    }
    response: {
      song: SongObject
    }
  }

  interface DateComponents {
    year: number
    month: number
    day: number
  }

  interface SongSearchResult {
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

  interface SearchHit {
    highlights: object[]
    index: string
    type: string
    result: SongSearchResult
  }

  interface SearchResponse {
    meta: {
      status: number
    }
    response: {
      hits: SearchHit[]
    }
  }
}
