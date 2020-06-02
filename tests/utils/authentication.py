import sys
sys.path.append("..")
sys.path.append("../..")

import numpy as np
from lib.authorize import *
from lib.playlists import *

def get_access_token():

	spotify_authenticator = Authenticator('../config.ini')
	spotify_authenticator.authorize()

	return spotify_authenticator.tokens['access_token']

def get_playlist():

	spotify_authenticator = Authenticator('../config.ini')
	spotify_authenticator.authorize()
	auth_header = spotify_authenticator.generate_header()

	playlists = get_playlists(spotify_authenticator.username,auth_header)
	playlist = np.random.choice(playlists)

	return playlist['id'],playlist['name']

if __name__ == '__main__':

	print(get_access_token())
	print(get_playlist())