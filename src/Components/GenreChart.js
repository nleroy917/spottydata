import React from 'react';
import './GenreChart.css';
import { Radar } from 'react-chartjs-2';

class GenreChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
  			   }
  		}

  		componentDidMount() {
			this.setState({data: {labels: Object.keys(this.props.data), 
								    datasets:[
								              {label:'Genre Data',data:Object.values(this.props.data),backgroundColor:'#581845'},]
									}})
  		}

  		render() {
  			return(
  				<div>
  				</div>
  				)
  		}
  	}

  	export default GenreChart;