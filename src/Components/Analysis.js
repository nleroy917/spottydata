import React from 'react';
import './Analysis.css';
import KeyChart from './KeyChart'
import GenreChart from './GenreChart'
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
          genre_data: null
    		}

  		}

  		componentDidMount() {
  			//console.log(this.state.accessToken)
  			this.fetchKeys()
        this.fetchGenres()
  		}

  		fetchKeys = async () => {
  			const headers = {
				'access_token': this.state.accessToken
			   }

  			const response = await axios.get(URL_BASE + `${this.state.id}/analysis/keys`,{headers})
  			if(response.status === 200) {
  		    	console.log(response) 
  		    	const data = await response.data
  		    	this.setState({key_data: data})
  			}
  		}

      fetchGenres = async () => {
        const headers = {
        'access_token': this.state.accessToken
         }

        const response = await axios.get(URL_BASE + `${this.state.id}/analysis/genre`, {headers})

        if(response.status === 200){
            console.log(response) 
            const data = await response.data

            var sortable = [];
              for (var genre in data) {
                  sortable.push([genre, data[genre]]);
              }

              sortable.sort(function(a, b) {
                  return a[1] - b[1];
              })

              var genresSorted = {}

              sortable.forEach((item) => {
              genresSorted[item[0]]=item[1]
              })
            }
            this.setState({genre_data: genresSorted})
            console.log(this.state.genre_data)
          }


  		render() {
  			return (
  			<div className="container">
  				<div className="row h-100">
  					<div className="col-12">
  					<br></br>
  					   <h1>Analysis of {this.state.name}</h1>
  					<br></br>
  					</div>
  				</div>
  			  <div className="row h-100">
    				<div className="col-md-5">
    					{this.state.key_data ? <KeyChart data={this.state.key_data} /> : ' '}
    				</div>
    				<div className="col-md-5">
              {this.state.genre_data ? <GenreChart data={this.state.genre_data} /> : ' '}
    				</div>
  				</div>

  			</div>
  			)
  		}

}

export default Analysis