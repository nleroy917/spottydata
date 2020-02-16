import React from 'react';
import './FeelChart.css';
import { Radar } from 'react-chartjs-2';

class FeelChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
  			   }
  		}

  		componentDidMount() {
			this.setState({data: {labels: Object.keys(this.props.data), 
								    datasets:[
								              {label:'Feel Data',data:Object.values(this.props.data),backgroundColor:'rgba(255, 0, 0, 0.6)'}]
									}})
  		}

  		render() {
  			return(
  				<div>
  					<Radar data={this.state.data} />
  				</div>
  				)
  		}
  	}

  	export default FeelChart;