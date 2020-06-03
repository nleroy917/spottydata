# SpottyData
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Heroku](https://heroku-badge.herokuapp.com/?app=spottydata)
![SpottyData](./static/imgs/spotty_header.png)
This is a website that attempts to push my original [Spotify Playlist Analyzer Python Project](https://github.com/NLeRoy917/spotify-playlist-analyzer) to the web. It lets you choose a playlist, and then analyze many of the musical elements like: Tempo, Duration, Modality, Genres, etc. Powered by Flask and React, it simply interfaces the Spotify API to provide you with the most interesting and clean data.

[Link to current production build](https://spottydata.com)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To Use
To use SpottyData, simply go to the most recent [production build](https://spottydata.com). Click the button that says "Let's Go!". Log into Spotify and then select the playlist you want to analyze! It's that easy!

## Why do I need to log in to analyze my playlists?
The Spotify API requires [OAuth 2.0 authentication](https://oauth.net/articles/authentication/) to get access to user data. This means that I need the user to not only request access, but log-in using their standard credentials to obtain a temporary token for which I can use to read your data. SpottyData, however, **only requests access to read your public and private playlists** - that's it. Specifically, I require the `playlist-read-private` and `playlist-read-collaborative` scopes. You can read more about these [here](https://developer.spotify.com/documentation/general/guides/scopes/). You can revoke SpottyData's access to your playlist data at anytime by [logging in to Spotify](https://support.spotify.com/us/using_spotify/features/revoke-access-from-3rd-party-app/#:~:text=Remove%20access,remove%20and%20click%20REMOVE%20ACCESS.) and removing access altogether.

## Screenshots

TODO

## Development

In the web/ directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Please reach out to me if you'd like access to the necessary development environment variables to contribute!
