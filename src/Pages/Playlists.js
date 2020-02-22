import React from 'react';
import './css/Playlists.css';
import Playlist from '../Components/Playlist'
import blank_image from '../images/blank_playlist.png'
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

const axios = require('axios').default;
const querystring = require('querystring');

const cookie_key = 'authCode';

class Playlists extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
      		authCode: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code,
      		accessToken: null,
      		client_id: '0ca7dd0007fd4ff2a34c3aab07379970',
      		client_secret: process.env.REACT_APP_CLIENT_SECRET,
      		redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      		user: null,
      		user_id: null,
      		playlists: null,
      		chunked_playlists: null

    		};
  		}

  		componentDidMount() {
  			//console.log(this.state.client_secret)
  			this.fetchAuthCode()
  			this.setState({authCode: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code},() => {this.fetchAccessToken()})
  			console.log(this.state.authCode)
  		}

  		fetchAuthCode = () => {
  			var authCode = querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code
  			this.setState({authCode: authCode},() => {this.fetchAccessToken()})
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
				redirect_uri: this.state.redirect_uri
			}

			const response = await axios.post('https://accounts.spotify.com/api/token',querystring.stringify(body),{headers: headers})

			if(response.status === 200) {
				//console.log(response)
				const data = await response.data
				this.setState({accessToken: data.access_token})
				bake_cookie('access_token', this.state.access_token);
				this.fetchName()

				return data.access_token
			}
		}

		fetchName = async () => {
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.state.accessToken
			}

			const response = await axios.get('https://api.spotify.com/v1/me',{headers})
			if(response.status === 200) {
		    	//console.log(response) 
		    	const data = await response.data
		    	this.setState({user: data.display_name})
		    	this.setState({user_id: data.id})
		    	this.fetchPlaylists()
			}

		}

		fetchPlaylists = async () => {
			const headers = {
				'Content-Type': 'application/json',
				'access_token': this.state.accessToken
			}
			//console.log('token: ' + this.state.accessToken)

			const response = await axios.get('https://spottydata-api.herokuapp.com/' + this.state.user_id + '/playlists',{headers})
			if(response.status === 200) {
		    	//console.log(response);
		    	const data = await response.data
		    	// console.log(data)
		    	this.setState({playlists: data})
		    	this.setState({chunked_playlists: this.chunkPlaylists(data,3)})
			}	
		}

		chunkPlaylists(playlists,cols) {

			let chunked_playlists = [];
			let chunk = [];

			for(let i = 1; i<=playlists.length;i++) {

				if (typeof playlists[i-1] === 'undefined') {
					continue
				}

				//console.log(typeof playlists[i])
				//console.log(playlists[i])
				//console.log(i)
				if(i%cols === 0) {
					chunk.push(playlists[i-1])
					chunked_playlists.push(chunk)
					chunk = [];
				} else {
					chunk.push(playlists[i-1])

				}
			}

			return chunked_playlists
		}

		render() {
		
		return (
		<div className="container">
			<div className="row heading-row justify-content-center">
				<h2 className="font-weight-bold playlists-heading welcome-heading">Welcome {this.state.user ? this.state.user.charAt(0).toUpperCase() + this.state.user.slice(1) : ' '}! Please select a playlist to analyze.</h2>
			</div>
		{this.state.chunked_playlists ? this.state.chunked_playlists.map((chunk) => {
		return(
			<div className="row card-row">
				{chunk.map((playlist,key) => {
					return (
						<div className="col-md-4 card-col">
							<Playlist key={key} name={playlist.name} img_link={playlist.images[0] ? playlist.images[0].url : {blank_image}} id={playlist.id} token={this.state.accessToken} desc={playlist.description} authCode={this.state.authCode}/>
						</div>
					);
				})}
			</div>)
			}) : ' '}
		</div>
				);
		}
}


export default Playlists