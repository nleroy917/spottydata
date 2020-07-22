import React from 'react';
import styled from 'styled-components';
import './css/Playlist.css';
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from 'styled-components';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// Import Vibrant.js
import * as Vibrant from 'node-vibrant';

const card_theme = createMuiTheme({
  palette: {
    primary: {
      main: '#e6fafc', contrastText: "#fff"
    }
  },
  h6: {

  }
});

const Wrapper = styled(Card)`
  margin-left: 7px;
  margin-right: 7px;
  transition: ease-in-out 0.5 !important;
  box-shadow: ${props => props.palette ? props.palette.Vibrant.hex : 'white'} 2px 2px;

  &:hover {
    transition: ease-in-out 0.5 !important;
    /*border: solid ${props => props.palette ? props.palette.Vibrant.hex : 'white'} 1px;*/
    box-shadow: ${props => props.palette ? props.palette.Vibrant.hex : 'white'} 10px 10px;
    transform: translate(-4px,-4px);
  &:active {
    transition: ease-in-out 0.5 !important;
    box-shadow: ${props => props.palette ? props.palette.Vibrant.hex : 'white'} 2px 2px;
    transform: translate(2px,2px);
  }
  }
`

const Link = styled.a`
  text-decoration: none;
  &:hover{
    text-decoration: none;
  }
`

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
          authCode: props.authCode,
      		id: props.id,
          desc: props.desc,
          palette: null,
    		};

      }
    componentDidMount(){
      this.getVibrant(this.state.img_link)
    }

    getVibrant = (img_link) => {
			Vibrant.from(img_link).getPalette()
				   .then((palette) => {
             console.log(palette)
					this.setState({palette: palette})
	
		  })
		}

  	generateURL(access_token,playlist_id,name,authCode) {
  			let payload = {
  				access_token: access_token,
          code: authCode,
  				id: playlist_id,
          name: name
  			}

  			let url_query = querystring.stringify(payload)

  			return REDIRECT_BASE + url_query


      }

  	render() {
  			
          if(!this.state.palette){return(' ')}else{
          return (
          <Link href={this.generateURL(this.state.access_token,this.state.id,this.state.name,this.state.authCode)}>
            <ThemeProvider theme={card_theme}>
                  <Wrapper 
                    elevation={0} 
                    square={true}
                    palette={this.state.palette}
                  >
                    <CardActionArea>
                      <CardMedia
                        style = {{ height: "300", width: "max", paddingTop: '100%'}}
                        image={this.state.img_link}
                        title="Image title"
                      />
                      <CardContent className='playlist-card' style={{height: '100%'}}>
                        <Typography className='playlist-card'
                          theme={card_theme}
                          variant="h6"
                        >
                          {this.state.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Wrapper>
            </ThemeProvider>
          </Link>
  				);
  		}}
}

export default Playlist
