import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import Cookies from 'universal-cookie';

import {
    Typography,
} from '@material-ui/core';

import Layout from '../Components/Layout';
import SDButton from '../Components/SDButton';

// Set axios, querystring, and cookies objects
const axios = require('axios').default;
const querystring = require('querystring');
const cookies = new Cookies();

const LandingText = styled(Typography)`
	font-weight: 400 !important;
`

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`

const VerticalCenter = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const client_id = '0ca7dd0007fd4ff2a34c3aab07379970'
const client_secret =  process.env.REACT_APP_CLIENT_SECRET
const redirect_uri = process.env.REACT_APP_REDIRECT_URI

const AnalysisSelect = ({  }) => {

    const [authCode, setAuthCode] = useState(querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code);
    const [redirectURI, setRedirectURI] = useState(process.env.REACT_APP_REDIRECT_URI)
    const [headers, setHeaders] = useState({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + process.env.REACT_APP_CLIENT_SECRET,)
    })
    const [authBody, setAuthBody] = useState({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectURI
    })
    const [accessToken, setAccessToken] = useState(cookies.get('accessToken') || null);
    const [refreshToken, setRefreshToken] = useState(cookies.get('refreshToken') || null);
    const [user, setUser] = useState(cookies.get('userName') || null)
    const [uID, setUID] = useState(null);
    const [error, setError] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    
    useEffect(() => {

        authorizationCodeFlow()

    },[])

    const fetchName = async (token) => {

        let hdrs = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
 
        let res  = await axios.get('https://api.spotify.com/v1/me', {headers: hdrs})
        
        if(res.status === 200) {
            //console.log(response) 
            let data = await res.data
            cookies.set('userName', data.display_name, {path: '/'})
        }
    }
  

    const tokenRefresh = async (refreshToken) => {

			let hdrs = {
				'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
			}

			let body = {
				grant_type: 'refresh_token',
				refresh_token: cookies.get('refreshToken')
			}
			try {
			    let res = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify(body), {headers: hdrs})
			if(res.status === 200) {
				//console.log('Access token refreshed')
				let data = await res.data
				//console.log(data)

				if(data.refresh_token !== undefined){
					setRefreshToken(data.refresh_token)
				}
				setAccessToken(data.access_token)

				if(data.refresh_token !== undefined){
					cookies.set('refreshToken',data.refresh_token,{path: '/'})
				} else {
					cookies.remove('refreshToken')
                }
                
				cookies.set('accessToken',data.access_token,{ path: '/', expires: new Date(Date.now()+ data.expires_in*3600)})

				fetchName(data.access_token)
			}
		} catch(err) {
			setError(true)
			cookies.delete('accessToken')
			cookies.delete('refreshToken')
		}

	}

    const authorizationCodeFlow = async () => {
        if(accessToken) {
            if(!user){fetchName(accessToken)}
        } else if(refreshToken) {
            tokenRefresh(refreshToken)
        } else{
        try {
            var res = await axios.post(`https://accounts.spotify.com/api/token`, querystring.stringify(authBody), {headers: headers})
            var data = await res.data
            setAccessToken(data.access_token)
            setRefreshToken(data.refresh_token)
            cookies.set('refreshToken',data.refresh_token,{path: '/'})
            cookies.set('accessToken',data.access_token,{ path: '/', expires: new Date(Date.now()+ data.expires_in*3600)})

            fetchName(data.access_token)
            
        } catch (error) {
            alert(`Error in auth: ${error}`)
        }
    }
        
    }

    return(
        <>
          <Layout
            userID={user}
          >
           <VerticalCenter>
            <LandingText variant="h4">
                What would you like to analyze?
            </LandingText>
            <ButtonWrapper>
                <SDButton
                    href="/playlists"
                >
                    Playlist
                </SDButton>
                <SDButton>
                    Song
                </SDButton>
            </ButtonWrapper>
            </VerticalCenter>
          </Layout>
        </>
    )
}

export default AnalysisSelect;