import React from 'react';
import './GenreChart.css';
import { Radar } from 'react-chartjs-2';

class GenreChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
          options: { 
                scale:{
                pointLabels:{
                   fontColor: "white",
                   fontSize:12
                },
            } ,
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 12
                }
          },
          scale: {
          gridLines: {
            color: 'white'
          }
        }
           }
  			   }
  		}

  		componentDidMount() {
			this.setState({data: {labels: Object.keys(this.props.data), 
								    datasets:[
								              {label:'Genre Data',data:Object.values(this.props.data), backgroundColor:'rgba(135, 245, 251, 0.8)'}]
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

  	export default GenreChart;