import React from 'react';
import './css/LyricCloud.css';
import ReactWordcloud from 'react-wordcloud';

class LyricCloud extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			words: props.data,
  			   }
  		}

  		componentDidMount() {
  			console.log(this.state.words)
      }

  		render() {
  			return (
  				<div>
  					<ReactWordcloud
  						words={this.state.words}
  						// options={this.state.options}
					 />
  				</div>
  				);
  		}

}


export default LyricCloud
