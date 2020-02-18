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
          options: {scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Key/Mode',
                                fontColor:'#E6FAFC',
                                fontSize:14
                            },
                            gridLines: {zeroLineColor: '#E6FAFC'},
                            ticks: {
                               fontColor: "white",
                               fontSize: 12
                              }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Count',
                                fontColor: '#E6FAFC',
                                fontSize:14
                            },
                            gridLines: {zeroLineColor: '#E6FAFC'},
                            ticks: {
                                  fontColor: "white",
                                  fontSize: 10
                            }
                        }]
                 },
            legend: {
            labels: {
                fontColor: "white"
            }
        },
           }
  			   }
  		}
  		componentDidMount() {

  			this.setState({data: {labels: ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'], 
                            datasets:[
                                      {label:'Major',data:Object.values(this.props.data.major),backgroundColor:'rgba(135, 245, 251, 0.8)'},
                                      {label:'Minor',data:Object.values(this.props.data.minor),backgroundColor:'rgba(236, 145, 216, 0.8)'}]
                      }})
      }

  		render() {
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
