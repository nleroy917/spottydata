import numpy as np
import sys
sys.path.append("..")

from routes import base
from routes import playlist_analysis_keys
from routes import playlist_analysis_feel
from routes import playlist_analysis_genre
from routes import playlist_analysis_tempo
from lib.authorize import *
from lib.playlists import *

# BASE_URL = 'https://spottydata-api.herokuapp.com/'
BASE_URL = 'http://127.0.0.1:5000/'

def get_access_token():

	spotify_authenticator = Authenticator('config.ini')
	spotify_authenticator.authorize()

	return spotify_authenticator.tokens['access_token']

def get_playlist():

	spotify_authenticator = Authenticator('config.ini')
	spotify_authenticator.authorize()
	auth_header = spotify_authenticator.generate_header()

	playlists = get_playlists(spotify_authenticator.username,auth_header)
	playlist = np.random.choice(playlists)

	return playlist['id'],playlist['name']


if __name__ == '__main__':

	ACCESS_TOKEN = get_access_token()
	PLAYLIST_ID, PLAYLIST_NAME = get_playlist()

	print('Running Tests on {}:'.format(PLAYLIST_NAME))
	print('-='*40)

	num_tests = 9
	cnt = 1

	# Test main route
	print('Test ({}/{}) | /'.format(cnt,num_tests),end='')
	data = base.test(BASE_URL)
	cnt += 1

	# Test key data generation
	print('Test ({}/{}) | <playlist_id>/analysis/keys'.format(cnt,num_tests),end='')
	data = playlist_analysis_keys.test(BASE_URL,ACCESS_TOKEN,PLAYLIST_ID)
	#print(data)
	cnt += 1

	# Test feel data generation
	print('Test ({}/{}) | <playlist_id>/analysis/feel'.format(cnt,num_tests),end='')
	data = playlist_analysis_feel.test(BASE_URL,ACCESS_TOKEN,PLAYLIST_ID)
	# print(data)
	cnt += 1

	# Test genre data generation
	print('Test ({}/{}) | <playlist_id>/analysis/genre'.format(cnt,num_tests),end='')
	data = playlist_analysis_genre.test(BASE_URL,ACCESS_TOKEN,PLAYLIST_ID)
	# print(data)
	cnt += 1

	# Test tempo data generation
	print('Test ({}/{}) | <playlist_id>/analysis/tempo'.format(cnt,num_tests),end='')
	data = playlist_analysis_tempo.test(BASE_URL,ACCESS_TOKEN,PLAYLIST_ID)
	# print(data)
	cnt += 1

	

