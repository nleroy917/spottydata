import os
import sys
sys.path.append('..')


from dotenv import load_dotenv
load_dotenv()

import time
import string
import requests

LYRICS_API = 'https://api.lyrics.ovh/v1/'
WEAK_WORDS = [
	'you',
	'me',
	'i',
	'the',
	'that',
	'to',
	'it',
	'a',
	'for',
	'so',
	'and',
	'in',
	'some',
	'with',
	'this',
	'of',
	'on',
	'but',
	'do',
	'at',
]

def get_lyrics(track):

	response = requests.get(LYRICS_API + track['artists'][0]['name'] + '/' + track['name'])

	if response.status_code == 200:
		data = response.json()
		
		return data['lyrics']

	return None

def parse_lyrics(lyrics):
	#print(lyrics)
	try:
		lines = lyrics.split('\n')
	except:
		return []

	translator = str.maketrans('', '', string.punctuation)
	words_list = []

	for line in lines:
		if '[' in line or ']' in line: # skip song section labels
			continue
		#print(line)
		cleaned_line = line.translate(translator)
		#print(cleaned_line)
		#time.sleep(0.5)

		words = cleaned_line.split(' ')
		for word in words:
			if word.lower() in WEAK_WORDS:
				continue
			if word == '':
				continue
			if 'u\2005' in word:
				continue
			if '\r' in word:
				word.replace('\r', '')
				
			words_list.append(word)

	return words_list