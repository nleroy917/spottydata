// Load Core React + Custom Components
import React from 'react';

// Load in the materials-ui components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Load in Material UI Styling components
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  playlist_image: {
    overflow: 'hidden',
  },
  paper: {
    background: '#212529'
  },
  paper_title: {
    color: '#fff'
  },
  paper_div: {
    padding: '20px'
  }

});



class ChartContainer extends React.Component {

		  constructor(props) {
    		super(props);
    		this.state = {
    		
    		}
    	}

    	render() {

    		// Custom styling
    		const {classes} = this.props;

    		return(            
	    		<Paper elevation={3} className={classes.paper}>
	              <div className="container" className={classes.paper_div}>
	                <h4 align="left" className={classes.paper_title}>{this.props.title}</h4>
	  				      {this.props.children}
	              </div>
	            </Paper>
    			);
    	}


}

ChartContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChartContainer);