import React, {useState, useEffect} from 'react';
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'

import Container from '@material-ui/core/Container';

import axios from 'axios';
import SDButton from '../Components/SDButton';

const querystring = require('querystring');

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
    const [song, setSong] = useState(null)

    useEffect(() => {
        fetchSong()
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
        }
    }
    
    return(
        song ? 
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
                    <SDButton>
                        Home
                    </SDButton>
                    <SDButton onClick="/search">
                        Analyze Another
                    </SDButton>
                </div>
            </SongInfoWrapper>
          </Container>
        </>
        : ' '
    )
}

export default SongAnalysis;