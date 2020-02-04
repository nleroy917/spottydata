import React from 'react';
import './KeyChart.css';
import { Bar } from 'react-chartjs-2';

const querystring = require('querystring');

class KeyChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null
    		}

  		}

  		componentDidMount() {
  			this.setState({data: {datasets: Object.values(this.props.data), labels: Object.keys(this.props.data)}})
  		}

  		render() {
  			console.log(this.state.data)
  			return (
  				<div>
  					{this.state.data ? 
  					<Bar
					  data={this.state.data}
					 /> :
					 ' '}

  				</div>
  				);
  		}

}

export default KeyChart
