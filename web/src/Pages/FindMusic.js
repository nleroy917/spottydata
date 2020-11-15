import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styled from 'styled-components';
import axios from 'axios';

import {
    Container,
    TextField,
    CircularProgress
} from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import Layout from '../Components/Layout';

const querystring = require('querystring');
const URL_BASE = process.env.REACT_APP_API_URL

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

const Select = styled.select`
    padding: 10px;
    color: white;
    border: white solid 1px;
    border-radius: 0px;
    background: none;
    &:focus {
        outline: none;
    }
`

const FindMusic = () => {
    const [seedType, setSeedType] = useState('track');
    const [seed, setSeed] = useState({})
    const [query, setQuery] = useState(null)
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState(null)

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
          console.log(query)
        },
        // delay in ms
        500
      );
    
    const handleSearchChange = (e) => {
        debouncedSearch.callback(e.target.value)
    }

    const handleSeedTypeChange = (e) => {
        setSeedType(e.target.value)
        console.log(e.target.value)
    }

    const searchSeeds = async (query) => {
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
    }
    }
    useEffect(() => {
        clientCredentialsFlow()
        console.log(seed)
    }, [seed])
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
             1. Select seed type:
         </PageSubHeader>
         </PageHeaderWrapper>
         <SeedTypeWrapper>
           <Select onChange={handleSeedTypeChange}>
            <option value={'track'}>Track</option>
            <option value={'artist'}>Artist</option>
            <option value={'genre'}>Genre</option>
           </Select>
           <Autocomplete
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
            getOptionLabel={(option) => `${option.name}, ${option.artists[0].name}`}
            options={searchResults}
            loading={loading}
            renderInput={(params) => (
            <TextField
              onChange={handleSearchChange}
              {...params}
              label="Search for seed"
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
          </Container>
        </>
    )
}

export default FindMusic;
