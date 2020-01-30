import React, {useState, useEffect} from 'react';
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

  const [username, setUsername] = useState(null);

  return (
    <Router>
    <div className="App">
      <Switch>
        <Route path="/playlists/" component={Playlists}>
        </Route>
        <Route path="/" exact component={Home}>
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
