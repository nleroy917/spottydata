import React from 'react';
import './KeyChart.css';
import { Bar } from 'react-chartjs-2';

class KeyChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
  			   }
  		}

  		componentDidMount() {

  			this.setState({data: {labels: ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'], 
                            datasets:[
                                      {label:'Major',data:Object.values(this.props.data.major),backgroundColor:'rgba(255, 0, 0, 0.6)'},
                                      {label:'Minor',data:Object.values(this.props.data.minor),backgroundColor:'rgba(127, 96, 205, 0.6)'}]
                      }})
      }

  		render() {
  			return (
  				<div>
  					<Bar
  						data={this.state.data}
  						// options={this.state.options}
					 />
  				</div>
  				);
  		}

}


export default KeyChart
