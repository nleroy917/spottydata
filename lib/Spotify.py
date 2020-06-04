import spotipy

class Spotify():
    '''
    A class that interfaces the Spotify API utilizing the library spotipy
    '''

    def __init__(self,access_token, client_id=None, client_secret=None):
        self._spotify = spotipy.Spotify(auth=access_token)

    def get_playlists(self):
        playlists = self._spotify.current_user_playlists()
        return playlists

    def get_playlist_tracks(self,id):
        tracks = self._spotify.playlist_tracks(id)
        return tracks
    
    def get_features(self,track_ids):
        analysis = self._spotify.audio_features(track_ids)
        return analysis
    
    def get_artists(self,artist_ids):
        artists1 = self._spotify.artists(artist_ids[:50])
        artists2 = self._spotify.artists(artist_ids[50:])
        artists = artists1['artists'] + artists2['artists']
        return artists

    def get_recommendations(self):
        seeds = self._spotify.recommendation_genre_seeds()
        recs = self._spotify.recommendations(seed_genres=seeds)
        return recs
