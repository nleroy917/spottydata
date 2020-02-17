import React from 'react';
import './KeyChart.css';
import { Bar } from 'react-chartjs-2';

// Change default color
import { defaults } from 'react-chartjs-2';

class KeyChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
          options: {gridLines: {zeroLineColor: '#E6FAFC'}}
  			   }
  		}
  		componentDidMount() {

  			this.setState({data: {labels: ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'], 
                            datasets:[
                                      {label:'Major',data:Object.values(this.props.data.major),backgroundColor:'rgba(135, 245, 251, 0.5)'},
                                      {label:'Minor',data:Object.values(this.props.data.minor),backgroundColor:'rgba(236, 145, 216, 0.5)'}]
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
