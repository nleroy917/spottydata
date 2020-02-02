import React from 'react';
import './Playlist.css';

const querystring = require('querystring');
const REDIRECT_BASE = 'http://localhost:3000/analysis?'

class Playlist extends React.Component{
	constructor(props) {
    		super(props);
    		//console.log(props.accessToken)
    		this.state = {
      		name: props.name,
      		img_link: props.img_link,
      		accessToken: props.token,
      		id: props.id
    		};
  		}

  	generateURL(access_token,playlist_id) {
  			let payload = {
  				access_token: access_token,
  				id: playlist_id
  			}

  			let url_query = querystring.stringify(payload)

  			return REDIRECT_BASE + url_query

  		}

  	render() {
  			return (
  			<div className="container-flex card-div">
	  			<a className="playlist-link justify-content-center" href={this.generateURL(this.state.accessToken,this.state.id)}>
					<div className="card text-white playlist-card">
					    <div className="row no-gutters">
					        <div className="col-md-5 card-img" >
					            <img src={this.state.img_link} className="img-fluid card-img-top h-100" alt="..."/>
					        </div>
					        <div className="col-md-7">
					            <div className="card-body">
					            	<br></br>
					            	<br></br>
					                <h3 className="card-title">{this.state.name}</h3>
					                <br></br>
					            	<br></br>
					            </div>
					        </div>
					    </div>
					</div>
				</a>
			</div>
			
  				);
  		}
}

export default Playlist