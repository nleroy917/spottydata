import React, {useState} from 'react';
import styled from 'styled-components';

import { Switch, Tooltip } from '@material-ui/core';
import { InfoIcon } from '@material-ui/icons/Info';

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

const Select = styled.select`
    padding: 15px;
    margin: 10px;
    color: white;
    border: white solid 1px;
    border-radius: 0px;
    background: none;
    height: 100%;
    &:focus {
        outline: none;
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

const AttributeDropdown = ({attributes, setAttributes, name, options, title, tooltip}) => {

    const [checked, setChecked] = useState(false)

    const toggleChecked = () => {
        setAttributes({...attributes, key: {...attributes[name],
            on: !checked
        }})
        setChecked(!checked)
    }

    const handleChange = (e) => {
        if(!checked){
            toggleChecked()
        }
        setAttributes({...attributes, [name]: {...attributes[name], goal: e.target.value}})
    }

    return(
        <>
        <Wrapper>
        <Title>
            {title || (name.charAt(0).toUpperCase() + name.slice(1))}
        </Title>
         <LowerWrapper>
          <Select
            value={attributes[name] ? attributes[name].goal : undefined}
            onChange={handleChange}
          >
              <option value={undefined}>Any</option>
              {
                options.map((o) => {
                    return (<option value={o.val}>{o.label}</option>)
                }
                    )
              }
          </Select>
          <Switch size="normal" checked={checked} onChange={toggleChecked} color="primary"/>
          </LowerWrapper>
          </Wrapper>
        </>
    )
}

export default AttributeDropdown;