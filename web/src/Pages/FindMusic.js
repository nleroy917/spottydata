import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styled from 'styled-components';
import axios from 'axios';

import {
    Container,
    TextField,
    CircularProgress,
    makeStyles,
    IconButton,
    Slider
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

const querystring = require('querystring');
const URL_BASE = process.env.REACT_APP_API_URL

const muiTheme = createMuiTheme({
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

const GoalSelect = styled.select`
    margin: 5px;
    margin-right: 15px;
    padding: 5px;
    font-size: 12px;
    color: white;
    border: white solid 1px;
    border-radius: 0px;
    background: none;
    height: 100%;
    &:focus {
        outline: none;
    }
`

const Parameter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const ParameterTitle = styled.h4`
    font-size: 24px;
    font-weight: 500px;
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
    const DEFAULT_VAL = 0.5;

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
        //console.log(attributes)
    }, [])
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
                   <Parameter>
                     <ParameterTitle>
                        Acousticness
                     </ParameterTitle>
                     <Slider
                       style={{width: 250}}
                       aria-labelledby="acousticness-slider"
                       min={0}
                       max={1}
                       step={0.01}
                       defaultValue={0.5}
                       onChange={(e,val)=>{setAttributes({...attributes, acousticness: {...attributes.acousticness, value: val}})}}
                     />
                     <span>
                     <GoalSelect onChange={(e) => setAttributes({...attributes, acousticness: {...attributes.acousticness, goal: e.target.value, value: attributes.acousticness ? attributes.acousticness.value : DEFAULT_VAL}})}>
                         <option value='target'>Target</option>
                         <option value='min'>Min</option>
                         <option value='max'>Max</option>
                     </GoalSelect>
                     <b>{attributes.acousticness ? `${attributes.acousticness.value}` : 'None chosen'}</b>
                     <IconButton style={{margin: '10px', outline: 'none'}} onClick={() => setAttributes({...attributes, acousticness: null})}>
                         <ClearIcon style={{fill: 'white'}} size="0.5em"/>
                     </IconButton>
                     </span>
                   </Parameter>
                   <Parameter>
                     <ParameterTitle>
                       Danceability
                     </ParameterTitle>
                     <Slider
                       style={{width: 250}}
                       aria-label="danceability-slider"
                       min={0}
                       max={1}
                       step={0.00000001}
                       defaultValue={0.5}
                       onChange={(e,val)=>{setAttributes({...attributes, danceability: {...attributes.danceability, value: val}})}}
                     />
                     <span>
                     <GoalSelect onChange={(e) => setAttributes({...attributes, danceability: {...attributes.danceability, goal: e.target.value, value: attributes.danceability ? attributes.danceability.value : DEFAULT_VAL}})}>
                         <option value='target'>Target</option>
                         <option value='min'>Min</option>
                         <option value='max'>Max</option>
                     </GoalSelect>
                     <b>{attributes.danceability ? `${attributes.danceability.value}` : 'None chosen'}</b>
                     </span>
                   </Parameter>
                   <Parameter>
                    <ParameterTitle>
                     Energy
                     </ParameterTitle>
                     <Slider
                       style={{width: 250}}
                       aria-label="danceability-slider"
                       min={0}
                       max={1}
                       step={0.00000001}
                       defaultValue={0.5}
                       onChange={(e,val)=>{setAttributes({...attributes, energy: {...attributes.energy, value: val}})}}
                     />
                     <span>
                     <GoalSelect onChange={(e) => setAttributes({...attributes, energy: {...attributes.energy, goal: e.target.value, value: attributes.energy ? attributes.energy.value : DEFAULT_VAL}})}>
                         <option value='target'>Target</option>
                         <option value='min'>Min</option>
                         <option value='max'>Max</option>
                     </GoalSelect>
                     <b>{attributes.energy ? `${attributes.energy.value}` : 'None chosen'}</b>
                     </span>
                   </Parameter>
               </FormSection>
               <FormSection>
                   <div>Here</div><div>Here</div><div>Here</div>
               </FormSection>
           </ParameterForm>
           </ThemeProvider>
          </Container>
        </>
    )
}

export default FindMusic;
