import React from 'react';
import './KeyChart.css';
import { Line } from 'react-chartjs-2';

class TempoChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
    			options: {scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Tempo',
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
            }
        },
  			   }}
  		}

  		componentDidMount() {

  			this.setState({data: {labels: this.props.data.x, 
                            datasets:[
                                      {label:'Tempo',data:this.props.data.y, backgroundColor:'rgba(135, 245, 251, 0.8)', pointradius:'0'}]
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


export default TempoChart