from dotenv import load_dotenv
import os
import random

from flask.json import jsonify

load_dotenv()
CLIENT_ID=os.getenv('CLIENT_ID')
CLIENT_SECRET=os.getenv('CLIENT_SECRET')

# import flask
from flask import Flask
from flask import request
from flask import render_template
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

from lib.analysis import Analyzer

# Testing route/main route
@app.route('/')
def api_base():

	return render_template("base.html")

# Testing route/main route
@app.route('/test')
def api_base_test():

	return_string = '''\nroute open for testing\n'''

	return return_string

@app.route('/analysis/profile')
def analyze_profile():
    access_token = request.headers['access_token']
    az = Analyzer(access_token=access_token)
    playlists = az.user_playlists(is_author=False)
    
    # get all tracks
    all_tracks = []
    for playlist in playlists:
        tracks = az.playlist_tracks(playlist['id'])
        all_tracks += tracks
    
    all_tracks_cleaned = az._clean_playlist_tracks(all_tracks)
    collaboration_matrix, artist_map = az.collaboration_matrix(all_tracks_cleaned, n=50)
    
    return jsonify({
		"collaboration_matrix": collaboration_matrix,
  		"artist_map": artist_map
	})

if __name__ == '__main__':
	app.run()
