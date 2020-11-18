import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styled from 'styled-components';
import axios from 'axios';

import {
    Container,
    TextField,
    CircularProgress,
    makeStyles,
} from '@material-ui/core';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Attribute from '../Components/Attribute';

const querystring = require('querystring');
const URL_BASE = process.env.REACT_APP_API_URL

const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#FFF'
        }
    },
    overrides:{
      MuiSlider: {
        thumb:{
        color: "white",
        },
        track: {
          color: '#007bff'
        },
        rail: {
          color: 'black'
        },
        markLabel: {
            color: 'black'
        },
        valueLabel: {
            color: 'black'
        }
      }
  }
  });

const PageHeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 15px;
`

const PageHeader = styled.h2`
    font-size: 50px;
`

const PageSubHeader = styled.h3`
    font-weight: 200;
    font-size: 30px;
`

const SeedTypeWrapper = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 30px;
`

const ParameterForm = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    gap: 40px;
`

const FormSection = styled.div`
    padding: 5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 50px;
`

const Select = styled.select`
    padding: 15px;
    color: white;
    border: white solid 1px;
    border-radius: 0px;
    background: none;
    height: 100%;
    &:focus {
        outline: none;
    }
`

const useStyles = makeStyles({
    inputRoot: {
      color: 'white',
      borderRadius: 0,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
        color: 'white'
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
        color: 'white'
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
        color: 'white'
      }
    },
    inputLabel: {
        color: 'white',
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
          color: 'white'
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
          color: 'white'
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
          color: 'white'
        }
      },
  });

const FindMusic = () => {
    const classes = useStyles();
    const [seedType, setSeedType] = useState('track');
    const [seed, setSeed] = useState({})
    const [query, setQuery] = useState(null)
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState(null)
    const [attributes, setAttributes] = useState([]);

    const clientCredentialsFlow = async () => {
        let hdrs = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET)
        }
        let body ={
            grant_type: 'client_credentials'
        }

        let res = await axios.post(`https://accounts.spotify.com/api/token`, querystring.stringify(body), {headers: hdrs})
        if (res.status === 200) {
            let data = res.data
            setAccessToken(data.access_token)
        }
    }

    const debouncedSearch = useDebouncedCallback(
        // function
        (query) => {
          setQuery(query)
          setLoading(true)
          searchSeeds(query)
        },
        // delay in ms
        500
      );
    
    const handleSearchChange = (e) => {
        debouncedSearch.callback(e.target.value)
    }

    const handleSeedTypeChange = (e) => {
        setSearchResults([])
        setSeedType(e.target.value)
        //console.log(e.target.value)
    }

    const searchSeeds = async (query) => {
        if(seedType === 'genre'){
            let hdrs = {
                Authorization: `Bearer ${accessToken}`
            }
            let res = await axios.get(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {headers: hdrs})
            if(res.status === 200){
                let data = res.data
                setLoading(false)
                setSearchResults(data.genres.map(genre => {
                    return {name: genre}
                }))
            }
        } else{
        if(!query){
            setLoading(false)
            setSearchResults([])
        }
        else{
        let hdrs = {access_token: accessToken}
        let res = await axios.get(`${URL_BASE}/search?type=${seedType}&query=${query}`, {headers: hdrs})
        if(res.status === 200) {
            let data = await res.data
            setSearchResults(data.results)
            setLoading(false)
            // console.log(data.results)
        }
    }}
    }
    useEffect(() => {
        if(!accessToken){clientCredentialsFlow()}
        console.log(attributes)
    }, [attributes])
    return (
        <>
         <Container>
         <PageHeaderWrapper>
           <PageHeader>
               Find new music
           </PageHeader>
         </PageHeaderWrapper>
         <PageHeaderWrapper>
         <PageSubHeader>
             1. Search for seed:
         </PageSubHeader>
         </PageHeaderWrapper>
         <SeedTypeWrapper>
           <Select onChange={handleSeedTypeChange}>
            <option value={'track'}>Track</option>
            <option value={'artist'}>Artist</option>
            <option value={'genre'}>Genre</option>
           </Select>
           <Autocomplete
            classes={classes}
            style={{width: 300}}
            id="search-bar"
            open={searchOpen}
            onOpen={() => {
              setSearchOpen(true);
            }}
            onClose={() => {
              setSearchOpen(false);
            }}
            onChange={(e,val) => {
                
                setSeed(val)}
                }
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => `${option.name}, ${option.artists ? option.artists[0].name : ''}`}
            options={searchResults}
            loading={loading}
            renderInput={(params) => (
            <TextField
              variant="standard"
              onChange={handleSearchChange}
              {...params}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="white" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
            )}
           />
           </SeedTypeWrapper>
           <PageHeaderWrapper>
         <PageSubHeader>
             2. Tweak parameters:
         </PageSubHeader>
         </PageHeaderWrapper>
         <ThemeProvider theme={muiTheme}>
           <ParameterForm>
               <FormSection>
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     name="acousticness"
                     tooltip="A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic."
                   />
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy."
                     name="energy"
                   />
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="float	Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable."
                     name="danceability"
                   />
               </FormSection>
               <FormSection>
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0."
                     name="instrumentalness"
                   />
               </FormSection>
           </ParameterForm>
           </ThemeProvider>
          </Container>
        </>
    )
}

export default FindMusic;
