import React, { useEffect, useState } from 'react';
import './Playlist.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
  			<div className="container h-100 playlist">
  				<div className="row h-100 align-items-left">
  				<img className="playlist-img" src={this.state.img_link}/>
				<div class="card text-white bg-dark mb-3">
				 <div class="card-body">
				    <h5 class="card-title">{this.state.name}</h5>
				  </div>
				</div>
				</div>
			</div>
  				);
  		}
}

export default Playlist