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
    const [query, setQuery] = useState(null)
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebouncedCallback(
        // function
        (query) => {
          setQuery(query)
          setLoading(true)
          searchSeeds(query)
          console.log(query)
        },
        // delay in ms
        250
      );
    
    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value)
    }

    const handleSeedTypeChange = (e) => {
        setSeedType(e.target.value)
        console.log(e.target.value)
    }

    const searchSeeds = async (query) => {
        let res = await axios.get(`${URL_BASE}/search?type=${seedType}&query=${query}`)
        if(res.status === 200) {
            let data = await res.data
            setSearchResults(data.results)
            // console.log(data.results)
        }
    }
    
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
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
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
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
