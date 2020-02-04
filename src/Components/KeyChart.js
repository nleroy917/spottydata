import React from 'react';
import './KeyChart.css';
import { Bar } from 'react-chartjs-2';

const querystring = require('querystring');

class KeyChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
    			options: {backgroundColor: '#89D3DA'}
    		}

  		}

  		componentDidMount() {
  			this.setState({data: {datasets: [{label: 'Key Distribution',
  											 data: Object.values(this.props.data)}], 
  								  labels: Object.keys(this.props.data)}})
  		}

  		render() {
  			console.log(this.state.data)
  			return (
  				<div>
  					<Bar
  						data={this.state.data}
  						options={this.state.options}
					 />
  				</div>
  				);
  		}

}

export default KeyChart
