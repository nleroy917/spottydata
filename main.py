# gcloud functions
from flask import Request
from flask_cors import cross_origin
from spottydata.analysis import Analyzer

@cross_origin()
def analyze_profile(request: Request) -> dict:
    
    # extract access token and init analyzer
    access_token = request.headers['access_token']
    az = Analyzer(access_token=access_token)
    playlists = az.user_playlists()
    
    # get all tracks
    all_tracks = []
    for playlist in playlists:
        tracks = az.playlist_tracks(playlist['id'])
        all_tracks += tracks
    
    all_tracks_cleaned = az._clean_playlist_tracks(all_tracks)
    collaboration_matrix, artist_map = az.collaboration_matrix(all_tracks_cleaned, n=50)
    
    return {
		"collaboration_matrix": collaboration_matrix,
  		"artist_map": artist_map
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