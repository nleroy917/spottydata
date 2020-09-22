import React, {useState, useEffect} from 'react';
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'

import Container from '@material-ui/core/Container';

import axios from 'axios';

const querystring = require('querystring');

const SongInfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
`

const SongTitle = styled.h4`
    color: inherit;
    font-weight: 400;
`

const SongAnalysis = ({ }) => {
    const [id, setID] = useState(querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).id)
    const [accessToken, setAccessToken] = useState(querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).access_token)
    const [song, setSong] = useState({})

    useEffect(() => {
        fetchSong()
    }, [])

    const fetchSong = async () => {
        let hdrs = {
            Authorization: `Bearer ${accessToken}`
        }
        let res = axios.get(`https://api.spotify.com/v1/tracks/${id}`, {headers: hdrs})
        if(res.status === 200) {
            let data = await res.data
            setSong(data)
            console.log(data)
        }
    }
    
    return(
        <>
          <Container>
            <SongInfoWrapper>
                <SongTitle>
                    {song.name}
                </SongTitle>
            </SongInfoWrapper>
          </Container>
        </>
    )
}

export default SongAnalysis;