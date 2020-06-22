import React from 'react';
import styled from 'styled-components';
import {isMobile} from 'react-device-detect'

import Grid from '@material-ui/core/Grid'

const AboutSectionWrapper = ({ children }) => {
    return(
    <div>
    <Grid container 
        direction="row" 
        justify={isMobile ? "center" : "flex-start"} 
        alignItems="center" 
        style={{width: '100%',height: '100%'}}
    >
        {children}
     </Grid>
    </div>)
}

export default AboutSectionWrapper;