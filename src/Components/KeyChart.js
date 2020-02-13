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
                                      {label:'Major',data:Object.values(this.props.data.major),backgroundColor:'#581845'},
                                      {label:'Minor',data:Object.values(this.props.data.minor),backgroundColor:'#FF5733'}]
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
