try: from .analysis import Analyzer
except: from analysis import Analyzer

from dotenv import load_dotenv
import os
import time
load_dotenv()

def run_analysis(all_tracks_cleaned):
    # timer
    START = time.time()
    print(f"-----> Starting.")
    print(f"-----> Total tracks: {len(all_tracks_cleaned)}")

    start = time.time()
    print("\t-----> Gathering artists...", end="")
    # use newly cleaned tracks to gather artist
    # data for each track
    all_artists = az.artists_from_tracks([t['track'] for t in all_tracks_cleaned])
    stop = time.time()
    print(f"\t done. ({round(stop-start,2)}s)")

    start = time.time()
    print("\t-----> Gather raw track analysis data...", end="")
    # use newly cleaned tracks to gather the analysis.
    # since we are keeping playlist meta-data we need
    # to a keep extraction of the track object since the
    # track analysis method requires us to pass in a list
    # of raw track objects
    analysis = az.track_analysis([t['track'] for t in all_tracks_cleaned])
    stop = time.time()
    print(f"\t done. ({round(stop-start,2)}s)")

    start = time.time()
    print("\t-----> Aggregating data...", end="")
    # assign the analysis data to each track
    for i in range(len(all_tracks_cleaned)):
        all_tracks_cleaned[i]['analysis'] = analysis[i]
    stop = time.time()
    print(f"\t done. ({round(stop-start,2)}s)")

    start = time.time()
    print("\t-----> Analyzing all tracks...", end="")
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
    print(f"\t done. ({round(stop-start,2)}s)")

    # timer
    STOP = time.time()
            
    print(f"\t-----> Done.")
    print(f"\t-----> Execution time: {round(STOP-START, 2)} sec")


if __name__ == "__main__":
    app_settings = {
        'client_id': os.getenv('SPOTIFY_CLIENT_ID'),
        'client_secret': os.getenv('SPOTIFY_CLIENT_SECRET'),
        'redirect_uri': os.getenv('SPOTIFY_REDIRECT_URI')
    }

    # init analyzer
    az = Analyzer(**app_settings)

    # get tracks and simulate lengths
    # get all playlists
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
    print(f"done. ({round(stop-start,2)}s)")

    start = time.time()
    print("-----> Cleaning tracks...", end="")
    # set extract_tracks flag to False to keep playlist data
    all_tracks_cleaned = az._clean_playlist_tracks(all_tracks, extract_tracks=False)
    stop = time.time()
    print(f"done. ({round(stop-start,2)}s)")

    # simulate large track list
    print(f"-----> Simulating track totals")
    TRACK_LISTS = [
        all_tracks_cleaned[:10], # 10 tracks
        all_tracks_cleaned[:50], # 50 tracks
        all_tracks_cleaned[:100], # 100 tracks
        all_tracks_cleaned[:500], # 500 tracks
        all_tracks_cleaned, # ~900 tracks
        all_tracks_cleaned*2, # ~1800 tracks
        all_tracks_cleaned*3, # ~2700 tracks
        all_tracks_cleaned*4 # ~3600 tracks
    ]

    for track_list in TRACK_LISTS:
        run_analysis(track_list)