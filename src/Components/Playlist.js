import React from 'react';
import './Playlist.css';


const axios = require('axios').default;
const querystring = require('querystring');

class Playlist extends React.Component{
	constructor(props) {
    		super(props);

    		this.state = {
      		name: props.name,
      		img_link: props.img_link,
    		};
  		}

  		render() {
  			return (
  			<div className="container-flex card-div">
  			<a className="playlist-link" href="https://google.com">
				<div className="card text-white bg-dark playlist-card">
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