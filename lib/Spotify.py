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
        playlists["items"].append(self.get_playlist("saved_tracks"))
        return playlists

    def get_playlist(self, id):
        '''
        Gets information about a given playlist

        returns: a playlist object
        '''

        if(id == "saved_tracks"):

            playlist= {
                "name": "Saved Tracks",
                "description": "Saved Tracks",
                "id": "saved_tracks",
                "collaborative": False,
                "external_urls": {
                    "spotify": "https://open.spotify.com/collection/tracks"
                },
                "href": "https://api.spotify.com/v1/me/tracks",
                "images": [
                    {
                        "url": "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
                    }
                ],
                "tracks": self._spotify.current_user_saved_tracks(),
                "owner": self._spotify.current_user(),
                "public": None,
                "snapshot_id": None,
                "uri": None,
                "type": "playlist",
                "followers": {
                    "href": None,
                    "total": 0
                }
            }
        
        else:
            playlist = self._spotify.playlist(id)

        return playlist

    def _get_playlist_tracks(self,id):
        '''
        Gets the first 100 tracks inside a certain playlist
        Args:
            id - the playlist id
        Returns:
            tracks - a list of tracks inside that playlist
        '''
        if(id == "saved_tracks"):
            tracks = self._spotify.current_user_saved_tracks()
        else:
            tracks = self._spotify.playlist_tracks(id)
        return tracks
    
    def _get_features(self,track_ids):
        '''
        Gets the audio features for a list of tracks
        Args:
            track_ids - a list of track ids
        Returns:
            analysis - a list of analysis objects that contain many song features for each track passed in
        '''
        analysis = self._spotify.audio_features(track_ids)
        return analysis
    
    def _get_artists(self,artist_ids):
        '''
        Gets artists objects for a list of corresponding artist id's
        Args:
            artist_ids - a list of id's corresponding to artists
        Returns:
            artists - a list of artist objects
        '''
        if len(artist_ids) > 50:
            artists1 = self._spotify.artists(artist_ids[:50])
            artists2 = self._spotify.artists(artist_ids[50:])
            artists = artists1['artists'] + artists2['artists']
            return artists
        else:
            artists = self._spotify.artists(artist_ids)['artists']
            return artists

    def get_playlist_items(self,playlist_id):
        '''
        Method to extract all the playlist items from a playlist regardless of number of items. The Spotify
        API only allows a maximum of 100 playlist tracks, 100 audio features, and 50 artist objects to
        be extracted at once - so a loop is used to repeatedly get the items until none are left.
        '''
        tracks_full = []
        analysis = []
        artists = []
        
        tracks = self._get_playlist_tracks(playlist_id)
        while True:
            
            # initialize empty track_ids and artist_ids lists
            track_ids = []
            artist_ids = []
            
            # extract track objects
            track_objects = [x['track'] for x in tracks['items']]
            
            # extract the track ids
            # extract the artist id's
            for track in track_objects:
                try:
                    if track['id']:
                        track_ids.append(track['id'])
                        artist_ids.append(track['artists'][0]['id'])
                        tracks_full.append(track)
                    else:
                        print('Skipping song...')
                        pass
                except:
                    continue
            
            # get analysis for each track
            # get artists for each track
            if len(track_ids) > 0:
                analysis += self._get_features(track_ids)
            if len(artist_ids) > 0:
                artists += self._get_artists(artist_ids)
            
            if tracks['next']:
                tracks = self._spotify.next(tracks)
            else:
                last_update = tracks['items'][-1]['added_at']
                break
            
            
        
        return tracks_full, analysis, artists, last_update
    
    def current_song(self):
        '''
        Get the currently playing song for a user on spotify. Returns song track object
        if song is playing, otherwise returns false.
        '''
        return self._spotify.current_user_playing_track()
        

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
