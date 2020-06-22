import React from 'react';
import styled from 'styled-components';
import {isMobile} from 'react-device-detect'

import Grid from '@material-ui/core/Grid'

const AboutSectionItem = ({ children }) => {
    return(
    <Grid item
        xs={12}
        lg={6}
        style={{width:'100%',height:'100%'}}
    >
        {children}
     </Grid>
    )
}

export default AboutSectionItem;