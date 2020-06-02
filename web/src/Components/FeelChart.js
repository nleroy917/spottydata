import React from 'react';
import './css/FeelChart.css';
import { Radar } from 'react-chartjs-2';

class FeelChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
          palette: this.props.palette,
          options: { 
              scale:{
                pointLabels:{
                   fontColor: "white",
                   fontSize:10
                },
                gridLines: {
                  color: 'white',
                  fontColor: 'white'
                },
            } ,
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 10
                },
                display: false
        },
          plugins: {
             datalabels: {
                display: true
             }
          },
        labels: { fontColor: "#fff" }
      }
  		}
    }

  		componentDidMount() {
			this.setState({data: {labels: Object.keys(this.props.data), 
								    datasets:[
								              {label:'Feel Data',data:Object.values(this.props.data),backgroundColor:`rgba(${this.state.palette.Vibrant.r}, ${this.state.palette.Vibrant.g}, ${this.state.palette.Vibrant.b}, 0.9)`}]
									}})
  		}

  		render() {
  			return(
  				<div>
  					<Radar data={this.state.data} 
                   options={this.state.options}
            />
  				</div>
  				)
  		}
  	}

  	export default FeelChart;