from lib.authorize import *
from configparser import SafeConfigParser
import time

def get_playlist_id(share_url):

    id = share_url[share_url.find('playlist/') + len('playlist/'):share_url.find('?')]

    return id

def get_playlists(user,auth_header):

    for i in range(100):
        response = requests.get('https://api.spotify.com/v1/users/{}/playlists?limit=50'.format(user),
                                headers=auth_header)
        if response.status_code == 200:
            # print(response.text)
            return_package = json.loads(response.text)
            break
        else:
            time.sleep(5) # sleep for 5 seconds
            print(response.text)
            continue


    playlists = return_package['items']

    return playlists

def add_to_playlist(playlist_id,track_uris,auth_header):

    auth_header['Content-Type'] = 'application/json'

    body = {'uris':track_uris
            }

    #print(body)
    #print(json.dumps(body))

    response = requests.post('https://api.spotify.com/v1/playlists/{}/tracks'.format(playlist_id),
                             data=json.dumps(body),
                             headers=auth_header)



    return True

def get_tracks(playlist_id,auth_header):

    for i in range(100):
        response = requests.get('https://api.spotify.com/v1/playlists/{}/tracks'.format(playlist_id),
                                headers=auth_header)
        if response.status_code == 200:
            tracks = json.loads(response.text)
            break
        else:
            print('error getting tracks')
            print(response.text)
            time.sleep(3)
            continue

    parsed_playlist = tracks['items']
    

    # print(len(parsed_playlist))
    return parsed_playlist

def get_artists(artist_ids,auth_header):

    cleaned_ids = []
    for artist_id in artist_ids:
        if artist_id:
            cleaned_ids.append(artist_id)

    # Get first half
    if len(cleaned_ids) > 50:
        query_string_1 = ','.join(cleaned_ids[:50])
        query_string_2 = ','.join(cleaned_ids[50:])

        for i in range(100):
            response = requests.get('https://api.spotify.com/v1/artists/?ids='+query_string_1,
                                    headers=auth_header)

            if response.status_code == 200:
                artists1 = json.loads(response.text)
                break
            else:
                print('error getting artists')
                print(response.text)
                time.sleep(3)
                continue

        for i in range(100):
            response = requests.get('https://api.spotify.com/v1/artists/?ids='+query_string_2,
                                    headers=auth_header)

            if response.status_code == 200:
                artists2 = json.loads(response.text)
                break
            else:
                print('error getting artists')
                print(response.text)
                time.sleep(3)
                continue

        return artists1['artists'] + artists2['artists']

    else:
        query_string = ','.join(cleaned_ids)
        print('https://api.spotify.com/v1/artists/?ids='+query_string)

        for i in range(100):
            response = requests.get('https://api.spotify.com/v1/artists/?ids='+query_string,
                                    headers=auth_header)

            if response.status_code == 200:
                artists = json.loads(response.text)
                print(artists)
                break
            else:
                print('error getting artists')
                print(response.text)
                time.sleep(3)
                continue

        return artists['artists']






def get_artist(artist_id,auth_header):

    response = requests.get('https://api.spotify.com/v1/artists/{}'.format(artist_id),
                            headers=auth_header)

    artist = json.loads(response.text)

    return artist

if __name__ == '__main__':

        playlist_URI = 'spotify:playlist:7iGY7WPiTvvSTr6ZgO3rR2'
        playlist_share_link = 'https://open.spotify.com/playlist/7iGY7WPiTvvSTr6ZgO3rR2?si=iDvebMC4Q8Kderz6HyegOA'
        track_URIs = ['spotify:track:6fTt0CH2t0mdeB2N9XFG5r']
        print(track_URIs)
        spotify_authenticator = Authenticator('configs/config.ini')
        spotify_authenticator.authorize()
        auth_header = spotify_authenticator.generate_header()

        playlist_id = get_playlist_id(playlist_share_link)

        add_to_playlist(playlist_id,track_URIs,auth_header)

        tracks = get_tracks(playlist_id,auth_header)

        for track in tracks:
            print(track['name'],'|',track)
