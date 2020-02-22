import React from 'react';
import './css/FeelChart.css';
import { Radar } from 'react-chartjs-2';

class FeelChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
          options: { 
              scale:{
                pointLabels:{
                   fontColor: "white",
                   fontSize:1
                },
            } ,
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 10
                }
        },
          plugins: {
             datalabels: {
                display: true
             }
          },
          scale: {
            gridLines: {
              color: 'white',
              fontColor: 'white'
            },

        },
        labels: { fontColor: "#fff" }
      }
  		}
    }

  		componentDidMount() {
			this.setState({data: {labels: Object.keys(this.props.data), 
								    datasets:[
								              {label:'Feel Data',data:Object.values(this.props.data),backgroundColor:'rgba(236, 145, 216, 0.8)'}]
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