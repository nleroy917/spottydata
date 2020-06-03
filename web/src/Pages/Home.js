import React from 'react';
import styled from 'styled-components'

import Typist from 'react-typist';
import './css/Typist.css'

import Layout from '../Components/Layout'

import {
Typography,
Button,
Grid
} from '@material-ui/core';

const AnalysisText = styled.p`
	font-size:1.32rem;
	display: inline;
`

const Footer = styled.footer`
	margin-left:200px;
	margin-right:200px;
	opacity: 0.9;
	@media (max-width: 768px) {
		margin:5px;
		font-size: 0.7rem;
  }

`

const FooterLink = styled.a`
	color: inherit;
    height:100%;
    text-decoration: none;
    &:focus {
        text-decoration: none;
    }
    &:active {
        text-decoration: none;
	}
	&:hover {
        text-decoration: none;
    }
`

const LandingText = styled(Typography)`
	font-weight: 400 !important;
`

const ButtonWrapper = styled.a`
    color: inherit;
    height:100%;
    text-decoration: none !important;
    &:focus {
        text-decoration: none;
    }
    &:active {
        text-decoration: none;
	}
	&:hover {
        text-decoration: none;
    }
`

const NewButton = styled(Button)`
  && {
	@media (max-width: 768px) {
	margin:15px;
	width: 60vw;
	height: 60px;
  }
	margin: 30px;
	color: inherit;
	width: 150px;
	height: 50px;
	border-radius: 0px;
	border: solid 1px white;
	box-shadow: 4px 4px;
	&:hover {
		color: white;
		transform: translate(1px,1px);
		opacity: 0.7;
		text-decoration: none;
		box-shadow: 2px 2px;
    }
  }
`

const CookieNotice = styled(Typography)`

  color: white !important;
  font-weight: 400 !important;
  opacity: 0.6;
  font-size: 1rem !important;
`

const querystring = require('querystring');
const base_url =  'https://accounts.spotify.com/authorize?'
const payload = {
	client_id: '0ca7dd0007fd4ff2a34c3aab07379970',
	response_type: 'code',
	scope: 'playlist-read-private playlist-read-collaborative user-top-read',
	redirect_uri: process.env.REACT_APP_REDIRECT_URI,
	show_dialog: true
}

const authorize_url = base_url + querystring.stringify(payload)



const Home = () => {

return(
	<>
	<Layout>
	<Grid container
		direction="column"
		justify="center"
		alignItems="center"
		style={{width: '100%', height:'90vh'}}
	>
	<Grid item>
	  <LandingText variant="h2">Welcome to SpottyData</LandingText>
	      <br></br>
		  <span>
	        
			<Typist
			avgTypingDelay={70}
        	startDelay={1000}
        	cursor={{blink:true,hideWhenDone: true,hideWhenDoneDelay: 1000,}}
			>
					<AnalysisText className="lead">Analyze your playlist:</AnalysisText>
				<Typist.Delay ms={500} />
					<AnalysisText>&nbsp;Tempo.</AnalysisText>
				<Typist.Delay ms={500} />
				<Typist.Backspace count={6} delay={200}/>
				<Typist.Delay ms={500} />
					<AnalysisText>&nbsp;Modality.</AnalysisText>
				<Typist.Delay ms={500} />
				<Typist.Backspace count={9} delay={200}/>
				<Typist.Delay ms={500} />
					<AnalysisText>&nbsp;Lyrics.</AnalysisText>
				<Typist.Delay ms={500} />
				<Typist.Backspace count={9} delay={200}/>
				<Typist.Delay ms={500} />
					<AnalysisText><em>&nbsp;For free.</em></AnalysisText>
			</Typist>
		  </span>
	        <ButtonWrapper href={authorize_url}>
              <NewButton variant="outlined">Lets Go</NewButton>
            </ButtonWrapper>
			<ButtonWrapper href="https://github.com/NLeRoy917/spottydata">
              <NewButton variant="outlined">GitHub  <span style={{fontSize: '1.3rem'}}> &nbsp;&nbsp;&nbsp;🚀</span></NewButton>
            </ButtonWrapper>
	        <ButtonWrapper href="https://paypal.me/nathanleroy?locale.x=en_US">
              <NewButton variant="outlined">Buy me a coffee <span style={{fontSize: '1.5rem'}}>&nbsp;&nbsp;☕</span></NewButton>
            </ButtonWrapper>
	      <br></br>
	    <br></br>
		</Grid>
	</Grid>
	<Footer>
	  <Grid container
	  	direction="row"
		justify="space-between"
		alignItems="center"
		style={{width: '100%', textAlign: 'center'}}
		>
			<Grid item lg={4} xs={12} style={{width: '100%'}}>
				Created by <FooterLink href="https://twitter.com/NathanJLeRoy">Nathan LeRoy</FooterLink>
			</Grid>
			<Grid item lg={4} xs={12} style={{width: '100%'}}>
				© 2020
			</Grid>
			<Grid item lg={4} xs={12} style={{width: '100%'}}>
				<FooterLink href="https://github.com/NLeRoy917/spottydata/issues">Report an issue</FooterLink>
			</Grid>
		</Grid>
	</Footer>
	</Layout>
	</>
)
}


export default Home