from dotenv import load_dotenv
import os
import random

load_dotenv()
CLIENT_ID=os.getenv('CLIENT_ID')
CLIENT_SECRET=os.getenv('CLIENT_SECRET')
GENIUS_API_SECRET=os.getenv('GENIUS_ACCESS_TOKEN')

# Import spotify interface + utils libraries
from lib.Spotify import Spotify
from lib.Utils import Utils
utils = Utils()

from lib.lyrics import *

# import flask
from flask import Flask
from flask import jsonify
from flask import request
from flask import render_template
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

#import other necessary modules
import json
from dateutil import parser

# Testing route/main route
@app.route('/')
def api_base():

	return render_template("base.html")

# Testing route/main route
@app.route('/test')
def api_base_test():

	return_string = '''\nroute open for testing\n'''

	return return_string

# Get playlists for a specific user
@app.route('/<username>/playlists', methods=['GET'])
def playlists_get(username):

	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	playlists = spotify.get_playlists()
	playlists_filtered = []
	for playlist in playlists['items']:
		if playlist['tracks']['total'] == 0:
			continue
		else:
			playlists_filtered.append(playlist)
	del spotify

	return jsonify(playlists_filtered)

# testing route to load test the API for getting tracks
@app.route('/playlists/<playlist_id>/tracks', methods=['GET'])
def tracks_get(playlist_id):
	
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	tracks = spotify._get_playlist_tracks(playlist_id)['items']
	del spotify

	return jsonify(tracks)

@app.route('/<playlist_id>', methods=['GET'])
def playlist_get(playlist_id):
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
    
	playlist = spotify.get_playlist(playlist_id)
	return jsonify(playlist)


@app.route('/<playlist_id>/analysis/lyrics', methods=['GET'])
def lyrics_analysis(playlist_id):

	# Get access token from the headers and generate spotify's required header
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	tracks = spotify._get_playlist_tracks(playlist_id)['items']
	del spotify
 
	tracks = [x['track'] for x in tracks]

	cnt = 0

	# select random sample of songs 
	max_songs=20
	tracks = random.sample(tracks,k=min(max_songs, len(tracks)))

	lyrics_count = {}

	for track in tracks:
		if cnt >= max_songs:
			break
		#print('Track {}/{}'.format(cnt,len(tracks)))
		lyrics = get_lyrics(track)
		if not lyrics:
			continue
		words = parse_lyrics(lyrics)

		for word in words:
			#word = word.capitalize()
			if word in lyrics_count:
				lyrics_count[word] += 1
			else:
				lyrics_count[word] = 1


		cnt += 1
	
	lyrics_count_sorted = {k: v for k, v in sorted(lyrics_count.items(), key=lambda item: item[1], reverse=True)}
	
	# format payload for React library usage
	lyrics_analysis = []
	for key in lyrics_count_sorted:
		lyrics_analysis.append({'text':key,'value':lyrics_count_sorted[key]})

	return jsonify(lyrics_analysis[0:200])

@app.route('/<playlist_id>/recommendations', methods=['GET'])
def playlist_recs(playlist_id):

	# Get access token from the headers and generate spotify's required header
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	recs = spotify.get_recommendations()
	del spotify

	return jsonify(recs)


@app.route('/<playlist_id>/analysis', methods=['GET'])
def full_analysis(playlist_id):

	# Get access token from the headers and init Spotify objectg
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)

	tracks, analysis_list, artist_list, last_update_iso = spotify.get_playlist_items(playlist_id)
	
	# get most recently added date
	last_update = parser.isoparse(last_update_iso)

	key_data, feel_data, genre_data, tempo_data, duration_data = utils.analyze_playlist(analysis_list,tracks,artist_list)

 
	payload = {}
	payload['keys'] = key_data
	payload['feel'] = feel_data
	payload['genres'] = genre_data
	payload['tempo'] = tempo_data
	payload['duration'] = duration_data
	payload['last_update'] = last_update
 
	del spotify

	return jsonify(payload)


if __name__ == '__main__':
	app.run()
