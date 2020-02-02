import React from 'react';
import './Analysis.css';
import Chart from "chart.js";
const querystring = require('querystring');
const axios = require('axios').default;

const URL_BASE = 'https://spottydata-api.herokuapp.com/'

class Analysis extends React.Component{

		  constructor(props) {
    		super(props);
    		this.state = {
    			accessToken: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).access_token,
    			id: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).id,
    			analysis: null
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
		    	this.setState({user: data.display_name})
			}
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

  					</div>
  					<div className="col-md-5">

  					</div>
  				</div>

  			</div>
  			)
  		}

}

export default Analysis