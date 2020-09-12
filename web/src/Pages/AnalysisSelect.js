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
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [uID, setUID] = useState(null);
    const [cancelled, setCancelled] = useState(false);
    
    useEffect(() => {
        // console.log(authCode)

    },[])

    return(
        <>
          <Layout>
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