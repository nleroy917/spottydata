import React from 'react';
import './Analysis.css';
import KeyChart from './KeyChart'
import GenreChart from './GenreChart'
import FeelChart from './FeelChart'
import TempoChart from './TempoChart'
import LyricCloud from './LyricCloud'
import loading_gif from '../images/loading.gif'

const querystring = require('querystring');
const axios = require('axios').default;

const URL_BASE = 'https://spottydata-api.herokuapp.com/'
//const URL_BASE = 'http://127.0.0.1:5000/'

class Analysis extends React.Component{

		  constructor(props) {
    		super(props);
    		this.state = {
    			accessToken: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).access_token,
    			id: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).id,
    			name: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).name,
    			key_data: null,
		        genre_data: null,
		        feel_data: null,
            tempo_data: null,
            lyrics_data: null
    		}

  		}

  		componentDidMount() {
  			//console.log(this.state.accessToken)
  			 this.fetchAnalysis()
         this.fetchLyrics()
  		}


      fetchAnalysis = async () => {
        const headers = {
        'access_token': this.state.accessToken
         }

        const response = await axios.get(URL_BASE + `${this.state.id}/analysis`, {headers})

        if(response.status === 200){
            //console.log(response) 
            const data = await response.data

            var sortable = [];
              for (var genre in data.genres) {
                  sortable.push([genre, data.genres[genre]]);
              }

              sortable.sort(function(a, b) {
                  return b[1]- a[1];
              })

              var genresSorted = {}

              sortable.forEach((item) => {
              genresSorted[item[0]]=item[1]
              })

            // slice the object
            var genres_sliced = {}
            var max = 6
            var cnt = 1
            for(let genre in genresSorted) {
              genres_sliced[genre] = genresSorted[genre]
              cnt++
              if(cnt >= max) {
                break
              }
            }

            this.setState({key_data: data.keys})
            this.setState({genre_data: genres_sliced})
            this.setState({feel_data: data.feel})
            this.setState({tempo_data: data.tempo})
          }
            }

        fetchLyrics = async () => {
          const headers = {
          'access_token': this.state.accessToken
           }

          const response = await axios.get(URL_BASE + `${this.state.id}/analysis/lyrics`, {headers})

          if(response.status === 200){
              //console.log(response) 
              const data = await response.data
              this.setState({lyrics_data: data})
              console.log(this.state.lyrics_data)

          }
        }




  		render() {
        if(this.state.key_data && this.state.genre_data && this.state.feel_data && this.state.tempo_data) {
  			return (
  			<div className="container">
  				<div className="row h-100 justify-content-center">
  					<div className="col-12">
  					<br/>
  					   <h1>Analysis of {this.state.name}</h1>
  					<br></br>
  					</div>
  				</div>

  			  <div className="row h-100 justify-content-center">
    				<div className="col-md-5">
            <h5>Keys</h5>
    					{this.state.key_data ? <KeyChart data={this.state.key_data} /> : ' '}
    				</div>
            <div className="col-md-5">
            <h5>Genre</h5>
              {this.state.genre_data ? <GenreChart data={this.state.genre_data} /> : ' '}
    				</div>
  				</div>
          <br></br>

          <div className="row h-100 justify-content-center">
            <div className="col-md-5">
            <h5>Tempo</h5>
              {this.state.tempo_data ? <TempoChart data={this.state.tempo_data} /> : ' '}
            </div>
            <div className="col-md-5">
            <h5>Playlist Feel</h5>
              {this.state.feel_data ? <FeelChart data={this.state.feel_data} /> : ' '}
            </div>
          </div>
          <br></br>

          <div className="row h-100 justify-content-center">
            <div className="col-md-5">
            <h5>Lyrics</h5>
              {this.state.lyric_data ? <LyricCloud words={this.state.lyrics_data} /> : ' '}
            </div>
            <div className="col-md-5">
            <h5></h5>
            </div>
          </div>
  			</div>
  			)}
        else {
          return(
            <div>
              <img className="img-fluid" src={loading_gif} />
              <h3>Analyzing...</h3>
              <p>Can take up to 20 seconds for large playlists</p>
            </div>
            )
        }
  		}

}

export default Analysis
