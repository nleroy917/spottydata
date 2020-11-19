import { Switch } from '@material-ui/core';
import React, {useState} from 'react';
import styled from 'styled-components';

import InputMask from "react-input-mask";

const Wrapper = styled.div`
    border: white solid 1px;
    border-radius: 5px;
    padding: 15px;
    margin: 10px;
    width: 250px;
    @media (max-width: 1024px) { /* iPad in portrait  */
		width: 100%;
    }
`

const Title = styled.h4`
    font-size: 24px;
    font-weight: 500px;
    text-align: left;
`

const LowerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Input = styled(InputMask)`
    width: 100%;
    border: white solid 1px;
    border-radius: 0px;
    background-color: rgba(0,0,0,0);
    padding: 5px;
    color: white;

    &:focus {
        outline: none;
    }
`

const AttributeInput = ({ attributes, setAttributes, inputType, name, mask }) => {

    const handleChange = (e) => {
        setAttributes({...attributes, [name]: {val: e.target.value}})
    }

    return (
        <>
         <Wrapper>
           <LowerWrapper>
            <Input
              mask={mask}
              onChange={handleChange} 
              value={attributes[name] ? attributes[name].value : ''} 
              alwaysShowMask={true}
            />
            <Switch />
           </LowerWrapper>
         </Wrapper>
        </>
    )
}

export default AttributeInput;