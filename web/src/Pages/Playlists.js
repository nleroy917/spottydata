import React from 'react';
import Cookies from 'universal-cookie';
import './css/Playlists.css';
import blank_image from '../images/blank_playlist.png'
import blank_profile from '../images/blank_profile.png'

// Load custom components
import Playlist from '../Components/Playlist'
import Loader from '../Components/Loader'
import loading_gif from '../images/loading.gif'

//Load Material UI
// Load in the materials-ui components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// Load styling
import FadeIn from 'react-fade-in';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from 'styled-components';

// Set axios, querystring, and cookies objects
const axios = require('axios').default;
const querystring = require('querystring');
const cookies = new Cookies();


const styles = theme => ({
  profile_image: {
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

const title_theme = createMuiTheme()

title_theme.typography.h3 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [title_theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};

title_theme.typography.h5 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [title_theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};

class Playlists extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
      		authCode: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code,
      		accessToken: null,
      		client_id: '0ca7dd0007fd4ff2a34c3aab07379970',
      		client_secret: process.env.REACT_APP_CLIENT_SECRET,
      		redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      		user: null,
      		user_id: null,
      		playlists: null,
      		chunked_playlists: null

    		};
  		}

  		componentDidMount() {
  			this.fetchAuthCode()
  			this.setState({authCode: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code},() => {this.fetchAccessToken()})
  			//console.log(this.state.authCode)
		  }
		  
		refreshToken = async () => {
			console.log('Refreshing token')
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + btoa(this.state.client_id + ':' + this.state.client_secret)
			}

			const body = {
				grant_type: 'refresh_token',
				refresh_token: cookies.get('refreshToken')
			}

			const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify(body), {headers: headers})
			if(response.status === 200) {
				console.log('Access token refreshed')
				const data = await response.data

				this.setState({refreshToken: data.refresh_token})
				this.setState({expiresIn: data.expires_in})
				this.setState({accessToken: data.access_token})

				cookies.set('refreshToken',data.refresh_token,{path: '/'})
				cookies.set('expiresIn',data.expires_in,{path: '/'})
				cookies.set('accessToken',data.access_token,{ path: '/' })
			}

		}

  		fetchAuthCode = () => {
  			/*
  			The auth code is only good ONCE. Once it is used to get an access token from spotify, it must be regenerated to get another access token.

  			Thus, it should be found here from the querystring, then we call the fetchAccessToken() function and never look at auth code again until 
  			application is reloaded.
  			*/
  			var authCode = querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code
  			this.setState({authCode: authCode},() => {this.fetchAccessToken()})
  		}

		fetchAccessToken = async () => {
			/*
			The access token and refresh token should be found, set, and stored as a cookie for later use - if the refresh token can be found as a cookie...
			dont even try to go thru the process of getting another one - since the auth code is no longer valid - simply refresh access code and continue.
			*/

			if (cookies.get('accessToken')) {
				//console.log(cookies.get('accessToken')
				this.setState({accessToken: cookies.get('accessToken')})
				this.fetchName(cookies.get('accessToken'))

			} else {
				const headers = {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic ' + btoa(this.state.client_id + ':' + this.state.client_secret)
				}

				const body = {
					grant_type: 'authorization_code',
					code: this.state.authCode,
					redirect_uri: this.state.redirect_uri
				}

				const response = await axios.post('https://accounts.spotify.com/api/token',querystring.stringify(body),{headers: headers})

				if(response.status === 200) {
					//console.log(response)
					const data = await response.data
					this.setState({refreshToken: data.refresh_token})
					this.setState({expiresIn: data.expires_in})
					this.setState({accessToken: data.access_token})

					cookies.set('refreshToken',data.refresh_token,{path: '/'})
					cookies.set('expiresIn',data.expires_in,{path: '/'})
					cookies.set('accessToken',data.access_token,{ path: '/' })
					this.fetchName(this.state.accessToken)

					return data.access_token
				}
			}
		}

		fetchName = async (access_token) => {
			//console.log(access_token)
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + access_token
			}

			const response = await axios.get('https://api.spotify.com/v1/me',{headers})
			if(response.status === 200) {
		    	//console.log(response) 
		    	const data = await response.data
		    	this.setState({user: data})
		    	this.fetchPlaylists()
			} else if(response.status === 401) {
				/* This indicates a bad access token probably... need to refresh*/
				this.refreshToken()
				this.fetchName()
			}

		}

		fetchPlaylists = async () => {
			const headers = {
				'Content-Type': 'application/json',
				'access_token': this.state.accessToken
			}
			//console.log('token: ' + this.state.accessToken)

			const response = await axios.get('https://spottydata-api.herokuapp.com/' + this.state.user.id + '/playlists',{headers})
			if(response.status === 200) {
		    	//console.log(response);
		    	const data = await response.data
		    	//console.log(data)
		    	this.setState({playlists: data})
		    	this.setState({chunked_playlists: this.chunkPlaylists(data,3)})
			}	
		}

		chunkPlaylists(playlists,cols) {

			let chunked_playlists = [];
			let chunk = [];

			for(let i = 1; i<=playlists.length;i++) {

				if (typeof playlists[i-1] === 'undefined') {
					continue
				}

				//console.log(typeof playlists[i])
				//console.log(playlists[i])
				//console.log(i)
				if(i%cols === 0) {
					chunk.push(playlists[i-1])
					chunked_playlists.push(chunk)
					chunk = [];
				} else {
					chunk.push(playlists[i-1])

				}
			}

			return chunked_playlists
		}

		render() {

		const { classes } = this.props

		if(this.state.playlists){
		return (
		<div>
        <br></br>
        <Container>
          <Grid container spacing={3}
                direction="row"
                justify="space-between"
                alignItems="flex-start"
          >
            <Grid item lg={2} xs={3}>
              <Card className={classes.profile_image}>
                <CardActionArea>
                  <a href={this.state.user.external_urls.spotify}>
                    <CardMedia
                      style = {{ height: 'auto', width: "max", paddingTop: '100%'}}
                      image={this.state.user.images[0] ? this.state.user.images[0].url : blank_profile}
                      title={this.state.user.display_name}
                      justify="center"
                    />
                  </a>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item lg={8} xs={9}>
              <ThemeProvider theme={title_theme}>
                <Typography variant={'h3'} align={'left'} style={{fontWeight: 400}}>Welcome {this.state.user.display_name}!</Typography>
                <Typography variant={'h5'} align={'left'} style={{fontWeight: 100}}>Please select a playlist to continue.</Typography>
              </ThemeProvider>
            </Grid>
          </Grid>
          <hr style={{'borderColor':'#212529'}}></hr>
          <div className="justify-content-center">
				{this.state.chunked_playlists ? this.state.chunked_playlists.map((chunk,key) => {
				return(
					<div className="justify-content-center row card-row" key={key}>
						{chunk.map((playlist,key) => {
							return (
								<div className="col-md-3 card-col" key={key}>
									<FadeIn transitionDuration={1000}>
										<Playlist key={key} name={playlist.name} img_link={playlist.images[0] ? playlist.images[0].url : {blank_image}} id={playlist.id} token={this.state.accessToken} desc={playlist.description} authCode={this.state.authCode}/>
									</FadeIn>
								</div>
							);
						})}
					</div>)
			}) : ' '}
		</div>
		</Container>
        <br></br>
        </div>
				);}
		else{
			return(<Loader image={loading_gif} message="Fetching Playlists..."/>);
		}
		}
}

Playlists.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Playlists);