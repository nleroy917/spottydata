import React, { useEffect, useState } from 'react';
import './Playlists.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Playlist from './Playlist'

const axios = require('axios').default;
const querystring = require('querystring');

class Playlists extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
      		authCode: null,
      		accessToken: null,
      		client_id: '0ca7dd0007fd4ff2a34c3aab07379970',
      		client_secret: '7e9f4b39a1a84edfa78014e53d6a664d',
      		user: null,
      		playlists: null

    		};
  		}

  		componentWillMount() {
  			localStorage.setItem('authCode',querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code)
  			this.setState({authCode: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code},() => {this.fetchAccessToken()})
  			console.log(this.state.authCode)

  		}

		fetchAccessToken = async () => {
			//console.log('Basic ' + btoa(this.state.client_id + ':' + this.state.client_secret))
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + btoa(this.state.client_id + ':' + this.state.client_secret)
			}

			const body = {
				grant_type: 'authorization_code',
				code: this.state.authCode,
				redirect_uri: 'http://localhost:3000/playlists'
			}

			const response = await axios.post('https://accounts.spotify.com/api/token',querystring.stringify(body),{headers: headers})

			if(response.status === 200) {
				console.log(response)
				const data = await response.data
				this.setState({accessToken: data.access_token})
				this.fetchName()
				this.fetchPlaylists()
			}
		}

		fetchName = async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.state.accessToken
			}

			const response = await axios.get('https://api.spotify.com/v1/me',{headers})
			if(response.status === 200) {
		    	console.log(response);
		    	const data = await response.data
		    	this.setState({user: data.display_name})
			}

		}

		fetchPlaylists = async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.state.accessToken
			}

			const response = await axios.get('https://api.spotify.com/v1/me/playlists',{headers})
			if(response.status === 200) {
		    	console.log(response);
		    	const data = await response.data
		    	this.setState({playlists: data.items})
		}
	}

		render() {
		return(
		  <div class="container h-100">
		    <div class="row h-100 align-items-center">
		      <div class="col-8">
		        <h2 class="font-weight-bold playlists-heading welcome-heading">Welcome {this.state.user}! Please select a playlist to analyze.</h2>
		        <br></br>
		        {this.state.playlists ? this.state.playlists.map((playlist,key) => {
		        	return(
		        		<div>
		        		<Playlist name={playlist.name} img_link={playlist.images[0].url} />
		        		</div>
		        		)
		        }) : ' '}
		      </div>
		    </div>
		  </div>
		 );
		}
}


export default Playlists