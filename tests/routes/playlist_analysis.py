import requests
import json
import sys
sys.path.append("..")

from utils.authentication import *

import termplotlib as tpl

def test(BASE_URL,access_token,playlist_id):

	headers = {'access_token': access_token}

	r = requests.get(BASE_URL + playlist_id + '/analysis',headers=headers)

	if r.status_code == 200:
		print('\tPASS')
		#print(r.json)
		return json.loads(r.text)
	else:
		print('\tFAIL',end='')
		print(' | error: {}, {}'.format(r.status_code,r.text))
		return False


if __name__ == '__main__':

	#BASE_URL = 'https://spottydata-api.herokuapp.com/'
	BASE_URL = 'http://127.0.0.1:5000/'

	access_token = get_access_token()
	playlist_id, playlist_name = get_playlist()

	print('Testing {}'.format(playlist_name))

	data = test(BASE_URL,access_token,playlist_id)
	print(data)

	fig = tpl.figure()
	fig.plot(data['tempo']['x'], data['tempo']['y'], width=60, height=20)
	fig.show()

