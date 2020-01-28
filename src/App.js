import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Components/Home'
import Playlist from './Components/Playlist'
import Playlists from './Components/Playlists'

const App = () => {
  return (
    <Router>
    <div className="App">
      <Switch>
        <Route path="/playlists/:code" exact component={Playlists}>
        </Route>
        <Route path="/" exact component={Home}>
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
