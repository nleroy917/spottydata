import spotipy

class Spotify():
    '''
    A class that interfaces the Spotify API utilizing the library spotipy
    '''
    
    def __init__(self,access_token, client_id=None, client_secret=None):
        '''
        initialize spotify interface object
        Args:
            access_token - the access token obtained as part of the authorization code flow on the front-end
        '''
        self._spotify = spotipy.Spotify(auth=access_token)

    def get_playlists(self):
        '''
        Gets all of the playlists for a user based on the access token
        
        returns: list of playlist objects
        '''
        playlists = self._spotify.current_user_playlists()
        return playlists

    def get_playlist_tracks(self,id):
        '''
        Gets the first 100 tracks inside a certain playlist
        Args:
            id - the playlist id
        Returns:
            tracks - a list of tracks inside that playlist
        '''
        tracks = self._spotify.playlist_tracks(id)
        return tracks
    
    def get_features(self,track_ids):
        '''
        Gets the audio features for a list of tracks
        Args:
            track_ids - a list of track ids
        Returns:
            analysis - a list of analysis objects that contain many song features for each track passed in
        '''
        analysis = self._spotify.audio_features(track_ids)
        return analysis
    
    def get_artists(self,artist_ids):
        '''
        Gets artists objects for a list of corresponding artist id's
        Args:
            artist_ids - a list of id's corresponding to artists
        Returns:
            artists - a list of artist objects
        '''
        artists1 = self._spotify.artists(artist_ids[:50])
        artists2 = self._spotify.artists(artist_ids[50:])
        artists = artists1['artists'] + artists2['artists']
        return artists

    def get_recommendations(self):
        '''
        Gets song recommendations for a specified user. This is all done on Spotify's end. It takes in
        a few seed genres that are generated with Spotipy, then those are passed back into the recommednation
        method to produce a list of recommended songs
        
        returns: recs - a lsit of recommended songs
        '''
        seeds = self._spotify.recommendation_genre_seeds()
        recs = self._spotify.recommendations(seed_genres=seeds)
        return recs
