import React from 'react';
import './Playlist.css';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const querystring = require('querystring');
const REDIRECT_BASE = process.env.REACT_APP_BASE_URL + '/analysis?'

class Playlist extends React.Component{
	constructor(props) {
    		super(props);
    		//console.log(props.accessToken)
    		this.state = {
      		name: props.name,
      		img_link: props.img_link,
      		access_token: props.token,
      		id: props.id,
          desc: props.desc
    		};

  		}

  	generateURL(access_token,playlist_id,name) {
  			let payload = {
  				access_token: access_token,
  				id: playlist_id,
          name: name
  			}

  			let url_query = querystring.stringify(payload)

  			return REDIRECT_BASE + url_query


  		}

  	render() {

  			return (
          <a href={this.generateURL(this.state.access_token,this.state.id,this.state.name)}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      style = {{ height: "300", width: "max", paddingTop: '100%'}}
                      image={this.state.img_link}
                      title="Image title"
                    />
                    <CardContent className='playlist-card'>
                      <Typography className='playlist-card'
                        variant="h6"
                        color='error'
                      >
                        {this.state.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
          </a>
  				);
  		}
}

export default Playlist
