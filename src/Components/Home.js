import React, {useState, useEffect} from 'react';
import './Home.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
const querystring = require('querystring');
const base_url =  'https://accounts.spotify.com/authorize?'
const payload = {
	client_id: '0ca7dd0007fd4ff2a34c3aab07379970',
	response_type: 'code',
	scope: 'playlist-read-private playlist-read-collaborative user-top-read',
	redirect_uri: 'http://localhost:3000/playlists',
	show_dialog: true
}

const authorize_url = base_url + querystring.stringify(payload)

const authorize = () => {
	console.log(this.username)
}

const Home = () => {

const [username, setUsername] = useState(null);

return(
<header class="masthead home-background">
  <div class="container h-100">
    <div class="row h-100 align-items-center">
      <div class="col-12 text-center">
        <h1 class="font-weight-bold">Welcome to SpottyData</h1>
        <br></br>
        <p class="lead">This site will analyze the songs in your Spotify playlists and display the data to you</p>
  		<a class="btn btn-dark" href={authorize_url}>Let's Go</a>

      </div>
    </div>
  </div>
</header>
)
}


export default Home