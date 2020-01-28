import React from 'react';
import './Home.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const name = "NLeRoy917"

const Playlists = () => {
return(
<header class="masthead home-background">
  <div class="container h-100">
    <div class="row h-100 align-items-center">
      <div class="col-16">
        <h2 class="font-weight-bold playlists-heading">Welcome {name}, please select a playlist to analyze.</h2>
        <br></br>
        <p class="lead">The authorization code is {this.props.match.params.code}</p>
      </div>
    </div>
  </div>
 </header>

)
}


export default Playlists