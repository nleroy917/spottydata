import React, {useState, useEffect} from 'react';
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'

import {
    Container,
    Grid
 } from '@material-ui/core';

import axios from 'axios';
import SDButton from '../Components/SDButton';
import InfoCard from '../Components/InfoCard';
import TempoPulse from '../Components/TempoPulse';

// Import Vibrant.js
import * as Vibrant from 'node-vibrant'

const querystring = require('querystring');

const URL_BASE = process.env.REACT_APP_API_URL

const SongInfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin: 10px;
    border-bottom: white solid 1px;

    && {
	  @media (max-width: 768px) {
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      }
    }
`

const AnalysisWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
`

const SongTitle = styled.h2`
    color: inherit;
    font-weight: 400;
    margin: 15px;
    text-align: left;
`

const SongAlbum = styled.h4`
    color: inherit;
    font-weight: 300;
    margin: 15px;
    text-align: left;
`

const ThumbnailLink = styled.a`
`

const Thumbnail = styled.img`
    margin: 15px;
    height: 150px;
    width: 150px;
    box-shadow: white 5px 5px;
    transition: ease-in-out 0.1s;

    &:hover {
        transform: translate(2px,2px);
        box-shadow: white 2px 2px;
    }
`

const SongAnalysis = ({ }) => {
    const [id, setID] = useState(querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).id)
    const [accessToken, setAccessToken] = useState(querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).access_token)
    const [song, setSong] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [palette, setPalette] = useState({})

    useEffect(() => {
        fetchSong()
        fetchAnalysis()
    }, [])

    const fetchSong = async () => {
        let hdrs = {
            Authorization: `Bearer ${accessToken}`
        }

        let res = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {headers: hdrs})

        if(res.status === 200) {
            let data = await res.data
            setSong(data)
            console.log(data)
            getVibrant(data.album.images[0].url)
        }
    }

    const fetchAnalysis = async () => {
        let hdrs = {
            access_token: `${accessToken}`
        }

        let res = await axios.get(`${URL_BASE}/analysis/song/${id}`, {headers: hdrs})
        if(res.status === 200) {
            let data = res.data
            console.log(data)
            setAnalysis(data.analysis)
            
        }
    }

    const getVibrant = (url) => {
        Vibrant.from(url).getPalette()
               .then((palette) => {
                console.log(palette)
                //document.body.style.backgroundImage = `radial-gradient(ellipse at top,rgba(${palette.Vibrant.r},${palette.Vibrant.g},${palette.Vibrant.b},0.5),
                                                                                      //rgba(${palette.Muted.r},${palette.Muted.g},${palette.Muted.b},0.4),
                                                                                      
                                                                                      //#2e2f32)`
                setPalette(palette)
               

      }
    )
    }
    
    return(
        song && analysis ? 
        <>
          <Container>
            <SongInfoWrapper>
            <ThumbnailLink href={song.external_urls.spotify}>
              <Thumbnail src={song.album.images[0].url} />
            </ThumbnailLink>
                <div>
                <SongTitle>
                    {song.name} | {song.album.name}
                </SongTitle>
                <SongAlbum>
                    {<em>{song.artists[0].name}</em>}
                </SongAlbum>
                </div>
                <div>
                    <SDButton href="/">
                        Home
                    </SDButton>
                    <SDButton href="/search">
                        Analyze Another
                    </SDButton>
                </div>
            </SongInfoWrapper>
            <br></br>
            <Grid container spacing={2}
              direction="row"
              justify="space-between"
              alignItems="flex-start"
            >
            <Grid item lg={4} s={6} xs={12}>
              <InfoCard
                title="Song Key"
                content={analysis.key}
              >
              </InfoCard>
            </Grid>
            <Grid item lg={4} s={6} xs={12}>
              <InfoCard
                title="Genre"
                content={analysis.tempo}
              >
              </InfoCard>
            </Grid>
            <Grid item lg={4} s={6} xs={12}>
              <InfoCard
                title={`Tempo`}
                content={`${analysis.tempo} bpm`}
              >
                <div style={{padding: '5px'}}>
                  <TempoPulse bpm={analysis.tempo} color={palette.LightVibrant.hex} />
                </div>
              </InfoCard>
            </Grid>
            </Grid>
          </Container>
        </>
        : ' '
    )
}

export default SongAnalysis;