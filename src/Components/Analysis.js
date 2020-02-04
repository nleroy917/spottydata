import React from 'react';
import './Analysis.css';
import KeyChart from './KeyChart'
const querystring = require('querystring');
const axios = require('axios').default;

//const URL_BASE = 'https://spottydata-api.herokuapp.com/'
const URL_BASE = 'http://127.0.0.1:5000/'

class Analysis extends React.Component{

		  constructor(props) {
    		super(props);
    		this.state = {
    			accessToken: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).access_token,
    			id: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).id,
    			analysis: null,
    			key_chart_data: null
    		}

  		}

  		componentDidMount() {
  			//console.log(this.state.accessToken)
  			this.fetchAnalysis()
  		}

  		fetchAnalysis = async () => {
  			const headers = {
				'access_token': this.state.accessToken
			   }

  			const response = await axios.get(URL_BASE + `${this.state.id}/features`,{headers})
  			if(response.status === 200) {
  		    	console.log(response) 
  		    	const data = await response.data
  		    	this.setState({analysis: data})
            	this.parseData()
  			}
  		}

      parseData() {
        // Initialize the key object to store the data
        let keys = {'A':0,
                'A#':0,
                'B':0,
                'C':0,
                'C#':0,
                'D':0,
                'D#':0,
                'E':0,
                'F':0,
                'F#':0,
                'G':0,
                'G#':0}

        for(let i = 0; i < this.state.analysis.key.length; i++) {
      		//console.log(this.state.analysis.key[i])
      		keys[this.state.analysis.key[i]] += 1
      	}

      	this.setState({key_chart_data: keys})
      }






  		render() {
  			return (
  			<div className="container">
  				<div className="row h-100">
  					<div className="col-6">
  					<br></br>
  					   <h1>Your Analysis </h1>
  					<br></br>
  					</div>
  				</div>
  			  <div className="row h-100">
    				<div className="col-md-5">
    					{this.state.key_chart_data ? <KeyChart data={this.state.key_chart_data} /> : ' '}
    				</div>
    				<div className="col-md-5">

    				</div>
  				</div>

  			</div>
  			)
  		}

}

export default Analysis