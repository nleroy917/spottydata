import React from 'react';
import './css/DurationChart.css';
import { Line } from 'react-chartjs-2';

class DurationChart extends React.Component{

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
                                labelString: 'Duration (min)',
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
                                labelString: 'Counts',
                                fontColor: '#E6FAFC',
                                fontSize:14
                            },
                            gridLines: {zeroLineColor: '#E6FAFC'},
                            ticks: {
                                  fontColor: "white",
                                  fontSize: 12
                            }
                        }]
                 },
            legend: {
            labels: {
                fontColor: "white"
            },
            display:false
        },
  			   }}
  		}

  		componentDidMount() {

  			this.setState({data: {labels: this.props.data.x, 
                            datasets:[
                                      {label:'Duration',data:this.props.data.y, backgroundColor:`rgba(${this.state.palette.LightVibrant.r}, ${this.state.palette.LightVibrant.g}, ${this.state.palette.LightVibrant.b}, 0.4)`, 
                                                                                borderColor:`rgba(${this.state.palette.LightVibrant.r}, ${this.state.palette.LightVibrant.g}, ${this.state.palette.LightVibrant.b}, 1)`, 
                                                                                borderWidth:0,pointRadius: 0}]
                      }})
      }

  		render() {
  			return (
  				<div>
					<Line
						data={this.state.data}
						options={this.state.options}
				 />
  				</div>
  				);
  		}

}


export default DurationChart