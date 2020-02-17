import React from 'react';
import './KeyChart.css';
import { Line } from 'react-chartjs-2';

class TempoChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
  			   }
  		}

  		componentDidMount() {

  			this.setState({data: {labels: this.props.data.x, 
                            datasets:[
                                      {label:'Tempo',data:this.props.data.y, backgroundColor:'rgba(127, 96, 205, 0.6)', pointradius:'0'}]
                      }})
      }

  		render() {
  			return (
  				<div>
					<Line
						data={this.state.data}
						// options={this.state.options}
				 />
  				</div>
  				);
  		}

}


export default TempoChart