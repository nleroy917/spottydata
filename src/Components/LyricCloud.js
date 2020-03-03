import React from 'react';
import './css/LyricCloud.css';
import ReactWordcloud from 'react-wordcloud';

class LyricCloud extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			words: props.data,
          palette: this.props.palette,
          options: {
            fontFamily: 'roboto',
            colors: [this.props.palette.Vibrant.hex,
                      this.props.palette.LightVibrant.hex,
                      this.props.palette.Muted.hex,
                      this.props.palette.LightMuted.hex],
            fontSizes: [10,60],
            rotations: 2,
            rotationAngles: [0, 90],
            padding:0

  			   }
          }
  		}

  		componentDidMount() {
  			//console.log(this.state.words)
        //console.log('mounting')
      }

  		render() {
  			return (
  				<div>
  					<ReactWordcloud
  						words={this.state.words}
  						options={this.state.options}
					 />
  				</div>
  				);
  		}

}


export default LyricCloud
