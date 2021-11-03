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
    
    def _filter_items(self, items: list) -> list:
        """Filter out None objects from a list"""
        return [i for i in items if i is not None]
    
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
        track_ids = self._filter_items([t['id'] for t in tracks])
        
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
    
    def tempo_statistics(self, analysis: list[dict]) -> dict:
        """
        Gather descriptive statistics on
        """
        pass
    
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

    def playlist_features(self, tracks: list[dict]) -> list[dict]:
        """
        This is a method meant to extract data for the Nivo
        swarm plot. The data structure isn't identical to the 
        one required for the plot, but allows dynamic manipulation
        on the front-end for interesting visuals.
        
        :param: - tracks - a list of playlist track objects that
                           contain the playlist meta-data and the
                           track's analysis object. Right now the
                           aggregation of this data is done manually
                           but a function could be made in the future
                           to facilitate this.
        """
        feature_data = {}
        for track in tracks:
            if track['playlist']['name'] not in feature_data:
                # if playlist hasn't been accounted for, start a new 
                # list of featurew data one and append the track meta
                # data
                feature_data[track['playlist']['name']] = [{
                    "acousticness": track['analysis']['acousticness'],
                    "danceability": track['analysis']['danceability'],
                    "energy": track['analysis']['energy'],
                    "instrumentalness": track['analysis']['instrumentalness'],
                    "liveness": track['analysis']['liveness'],
                    "loudness": track['analysis']['loudness'],
                    "speechiness": track['analysis']['speechiness'],
                    "tempo": track['analysis']['tempo'],
                    "valence": track['analysis']['valence'],
                    "track": track['track'],
                    "playlist": track['playlist']
                }]
            # otherwise we are already creating a list of datapoints
            # for a certain playlist so just append to it
            else:
                feature_data[track['playlist']['name']].append({
                    "acousticness": track['analysis']['acousticness'],
                    "danceability": track['analysis']['danceability'],
                    "energy": track['analysis']['energy'],
                    "instrumentalness": track['analysis']['instrumentalness'],
                    "liveness": track['analysis']['liveness'],
                    "loudness": track['analysis']['loudness'],
                    "speechiness": track['analysis']['speechiness'],
                    "tempo": track['analysis']['tempo'],
                    "valence": track['analysis']['valence'],
                    "track": track['track'],
                    "playlist": track['playlist']
                })
        
        return feature_data
        
        
###          ###
# TESTING CODE #
###          ###
if __name__ == "__main__":
    from dotenv import load_dotenv
    import os
    import time
    import psutil
    import sys
    import json
    load_dotenv()
    
    app_settings = {
        'client_id': os.getenv('SPOTIFY_CLIENT_ID'),
        'client_secret': os.getenv('SPOTIFY_CLIENT_SECRET'),
        'redirect_uri': os.getenv('SPOTIFY_REDIRECT_URI')
    }
    
    # timer
    START = time.time()
    print(f"-----> Starting.")
    
    # get all playlists
    az = Analyzer(**app_settings)
    playlists = az.user_playlists(is_author=True)
    
    start = time.time()
    print("-----> Gathering all tracks...", end="")
    # get all tracks
    all_tracks = []
    for playlist in playlists:
        tracks = az.playlist_tracks(playlist['id'])
        # append the playlist meta data
        # to the track objects
        for i in range(len(tracks)):
            tracks[i]['playlist'] = playlist
        all_tracks += tracks
    stop = time.time()
    print(f" done. ({round(stop-start,2)}s)")
    
    start = time.time()
    print("-----> Cleaning tracks...", end="")
    # set extract_tracks flag to False to keep playlist data
    all_tracks_cleaned = az._clean_playlist_tracks(all_tracks, extract_tracks=False)
    stop = time.time()
    print(f" done. ({round(stop-start,2)}s)")
    
    # simulate large track list
    print(f"-----> Num tracks (pre-sim): {len(all_tracks_cleaned)}")
    all_tracks_cleaned += all_tracks_cleaned
    all_tracks_cleaned += all_tracks_cleaned
    all_tracks_cleaned += all_tracks_cleaned
    print(f"-----> Num tracks (post-sim): {len(all_tracks_cleaned)}")

    start = time.time()
    print("-----> Gathering artists...", end="")
    # use newly cleaned tracks to gather artist
    # data for each track
    all_artists = az.artists_from_tracks([t['track'] for t in all_tracks_cleaned])
    stop = time.time()
    print(f" done. ({round(stop-start,2)}s)")
    
    start = time.time()
    print("-----> Gather raw track analysis data...", end="")
    # use newly cleaned tracks to gather the analysis.
    # since we are keeping playlist meta-data we need
    # to a keep extraction of the track object since the
    # track analysis method requires us to pass in a list
    # of raw track objects
    analysis = az.track_analysis([t['track'] for t in all_tracks_cleaned])
    stop = time.time()
    print(f" done. ({round(stop-start,2)}s)")
    
    start = time.time()
    print("-----> Aggregating data...", end="")
    # assign the analysis data to each track
    for i in range(len(all_tracks_cleaned)):
        all_tracks_cleaned[i]['analysis'] = analysis[i]
    stop = time.time()
    print(f" done. ({round(stop-start,2)}s)")
    
    start = time.time()
    print("-----> Analyzing all tracks...", end="")
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
    stop = time.time()
    print(f" done. ({round(stop-start,2)}s)")
    
    # timer
    STOP = time.time()
    MEM_FOOTPRINT = psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2
    RES_SIZE = sys.getsizeof(json.dumps({
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
	})) * 1e-6
          
    print(f"-----> Done.")
    print(f"-----> Execution time: {round(STOP-START, 2)} sec")
    print(f"-----> Memory footprint: {round(MEM_FOOTPRINT,2)} mb")
    print(f"-----> Response size: {round(RES_SIZE,2)} mb")
    
    

