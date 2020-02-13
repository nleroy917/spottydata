# SpottyData.com
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Heroku](https://heroku-badge.herokuapp.com/?app=spottydata)
---
This is a React site that attempts to push my original [Spotify Playlist Analyzer Python Project](https://github.com/NLeRoy917/spotify-playlist-analyzer) to the web. The original project anaylzed your Spotify playlists and produced nice data visualizations. This project has since been made into a small API with Flask which can be found [here](https://github.com/NLeRoy917/playlist-analyzer-api). This repository houses the Front-End for the website - built with React. 

{Link to site will go here}

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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
