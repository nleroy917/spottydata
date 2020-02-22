import React from 'react';
import './css/GenreChart.css';
import { Doughnut } from 'react-chartjs-2';
import 'chart.piecelabel.js';

class GenreChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
          options: { 
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 12
                }
          } ,
          pieceLabel: {
             render: 'label',
             fontColor: '#fff'
          },
          plugins: {
             datalabels: {
                display: true
             }
          }
           }
  			   }
  		}

  		componentDidMount() {
			this.setState({data: {labels: Object.keys(this.props.data), 
								    datasets:[
								              {label:'Genre Data',data:Object.values(this.props.data), backgroundColor:['rgba(135, 245, 251, 0.8)','#EC91D8','#02111B','#E6FAFC','#3A506B']}]
									}})
  		}

  		render() {
  			return(
  				<div>
  					<Doughnut data={this.state.data} 
                   options={this.state.options}

            />
  				</div>
  				)
  		}
  	}

  	export default GenreChart;