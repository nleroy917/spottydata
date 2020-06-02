import requests
import json

def test(BASE_URL):

	headers = {None}

	r = requests.get(BASE_URL)

	if r.status_code == 200:
		print('\t\t\t\tPASS')
		return True
	else:
		print('\t\t\t\tFAIL')
		return False


if __name__ == '__main__':
	test()

