# SpottyData.com
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Heroku](https://heroku-badge.herokuapp.com/?app=spottydata)
---
This is a React site that attempts to push my original [Spotify Playlist Analyzer Python Project](https://github.com/NLeRoy917/spotify-playlist-analyzer) to the web. The original project anaylzed your Spotify playlists and produced nice data visualizations. This project has since been made into a small API with Flask which can be found [here](https://github.com/NLeRoy917/playlist-analyzer-api). This repository houses the Front-End for the website - built with React. 

[Link to current production build](https://spottydata.com)

## Playlist Analysis
Currently, the site is capable of running the following analysis':
1. Loudness Analysis
  Your playlist will be parsed for an analysis on the loudness each song. This data is plotted as a simple distribution
  
2. Key Analysis
  The key of each song in a playlist will be extracted, and a bar graph is made to show which keys the user listens to the most/least
  
3. Tempo Analysis
  The tempo of each song is extracted and then also plotted as a distribution in a similar mannerto the loudness data.
  
4. Modality Analysis
  For each song in the playlist, a simple two-bar bar chart is dispalyed. It indicates the frequency of songs in the playlist that exhibit a Major key, and those that exhibit a Minor Key
  


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## For development

In the web/ directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Please reach out to me if you'd like access to the necessary development environment variables to contribute!
