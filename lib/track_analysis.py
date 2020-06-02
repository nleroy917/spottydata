from lib.authorize import *
from lib.playlists import *
import matplotlib.mlab as mlab
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from configparser import SafeConfigParser
import numpy as np
from urllib.parse import urlencode
import time

sns.set(color_codes=True)
sns.set_palette("dark")

def generate_density(array,float=False):

	class Hist:

		def __init__(self):
		    self.counts = []
		    self.bins = []

		def create(self,array):

			# generate the counts and bins
			# note that length(self.bins) = length(self.counts) + 1
			self.counts, self.bins = np.histogram(array)

	class Density:

		def __init__(self):
			self.x = []
			self.y =[]

		def create(self,hist):

			bins = hist.bins.tolist()
			counts = hist.counts.tolist()
			bins_mid = [0]*(len(bins)-1)

			# map bins to new array of n-1 using midpoints
			for i in range(len(bins)-1):
				bins_mid[i] = (bins[i] + bins[i+1])/2

			# add one bin length to end of bins_mid
			bins_mid.append(bins_mid[-1] + (bins_mid[-1]-bins_mid[-2]))

			# add one bin legnth to the begining od bins_mid
			bins_mid = [(bins_mid[0] - (bins_mid[1] - bins_mid[0]))] + bins_mid

			# add zero to begining and end of counts
			counts.append(0)
			counts = [0] + counts

			if(float==False):
				self.x = [int(round(val)) for val in bins_mid]
				self.y = [int(round(val)) for val in counts]
			elif(float==True):
				self.x = [round(val,2) for val in bins_mid]
				self.y = [round(val,2) for val in counts]


	# create histogram object and generate the bins with the data
	hist = Hist()
	hist.create(array)

	density = Density()
	density.create(hist)

	return density

def get_recs(playlist_id,auth_header):

	# get tracks in playlist
	tracks = get_tracks(playlist_id,auth_header)
	
	# extract the track & artist ids
	track_ids = []
	artist_ids = []
	for track in tracks:
		#print(track)
		try:
			track_ids.append(track['id'])
			artist_ids.append(track['artists'][0]['id'])
		except:
			continue

	# concatenate them together and select 5 random ones
	ids = track_ids + artist_ids
	seed_ids = np.random.choice(ids,5)

	seed_artists = []
	seed_tracks = []

	# split into seed tracks and seed artists
	for seed in seed_ids:
		if seed in track_ids:
			seed_tracks.append(seed)
		elif seed in artist_ids:
			seed_artists.append(seed)

	track_query_string = ''
	artist_query_string = ''

	# clean the ids
	cleaned_track_ids = []
	for track_id in seed_tracks:
		if track_id:
			cleaned_track_ids.append(track_id)
	
	if cleaned_track_ids:
		track_query_string = ','.join(cleaned_track_ids)


	cleaned_artist_ids = []
	for artist_id in seed_artists:
		if artist_id:
			cleaned_artist_ids.append(artist_id)
	
	if cleaned_artist_ids:
		artist_query_string = ','.join(cleaned_artist_ids)



	for i in range(100):
		response = requests.get('https://api.spotify.com/v1/recommendations?seed_tracks=' + track_query_string + '&seed_artists=' + artist_query_string,
	                            headers=auth_header)

		if response.status_code == 200:
			rec_tracks = json.loads(response.text)['tracks']
			break
		else:
			print('Error getting recomendations')
			print(response.text)
			time.sleep(3)
			continue

	rec_ids = []
	for track in rec_tracks:
		rec_ids.append(track['id'])

	query_string = ','.join(rec_ids)

	for i in range(100):
		response = requests.get('https://api.spotify.com/v1/tracks?ids=' + query_string,
	                            headers=auth_header)

		if response.status_code == 200:
			rec_tracks_full = json.loads(response.text)['tracks']
			break
		else:
			print('Error getting recomendations')
			print(response.text)
			time.sleep(3)
			continue

	return rec_tracks_full




def get_multi_track_data(track_ids,auth_header):
	#print(track_ids)

	cleaned_ids = []
	for track_id in track_ids:
		if track_id:
			cleaned_ids.append(track_id)

	query_string = ','.join(cleaned_ids)

	start = time.time()
	for i in range(100):
		response = requests.get('https://api.spotify.com/v1/audio-features/?ids=' + query_string,
	                            headers=auth_header)
		if response.status_code == 200:
			return_package = json.loads(response.text)['audio_features']
			break
		else:
			print('Error getting analysis')
			print(response.text)
			time.sleep(3)
			continue
	end = time.time()
	
	#print('Time for analysis request (s):',end-start)
	#print(return_package)

	analysis = return_package

	return analysis

def get_track_data(track_id,auth_header):

	response = requests.get('https://api.spotify.com/v1/audio-features/{}'.format(track_id),
                            headers=auth_header)

	return_package = json.loads(response.text)

	#print(return_package)

	analysis = return_package

	return analysis

