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
  			<div className="border border-secondary container-fluid align-items-center">
  			<a className="playlist-link" href="https://google.com">
  				<div className="row">
  					<div className="playlist-img col-4 mb-3">
  						<img className="playlist-img rounded float-left artwork" src={this.state.img_link}/>
					</div>
					<div className="playlist-card col-8 mb-3">
						<div className=" playlist-card card text-white bg-dark mb-3">
							<div className="card-body">
								<h4 className="card-title">{this.state.name}</h4>
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