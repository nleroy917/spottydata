import os
import urllib.parse
import webbrowser
import requests
import base64
import json
import time
import platform
from configparser import SafeConfigParser
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.firefox.options import Options

class Authenticator():
    """
    The authenticator object acts as the data strcuture that orchestrates the authentication flow for the spotify API, and
    it stores all of the necessary attributes and methods necessary for making authorized requests. Typical use of the
    authenticator object is shown below in __main__:
        1. Create an instance of Authenticator
        2. Authorize for the user
        3. Generate the header
        spotify_authenticator = Authenticator('config.ini')
        spotify_authenticator.authorize()
        auth_header = spotify_authenticator.generate_header()
        
    When creating an instance of the authenticator objet, a config file path must be passed into it. This config file stores
    all of the important data for authorization and making authorized requests such as:
        - Username
        - Password
        - Client ID
        - Client Secret
        - Access Token
        - Referesh Token
        - Last token access time
    A config file is used so that the initial authorization process only has to be completed once, and then it can access and
    check for previous authentications - to speed up workflow. Note that the config file houses some very sensitive
    information. The contents of the config file should never be made public. I choose to store mine in a sub-directory
    caled configs/ and then place configs/ inside of .gitignore.
    ----
    Attributes
    ----
    ----
    Methods
    ----
    """

    def __init__(self,config_file):

        # Intialize config file object and read its contents
        config = SafeConfigParser()
        config.read(config_file)

        # Extract the sensitive information
        client_id = config.get('credentials','client_id')
        client_secret = config.get('credentials','client_secret')
        redirect_uri = config.get('credentials','redirect_uri')
        username = config.get('credentials','username')
        password = config.get('credentials','password')

        # Assign appropriate data to object attributes
        self.config = config # store config fle object
        self.username = username
        self.password = password
        self.client_secret = client_secret
        self.client_id = client_id
        self.redirect_uri = redirect_uri
        self.scope = 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private'
        self.state = ''
        self.show_dialog = ''
        self.auth_code = ''
        self.tokens = {}
        self.config_file = config_file

    def get_auth_code(self,headless='True'):
        """
        The first step in the authorization code flow is to direct the user to the authorization page
        and submit the appropriate parameters: Client ID, Redirect URI, Response Type, Scope.
        The only way to achieve this is through a front-end browser. Thus, selenium is used to drive a
        browser automatically. This can be done headless or non-headless (with or without an actual browser opening up)
        The parameters/payload are encoded with urllib and appended to the authorization url.
        Then, selenium opens a browser, submits the users credentials, and accepts the apps use and access to
        the user's data automatically.
        https://localhost:8000 is used as the redirect once the app is authorized by the user. This raises an exception
        since the site cannot be reached. The exception is caught, and the authorization code is extracted from the
        URL and returned.
        """

        #os.system('cls')

        # Define base url for authorization site and define response type
        auth_url_base = 'https://accounts.spotify.com/authorize?'
        response_type = 'code'

        # Create payload basd on data from config file extracted during __init__
        payload = {'client_id': self.client_id,
                   'redirect_uri': self.redirect_uri,
                   'response_type': response_type,
                   'scope': self.scope}

        # Encode the payload for a url and apped to the base url
        url_params = urllib.parse.urlencode(payload)
        full_auth_url = auth_url_base + url_params
        print('Custom authorization url:',full_auth_url,'\n')

        print('Directing to Spotify Authorization page...\n')

        # Create selenium options
        options = Options()
        options.headless = True

        # Determine OS
        os_name = platform.system()
        #print(os_name)
        # Choose driver file
        if os_name == 'Windows':
            executable = './gecko/geckodriver.exe'
        elif os_name == 'Linux':
            executable = './gecko/geckodriver'
        elif os_name == 'Darwin':
            executable = './gecko/geckodriver'
        else:
            print('Unknown operating system detected... Spotipaws is only supported on Windows and Linux distrobutions!\n')
            sys.exit(1)

        if headless == 'True':
            driver = webdriver.Firefox(options=options, executable_path=executable)
        else:
            driver = webdriver.Firefox(executable_path=executable)

        # Open browser
        driver.get(full_auth_url)

        # Find html form fields
        login_field = driver.find_element_by_id('login-username')
        pass_field = driver.find_element_by_id('login-password')
        sub_button = driver.find_element_by_id('login-button')

        print('Submitting user login data...\n')

        # Pass user data to form
        login_field.send_keys(self.username)
        pass_field.send_keys(self.password)

        # Selenium raises an error when you can't cneect to a domain
        # Catch that error to handle it and extract the URL for the access token.
        try:
            # Submit the form
            sub_button.click()

            # pause for redirect to acceptance page
            time.sleep(3)

            # Find agree button
            agree_button = driver.find_element_by_id('auth-accept')
            print('Button Found')
            #time.sleep(5)

            # Click button and wait for error
            agree_button.click()
            print('Button Clicked')
            time.sleep(5)

        except Exception as err:
            # Catch error and do nothing to keep code going
            print('Error caught')
            print('Redirect successful...\n')
            print('Extracting authorization code now...\n')

        time.sleep(5)

        # Get current url which now contains the access token 
        redirect = driver.current_url
        driver.close()

        print('Redirect-URI:',redirect)

        parsed = urllib.parse.urlparse(redirect)
        return_package = urllib.parse.parse_qs(parsed.query)

        # Return the query from the rediret url
        return return_package['code'][0]



    def get_tokens(self,grant_type='authorization_code'):
        """
        The second step of the authorization flow is to take the authorization code recieved from the browser
        and then use it to get the access token and refresh token. This is done by directly making a request to
        Spotify's API through a post request and then parsing the response recieved.
        """

        # Check for lack of appropriate parameters
        if not self.auth_code:
            print('No authorization code provided!')
            sys.exit(1)
        elif not self.redirect_uri:
            print('Please put a redirect URI in the config file')
            sys.exit(1)
        elif not self.client_id:
            print('No client id provided!')
            sys.exit(1)
        elif not self.client_secret:
            print('No client secret provided!')
            sys.exit(1)


        # Generate body for request to get access token
        body = {'grant_type':grant_type,
                'code':self.auth_code,
                'redirect_uri':self.redirect_uri}

        # Format client id and secret for request header + encode them
        client_params = self.client_id + ':' + self.client_secret
        encoded_client_params = base64.b64encode(client_params.encode('ascii'))

        print('\nLoading Client Secret, Client ID, and Authorization Pay Load...')

        # Create header with encoded client id and secret
        headers = {'Authorization': 'Basic ' + encoded_client_params.decode('ascii')}

        print('\nRequesting Access and Refresh Tokens...')

        # Submit post request to get the access tokens
        response = requests.post('https://accounts.spotify.com/api/token',data=body,headers=headers)

        tokens = response.text

        print('\nParsing and extracting tokens...')
        return json.loads(tokens)


    def token_refresh(self,grant_type='refresh_token'):

        config = self.config

        body = {'grant_type':grant_type,
                'refresh_token':config.get('tokens','refresh_token')}

        client_params = self.client_id + ':' + self.client_secret
        encoded_client_params = base64.b64encode(client_params.encode('ascii'))
        headers = {'Authorization': 'Basic ' + encoded_client_params.decode('ascii')}

        response = requests.post('https://accounts.spotify.com/api/token',data=body,headers=headers)

        tokens = response.text
        tokens_parsed = json.loads(tokens)
        config.set('tokens','access_token',tokens_parsed['access_token'])
        with open(self.config_file, 'w') as configfile:
                config.write(configfile)

        return True

    def authorize(self):
        print('\nAttempting to authorize...\n')
        config = self.config
        authorized = config.get('tokens','authorized?')

        if authorized.lower() == 'false':
            print('\nRunning fresh authorization protocol...')
            self.auth_code = self.get_auth_code(headless='True')
            tokens = self.get_tokens()
            self.tokens = tokens
            config.set('tokens', 'access_token', self.tokens['access_token'])
            config.set('tokens', 'refresh_token', self.tokens['refresh_token'])
            config.set('tokens', 'last_refresh_time', str(time.time()))
            config.set('tokens', 'authorized?', 'true')
            with open(self.config_file, 'w') as configfile:
                    config.write(configfile)
        else:
            # Check time since last refresh
            current_time = int(time.time())
            last_refresh_time = float(config.get('tokens','last_refresh_time'))
            delt = current_time - last_refresh_time

            if delt >= 3000:
                print('\nRefreshing access token...')
                self.token_refresh()
                self.tokens['access_token'] = config.get('tokens','access_token')
                config.set('tokens','last_refresh_time',str(time.time()))
                with open(self.config_file, 'w') as configfile:
                        config.write(configfile)
            else:
                print('\nNo authorization needed...')
                self.tokens['access_token'] = config.get('tokens','access_token')
                self.tokens['refresh_token'] = config.get('tokens','refresh_token')
                pass

        return True


    def generate_header(self):

        header = {'Authorization': 'Bearer ' + self.tokens['access_token']}

        return header


if __name__ == '__main__':

    playlist_URI = 'spotify:playlist:7iGY7WPiTvvSTr6ZgO3rR2'
    playlist_share_link = 'https://open.spotify.com/playlist/7iGY7WPiTvvSTr6ZgO3rR2?si=iDvebMC4Q8Kderz6HyegOA'

    spotify_authenticator = Authenticator('config.ini')
    spotify_authenticator.authorize()
    auth_header = spotify_authenticator.generate_header()

    response = requests.get('https://api.spotify.com/v1/users/{}/playlists'.format(username),
                            headers=auth_header)

    playlists = json.loads(response.text)

    for item in playlists['items']:

        if item['owner']['display_name'].lower() == username.lower():
            print(item['name'])
            for thing in item:
                print('\t',thing,item[thing])
            print()
            print()
