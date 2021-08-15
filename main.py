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
        # append the playlist meta data
        # to the track objects
        for i in range(len(tracks)):
            tracks[i]['playlist'] = playlist
        all_tracks += tracks
    
    # set extract_tracks flag to False to keep playlist data
    all_tracks_cleaned = az._clean_playlist_tracks(all_tracks, extract_tracks=False)
    
    # use newly cleaned tracks to gather artist
    # data for each track
    all_artists = az.artists_from_tracks([t['track'] for t in all_tracks_cleaned])
    
    # use newly cleaned tracks to gather the analysis.
    # since we are keeping playlist meta-data we need
    # to a keep extraction of the track object since the
    # track analysis method requires us to pass in a list
    # of raw track objects
    analysis = az.track_analysis([t['track'] for t in all_tracks_cleaned])
    
    # assign the analysis data to each track
    for i in range(len(all_tracks_cleaned)):
        all_tracks_cleaned[i]['analysis'] = analysis[i]
    
    # we now have a list of all tracks with their corresponding
    # playlist metadata and their analysis --
    # -- this will help for creating a very 
    # rich analysis that gives data down to the
    # track level when inspecting our charts.
    collaboration_matrix, artist_map = az.collaboration_matrix([t['track'] for t in all_tracks_cleaned], n=50)
    top_genres = az.genre_counts(all_artists, n=5)
    key_counts = az.key_counts(t['analysis'] for t in all_tracks_cleaned)
    calendar_coordinates = az.song_calendar(all_tracks_cleaned)
    playlist_feature_data = az.playlist_features(all_tracks_cleaned)
    
    return {
		"collaboration_matrix": collaboration_matrix,
  		"artist_map": artist_map,
        "calendar_coordinates": calendar_coordinates,
        "top_genres": [{
            "id": g[0],
            "label": g[0],
            "value": g[1]
        } for g in top_genres],
        "key_counts": key_counts,
        "feature_data": playlist_feature_data
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