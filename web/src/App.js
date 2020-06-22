import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './Pages/Home'
import Playlists from './Pages/Playlists'
import Analysis from './Pages/Analysis'
import About from './Pages/About'


const App = () => {

  return (
    <Router>
    <div className="App">
      <Switch>
        <Route path="/about/" component={About}>
        </Route>
        <Route path="/playlists/" component={Playlists}>
        </Route>
        <Route path="/analysis/" component={Analysis}>
        </Route>
        <Route path="/" exact component={Home}>
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
