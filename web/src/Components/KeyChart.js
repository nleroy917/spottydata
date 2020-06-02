import React from 'react';
import './css/KeyChart.css';
import { Bar } from 'react-chartjs-2';

class KeyChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
          palette: this.props.palette,
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
                                      {label:'Major',data:Object.values(this.props.data.major),backgroundColor: this.state.palette.Vibrant.hex},
                                      {label:'Minor',data:Object.values(this.props.data.minor),backgroundColor: this.state.palette.LightVibrant.hex}]
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
