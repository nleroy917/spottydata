import React from 'react';
import './Playlist.css';

const querystring = require('querystring');
const REDIRECT_BASE = process.env.REACT_APP_BASE_URL + '/analysis?'

class Playlist extends React.Component{
	constructor(props) {
    		super(props);
    		//console.log(props.accessToken)
    		this.state = {
      		name: props.name,
      		img_link: props.img_link,
      		accessToken: props.token,
      		id: props.id,
          desc: props.desc
    		};
  		}

  	generateURL(access_token,playlist_id,name) {
  			let payload = {
  				access_token: access_token,
  				id: playlist_id,
          name: name
  			}

  			let url_query = querystring.stringify(payload)

  			return REDIRECT_BASE + url_query

  		}

  	render() {
  			return (
  			<div className="container-flex card-div justify-content-center">
	  			<a className="playlist-link justify-content-center" href={this.generateURL(this.state.accessToken,this.state.id,this.state.name)}>
					<div className="card text-white playlist-card h-100">
	         <img src={this.state.img_link} className="img-fluid card-img-top playlist-img" alt="..."/>
	            <div className="card-body h-100">
	                <h3 className="card-title">{this.state.name}</h3>
	            </div>
	        </div>
				</a>
			</div>
			
  				);
  		}
}

export default Playlist