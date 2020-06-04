import spotipy

class Spotify():
    '''
    A class that interfaces the Spotify API utilizing the library spotipy
    '''

    def __init__(self,client_id=None,client_secret=None):
        self._spotify = spotipy.Spotify()
        self._access_token = None

    def set_access_token(self,access_token):
        self._access_token = access_token
    
    def get_playlists(self):
        playlists = self._spotify.user_playlists()
        return playlists

