
import React from 'react';
import './css/Loader.css';


class Loader extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			image: props.image,
    			message: props.message,
    			img_dimensions: props.img_dimensions
  			   }
  		}

  		componentDidMount() {
  			//console.log(this.state.img_dimensions)
      }

  		render() {
  			return (
	            <div>
	              <img className="img-fluid" src={this.state.image} style={this.state.img_dimensions}/>
	              <h5 style={{color:'#fff'}}>{this.state.message}</h5>
	            </div>
  				);
  		}

}


export default Loader
