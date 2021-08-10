from dateutil import parser
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# debugger doesn't like relative imports
# use try catch for local package importing
try: from .utils import *
except: from utils import *

class Analyzer:
    """
    Object to run analysis on someones profile
    """
    def __init__(self, access_token: str = None, **kwargs):
        if not access_token:
            self._sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
                client_id=kwargs['client_id'],
                client_secret=kwargs['client_secret'],
                redirect_uri=kwargs['redirect_uri'],
                scope="playlist-read-private playlist-read-collaborative user-top-read user-library-read user-read-playback-state user-read-recently-played"
            ))
        else:
            self._sp = spotipy.Spotify(auth=access_token)
        
        # fetch user profile
        self.profile = self._sp.current_user()
    
    def _grouper(self, list: list, n: int) -> list:
        """Groups a list into a list of subllists of length n"""
        return [list[i:i+n] for i in range(0, len(list), n)]
    
    def user_playlists(self, is_author: bool = False) -> list[dict]:
        """Get list of user's playlists - iterate until all are fetched"""
        
        all_playlists = []
        playlists = self._sp.current_user_playlists(limit=50)
        all_playlists += playlists['items']
        
        while playlists['next']:
            playlists = self._sp.next(playlists)
            all_playlists += playlists['items']
            
        if is_author == True:
            return filter(lambda p: p['owner']['display_name'] == self.profile['display_name'], all_playlists)
        else:
            return all_playlists

    def playlist_tracks(self, id: str) -> list[dict]:
        """Get a list of tracks in a playlist -- iterate until all are fetched"""
        all_tracks = []
        tracks = self._sp.playlist_tracks(id, limit=100)
        all_tracks += tracks['items']
        
        while tracks['next']:
            tracks = self._sp.next(tracks)
            all_tracks += tracks['items']
            
        return all_tracks
    
    def _clean_playlist_tracks(self, tracks: list[dict], extract_tracks: bool = True) -> list[dict]:
        """Quick method to clean a list of tracks return from a playlist track request"""
        if extract_tracks:
            tracks = [track['track'] for track in tracks if track['track'] is not None]
        else:
            tracks = [track for track in tracks if track['track'] is not None]
        return tracks
    
    def artists_from_tracks(self, tracks: list[dict]) -> list[dict]:
        """
        Retrieve a list of artists from a list of tracks
        """
        artist_ids = []
        for track in tracks:
            artist_ids += [a['id'] for a in track['artists'] if a['id'] is not None]
        
        if len(artist_ids) > 50:
            grouped_ids = self._grouper(artist_ids, 50)
            all_artists = []
            for id_list in grouped_ids:
                artists = self._sp.artists(id_list)
                all_artists += artists['artists']
            return all_artists
        else:
            return self._sp.artists(artist_ids)
    
    def genres_from_artists(self, artists: list[dict]) -> list[dict]:
        all_genres = []
        for artist in artists:
            all_genres += artist['genres']
        return all_genres

    def _gather_top__n_artists(self, tracks: list['dict'], n: int) -> list[dict]:
        """
        Return a list of your top n artists.
        :param - tracks - a list of playlist track objects
        :param - n - number of artists to return
        """
        
        all_artist_names = []
        for track in tracks:
            for artist in track['artists']:
                all_artist_names.append(artist['name'])
        
        # count up artist occurances
        artist_counts = {}
        for name in all_artist_names:
            if name not in artist_counts:
                artist_counts[name] = 1
            else:
                artist_counts[name] += 1

        artist_counts = sorted(artist_counts.items(), key=lambda kv: kv[1], reverse=True)
        artist_counts_top_n = artist_counts[:n]
        
        return [a[0] for a in artist_counts_top_n]

    def track_analysis(self, tracks: list[dict]) -> list[dict]:
        """
        Use the Spotify API to fetch analysis for a list of tracks
        """
        track_ids = [t['id'] for t in tracks]
        
        # tracks can only be analyzed in groups of 100
        # so we must grouup them
        grouped_ids = self._grouper(track_ids, 100)
        all_analysis = []
        for ids in grouped_ids:
            analysis = self._sp.audio_features(ids)
            all_analysis += (analysis)
        
        return all_analysis
            
    
    def collaboration_matrix(self, tracks: list[dict], n: int = None) -> list[list]:
        """
        Create a feature matrix ready for plotting in
        a standard chord diagram
        
        :param - tracks - a list of playlist track objects
        :param - n (optional) - create feature matrix for top n artists. That
                                is artsists that appear the most
        """
        if n:
            top_n_artist_names = self._gather_top__n_artists(tracks, n)
  
            # names of artists who are doing features
            artist_map = []
            for track in tracks:
                if len(track['artists']) > 1:
                    for artist in track['artists']:
                        # update artist map
                        if artist['name'] not in artist_map and artist['name'] in top_n_artist_names:
                            artist_map.append(artist['name'])

            # init matrix
            feature_matrix = [[0 for i in range(len(artist_map))] for i in range(len(artist_map))]
            for track in tracks:
                if len(track['artists']) > 1 and all([a['name'] in top_n_artist_names for a in track['artists']]):
                    main_artist = track['artists'][0]
                    for feature in track['artists'][1:]:
                        feature_matrix[artist_map.index(main_artist['name'])][artist_map.index(feature['name'])] += 1
                        feature_matrix[artist_map.index(feature['name'])][artist_map.index(main_artist['name'])] += 1
        
        else:
            # names of artists who are doing features
            artist_map = []
            for track in tracks:
                if len(track['artists']) > 1:
                    for artist in track['artists']:
                        # update artist map
                        if artist['name'] not in artist_map:
                            artist_map.append(artist['name'])

            # init matrix
            feature_matrix = [[0 for i in range(len(artist_map))] for i in range(len(artist_map))]
            for track in tracks:
                if len(track['artists']) > 1:
                    main_artist = track['artists'][0]
                    for feature in track['artists'][1:]:
                        feature_matrix[artist_map.index(main_artist['name'])][artist_map.index(feature['name'])] += 1
                        feature_matrix[artist_map.index(feature['name'])][artist_map.index(main_artist['name'])] += 1

        return feature_matrix, artist_map

    def song_calendar(self, playlist_tracks: list[dict], user_additions_only: bool = True) -> list[dict]:
        """
        Take a list of playlist tracks that contain a "date-added" field
        and convert them into a data structure capable of plotting with
        the Nivo calendar chart.
        
        Analysis should only be done on tracks owned by the user.. otherwise
        the data can be pretty skewed.
        
        Must convert all dates to YYYY-MM-DD format, then group based on that.
        """
        # filter if necessary
        if user_additions_only:
            playlist_tracks = filter(lambda t: t['added_by']['id'] == self.profile['id'], playlist_tracks)
            
        # convert all dates to YYYY-MM-DD format
        # and populate dictionary
        calendar_data = {}
        for track in playlist_tracks:
            d = parser.parse(track['added_at'])
            d_formatted = d.strftime("%Y-%m-%d")
            if d_formatted in calendar_data:
                calendar_data[d_formatted] += 1
            else:
                calendar_data[d_formatted] = 1
        
        # convert dictionary to coordinates
        calendar_coordinates = []
        for date in calendar_data:
            calendar_coordinates.append({
                "value": calendar_data[date],
                "day": date
            })
        
        return calendar_coordinates
    
    def genre_counts(self, artists: list[dict], n: int = None) -> list[tuple]:
        """
        Collect the genres from a lsit of artists,
        gather the genres and return a sorted list of
        tuples with counts for each genre.
        """
        # create dictionary of counts
        genre_counts = {}
        for artist in artists:
            for genre in artist['genres']:
                genre = genre.title()
                if genre not in genre_counts:
                    genre_counts[genre] = 1
                else:
                    genre_counts[genre] += 1
        
        # sort the dictionary into a list of tuples
        genre_counts_sorted = sorted(genre_counts.items(), key=lambda kv: kv[1], reverse=True)
        
        # slice if n was given
        if n:
            return genre_counts_sorted[:n]
        else:
            return genre_counts_sorted
    
    def key_counts(self, analysis: list[dict]) -> dict:
        """
        Create a dictionart of counts for keys both major and minor
        """
        # init a key count object
        key_counts = {
            "C": {
                "Major": 0,
                "Minor": 0
            },
            "C#": {
                "Major": 0,
                "Minor": 0
            },
            "D": {
                "Major": 0,
                "Minor": 0
            },
            "D#": {
                "Major": 0,
                "Minor": 0
            },
            "E": {
                "Major": 0,
                "Minor": 0
            },
            "F": {
                "Major": 0,
                "Minor": 0
            },
            "F#": {
                "Major": 0,
                "Minor": 0
            },
            "G": {
                "Major": 0,
                "Minor": 0
            },
            "G#": {
                "Major": 0,
                "Minor": 0
            },
            "A": {
                "Major": 0,
                "Minor": 0
            },
            "A#": {
                "Major": 0,
                "Minor": 0
            },
            "B": {
                "Major": 0,
                "Minor": 0
            }
        }
        
        # iterate through analysis
        # objects and populate the
        # key_counts object
        for a in analysis:
            # convert from id/ints to strings
            key = key_int_to_str(a['key'])
            mode = mode_int_to_mode(a['mode'])
            if key == "No key" or mode == "No mode":
                # skip this data
                continue
            key_counts[key][mode] += 1
        
        return key_counts

###          ###
# TESTING CODE #
###          ###
if __name__ == "__main__":
    from dotenv import load_dotenv
    import os
    load_dotenv()
    
    app_settings = {
        'client_id': os.getenv('SPOTIFY_CLIENT_ID'),
        'client_secret': os.getenv('SPOTIFY_CLIENT_SECRET'),
        'redirect_uri': os.getenv('SPOTIFY_REDIRECT_URI')
    }
    
    # get all playlists
    az = Analyzer(**app_settings)
    playlists = az.user_playlists(is_author=True)
    
    # get all tracks
    all_tracks = []
    for playlist in playlists:
        tracks = az.playlist_tracks(playlist['id'])
        all_tracks += tracks
    
    # set extract_tracks flag to False to keep playlist data
    all_tracks_cleaned = az._clean_playlist_tracks(all_tracks, extract_tracks=True)
    
    # fetch analysis and count keys
    analysis = az.track_analysis(all_tracks_cleaned)
    key_counts = az.key_counts(analysis)
    
    print(key_counts)
