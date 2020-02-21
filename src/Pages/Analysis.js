// load core react + custom components
import React from 'react';
import './css/Analysis.css';
import KeyChart from '../Components/KeyChart'
import GenreChart from '../Components/GenreChart'
import FeelChart from '../Components/FeelChart'
import TempoChart from '../Components/TempoChart'
import LyricCloud from '../Components/LyricCloud'
import loading_gif from '../images/loading.gif'

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

// Load styling
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { createMuiTheme } from '@material-ui/core/styles';
import styled, {ThemeProvider} from 'styled-components';

const querystring = require('querystring');
const axios = require('axios').default;

const URL_BASE = 'https://spottydata-api.herokuapp.com/'
//const URL_BASE = 'http://127.0.0.1:5000/'

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


class Analysis extends React.Component {

		  constructor(props) {
    		super(props);
    		this.state = {
    			accessToken: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).access_token,
    			id: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).id,
    			name: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).name,
          playlist: null,
    			key_data: null,
          top_key: null,
		        genre_data: null,
		        feel_data: null,
            tempo_data: null,
            tempo_avg: null,
            lyrics_data: null

    		}

  		}

  		componentDidMount() {
  			//console.log(this.state.accessToken)
         this.fetchPlaylist()
  			 this.fetchAnalysis()
         this.fetchLyrics()
  		}

      fetchPlaylist = async () => {
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.accessToken
          }

        const response = await axios.get(`https://api.spotify.com/v1/playlists/${this.state.id}`, {headers: headers})

        if(response.status === 200) {
              //console.log(response)
              const data = await response.data
              this.setState({playlist: data})
              console.log(this.state.playlist)
        }
      }


      fetchAnalysis = async () => {
        const headers = {
        'access_token': this.state.accessToken
         }

        const response = await axios.get(URL_BASE + `${this.state.id}/analysis`, {headers})

        if(response.status === 200){
            //console.log(response) 
            const data = await response.data

            var sortable = [];
              for (var genre in data.genres) {
                  sortable.push([genre, data.genres[genre]]);
              }

              sortable.sort(function(a, b) {
                  return b[1]- a[1];
              })

              var genresSorted = {}

              sortable.forEach((item) => {
              genresSorted[item[0]]=item[1]
              })

            // slice the object
            var genres_sliced = {}
            var max = 6
            var cnt = 1
            for(let genre in genresSorted) {
              genres_sliced[genre] = genresSorted[genre]
              cnt++
              if(cnt >= max) {
                break
              }
            }

            // Calculate psuedo-average tempo
            var tempo_avg = 0
            var sum = 0
            for(let i = 0; i<data.tempo.x.length; i++){
              tempo_avg += (data.tempo.x[i]*data.tempo.y[i])
              sum += data.tempo.y[i]
            }
            tempo_avg /= sum
            console.log(tempo_avg)

            this.setState({tempo_avg:Math.round(tempo_avg)})
            this.setState({key_data: data.keys})
            this.setState({genre_data: genres_sliced})
            this.setState({feel_data: data.feel})
            this.setState({tempo_data: data.tempo})
          }
            }

        fetchLyrics = async () => {
          const headers = {
          'access_token': this.state.accessToken
           }

          const response = await axios.get(URL_BASE + `${this.state.id}/analysis/lyrics`, {headers})

          if(response.status === 200){
              //console.log(response) 
              const data = await response.data
              this.setState({lyrics_data: data})
              console.log(this.state.lyrics_data)

          }
        }




  		render() {

        const { classes } = this.props;

        if(this.state.key_data && this.state.genre_data && this.state.feel_data && this.state.tempo_data) {
  			return (
        <div>
        <br></br>
        <Container>
          <Grid container spacing={3}
                direction="row"
                justify="space-between"
                alignItems="flex-start"
          >
            <Grid item lg={2}> 
              <Card className={classes.playlist_image}>
                <CardActionArea>
                  <CardMedia
                    style = {{ height: 'auto', width: "max", paddingTop: '100%'}}
                    image={this.state.playlist.images[0].url}
                    title="Image title"
                  />
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item lg={8}>
              <ThemeProvider theme={title_theme}>
                <Typography variant={'h3'} align={'left'}>{this.state.playlist.name}</Typography>
                <Typography variant={'h5'} align={'left'}>A Playlist by {this.state.playlist.owner.id}</Typography>
              </ThemeProvider>
            </Grid>
            <Grid item lg={2}>
            </Grid>
          </Grid>
          <hr style={{'border-color':'#212529'}}></hr>


          <Grid container spacing={2}
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item lg={3} xs={6}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper_div}>
                  <h6 align="left" className={classes.paper_title}>Total Tracks</h6>
                  <h1 align="left" className={classes.paper_title}>{this.state.playlist.tracks.total}</h1>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={3} xs={6}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper_div}>
                 <h6 align="left" className={classes.paper_title}>Followers</h6>
                 <h1 align="left" className={classes.paper_title}>{this.state.playlist.followers.total}</h1>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={3} xs={6}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper_div}>
                <h6 align="left" className={classes.paper_title}>Average Tempo</h6>
                <h1 align="left" className={classes.paper_title}>{this.state.tempo_avg} bpm</h1>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={3} xs={6}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper_div}>
                  <h6 align="left" className={classes.paper_title}>Favorite Key</h6>
                  <h1 align="left" className={classes.paper_title}>C#</h1>
                </div>
              </Paper>
            </Grid>
          </Grid>

          <br></br>

          <Grid container spacing={2}
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item lg={4} xs={12}>
              <Paper elevation={3} className={classes.paper}>
              <div className="container" className={classes.paper_div}>
                <h6 align="left" className={classes.paper_title}> Keys</h6>
  				      {this.state.key_data ? <KeyChart data={this.state.key_data} /> : ' '}
              </div>
              </Paper>
            </Grid>
            <Grid item lg={4} xs={12}>
              <Paper elevation={3} className={classes.paper}>
              <div className="container" className={classes.paper_div}>
                <h6 align="left" className={classes.paper_title}> Genres</h6>
                {this.state.genre_data ? <GenreChart data={this.state.genre_data} /> : ' '}
              </div>
              </Paper>
            </Grid>
            <Grid item lg={4} xs={12}>
              <Paper elevation={3} className={classes.paper}>
              <div className="container" className={classes.paper_div}>
                <h6 align="left" className={classes.paper_title}> Tempo</h6>
                {this.state.tempo_data ? <TempoChart data={this.state.tempo_data} /> : ' '}
              </div>
              </Paper>
            </Grid>
          </Grid>

          <br></br>

          <Grid container spacing={2}
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item lg={4} md={4} xs={12}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper}>
                    <h6 align="left" className={classes.paper_title}> Feel</h6>
                  {this.state.feel_data ? <FeelChart data={this.state.feel_data} /> : ' '}
                </div>
              </Paper>
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              <Paper elevation={3} className={classes.paper}>

              </Paper>
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              <Paper elevation={3} className={classes.paper}>

              </Paper>
            </Grid>
          </Grid>
        </Container>
        </div>
  			)}

        // Return Loader if not all data is here

        else {
          return(
            <div>
              <img className="img-fluid" src={loading_gif} />
              <h3>Analyzing...</h3>
              <p>Can take up to 20 seconds for large playlists</p>
            </div>
            )
        }
  		}

}

Analysis.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Analysis);