def int_to_key(key_int):

	if key_int == 0:
		key = 'C'
	elif key_int == 1:
		key = 'C#'
	elif key_int == 2:
		key = 'D'
	elif key_int == 3:
		key = 'D#'
	elif key_int == 4:
		key = 'E'
	elif key_int == 5:
		key = 'F'
	elif key_int == 6:
		key = 'F#'
	elif key_int == 7:
		key = 'G'
	elif key_int == 8:
		key = 'G#'
	elif key_int == 9:
		key = 'A'
	elif key_int == 10 or key_int == 't':
		key = 'A#'
	elif key_int == 11 or key_int == 'e':
		key = 'B'
	else:
		key = 'no_key'

	return key

def int_to_mode(mode_int):

	if mode_int == 0:
		mode = 'Minor'
	elif mode_int == 1:
		mode = 'Major'
	else:
		mode = 'No Mode'

	return mode

def get_key_data(tracks):

	# Init key object
	key_data = {'minor': {'A':0,
						'A#':0,
						'B':0,
						'C':0,
						'C#':0,
						'D':0,
						'D#':0,
						'E':0,
						'F':0,
						'F#':0,
						'G':0,
						'G#':0},

				'major': {'A':0,
						'A#':0,
						'B':0,
						'C':0,
						'C#':0,
						'D':0,
						'D#':0,
						'E':0,
						'F':0,
						'F#':0,
						'G':0,
						'G#':0}
				}

				
	# Iterate and parse data
	for track in tracks:
		analysis = get_track_data(track['id'],spotify_header)

		# Some songs may not have a ket or mode, so catch key_not_exist error and pass 
		# (this would occur for a track that is a podcast or local file)
		try:
			if analysis['mode'] == 0:
				key_data['minor'][int_to_key(analysis['key'])] += 1
			elif analysis['mode'] == 1:
				key_data['major'][int_to_key(analysis['key'])] += 1
			else:
				continue
		except:
			pass


	# Return JSON Package
	return key_data

def get_feel_data(tracks):

	# Get access token from the headers and generate spotify's required header
	access_token = request.headers['access_token']
	spotify_header = {'Authorization': 'Bearer ' + access_token}

	# Extract the tracks from the playlist
	tracks = get_tracks(playlist_id,spotify_header)

	feel_data = {
				  "acousticness" : 0,
				  "danceability" : 0,
				  "energy" : 0,
				  "instrumentalness" : 0,
				  "liveness" : 0,
				  "speechiness" : 0
				}

	cnt = 0

	for track in tracks:

		# Analyze the track with Spotify
		analysis = get_track_data(track['id'],spotify_header)

		try:
			feel_data['acousticness'] += analysis['acousticness']
			feel_data['danceability'] += analysis['danceability']
			feel_data['energy'] += analysis['energy']
			feel_data['instrumentalness'] += analysis['instrumentalness']
			feel_data['liveness'] += analysis['liveness']
			feel_data['speechiness'] += analysis['speechiness']

		except:
			pass

		cnt += 1


	# Divide the sum by the number of tracks
	for key in feel_data:
		feel_data[key] /= cnt



	return feel_data

def get_genre_data(tracks):

	genre_data = {}

	for track in tracks:

		try:
			# Get track artist
			artist_id = track['artists'][0]['id']

			# Get Artist data + genres
			artist = get_artist(artist_id,spotify_header)

			genres = artist['genres']

			# Append artist genres to the genre dictionary
			for genre in genres:

				# check that the genre exists in the dictionary
				if genre not in genre_data:
					genre_data[genre] = 1
				else:
					genre_data[genre] += 1
		except:
			continue

	#print(genre_data)

	return genre_data

def get_tempo_data(tracks):

	tempo_store = []
	tempo_data = {}

	for track in tracks:

		try:
			#analyze track and store tempo
			analysis = get_track_data(track['id'],spotify_header)
			tempo_store.append(analysis['tempo'])
		except:
			continue


	# create hist object from array of data
	density = generate_density(tempo_store)
	
	# populate payload | dont forget to convert numpy arrays to lists
	tempo_data={'x': density.x,
				'y': density.y}
	
	return tempo_data

if __name__ == '__main__':

	spotify_authenticator = Authenticator('testing/configs/config.ini')
	spotify_authenticator.authorize()
	auth_header = spotify_authenticator.generate_header()

	username = 'NLeRoy917'
	wrapped_2019 = 'https://open.spotify.com/playlist/37i9dQZF1Ethb70Ir9WW6o?si=yrv4GDu6SBeUc8PexoZ_HQ'

	playlist_id = get_playlist_id(wrapped_2019)

	tracks = get_tracks(playlist_id,auth_header)

	for track in tracks:
		analysis = get_track_data(track['id'],auth_header)
		print(track['name'],'|',analysis['loudness'])


