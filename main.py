# gcloud functions
from flask import Request
from flask_cors import cross_origin
from spottydata.analysis import Analyzer

@cross_origin()
def analyze_profile(request: Request) -> dict:
    
    # extract access token and init analyzer
    access_token = request.headers['access_token']
    az = Analyzer(access_token=access_token)
    playlists = az.user_playlists(is_author=True)
    
    # get all tracks
    all_tracks = []
    for playlist in playlists:
        tracks = az.playlist_tracks(playlist['id'])
        all_tracks += tracks
    
    # clean tracks --
    # - remove None's
    # - extract out the track object
    all_tracks_cleaned = az._clean_playlist_tracks(all_tracks, extract_tracks=True)
    
    # get all analysis
    analysis = az.track_analysis(all_tracks_cleaned)
    
    # gather all artists
    all_artists = az.artists_from_tracks(all_tracks_cleaned)
    
    # generate artist collaboration matrix
    # and calculate top genres
    # and get key counts
    collaboration_matrix, artist_map = az.collaboration_matrix(all_tracks_cleaned, n=50)
    top_genres = az.genre_counts(all_artists, n=5)
    key_counts = az.key_counts(analysis)
    
    
    # reinit clean tracks
    # remove None's and DO NOT extract
    # the track object
    # needed to retain time info
    all_tracks_cleaned = az._clean_playlist_tracks(all_tracks, extract_tracks=False)
    calendar_coordinates = az.song_calendar(all_tracks_cleaned)
    
    return {
		"collaboration_matrix": collaboration_matrix,
  		"artist_map": artist_map,
        "calendar_coordinates": calendar_coordinates,
        "top_genres": [{
            "id": g[0],
            "label": g[0],
            "value": g[1]
        } for g in top_genres],
        "key_counts": key_counts
	}

#
# Custom functions dispatcher for local development
#
def dispatcher(request):
    path = request.path
    
    path = path[1:] # Remove prefix / from path
    
    # Introspect all methods for potential execution
    potential_methods = globals().copy()
    potential_methods.update(locals())
    
    # Try to acquire corresponding method associated to the URL path
    method = potential_methods.get(path)
    if not method:
        raise NotImplementedError("URL Path %s not implemented" % path)
    
    return method(request)