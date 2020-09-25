import React from 'react';
import styled from 'styled-components';

import {
    Paper
} from '@material-ui/core';

const InfoWrapper = styled(Paper)`
    padding: 30px;
    background: #212529;
    height: 100%;
    color: inherit;
    display: flex;
    flex-wrap: wrap;
    direction: row;
    justify-content: space-between;
    align-items: center;
`

const InfoTitle = styled.h4`
    text-align: left;
    font-weight: 500;
    font-size: 2.0rem;

`

const InfoContent = styled.p`
    text-align: left;
    font-size: 1.5rem ;
`

const InfoCard = (props) => {
    return(
        <>
          <InfoWrapper
            elevation={3}
          >
          <div>
          <InfoTitle>
              {props.title}
          </InfoTitle>
          <InfoContent>
              {props.content}
          </InfoContent>
          </div>
          <div>
            {props.children}
          </div>
          </InfoWrapper>
        </>
    )
}

export default InfoCard;