import React, {useState} from 'react';
import styled from 'styled-components';

import {
    Slider,
    IconButton,
    Tooltip,
    Switch
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import InfoIcon from '@material-ui/icons/Info';

const Parameter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: white solid 1px;
    border-radius: 5px;
    padding: 15px;
`

const ParameterTitle = styled.h4`
    font-size: 24px;
    font-weight: 500px;
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

const ValueWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 5px;
`

const Attribute = ({attributes, setAttributes, name, default_val, tooltip, min, max}) => {

    const [checked, setChecked] = useState(false);
    const [title, setTitle] = useState(name.charAt(0).toUpperCase() + name.slice(1))

    const toggleChecked = () => {
        setAttributes({...attributes, [name]: {
            on: !checked
        }})
        setChecked(!checked)
    }

    return(
      <>
        <Parameter>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', gap: '10px'}}>
            <ParameterTitle>
                {title}
            </ParameterTitle>
            <Tooltip title={tooltip}>
              <InfoIcon fontSize="small"/>
            </Tooltip>
            <Switch size="normal" checked={checked} onChange={toggleChecked} color="primary"/>
            </div>
            <Slider
              style={{width: 250}}
              aria-label={`${name}-slider`}
              min={min || 0}
              max={max || 1}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={(x) => `${Math.round(x*100,2)}%`}
              defaultValue={default_val || 0.5}
              onChange={(e,val)=>{setAttributes({...attributes, [name]: {...attributes[name], value: val}})}}
            />
            <ValueWrapper>
              <GoalSelect onChange={(e) => setAttributes({...attributes, [name]: {...attributes[name], goal: e.target.value}})}>
                <option value='target'>Target</option>
                <option value='min'>Min</option>
                <option value='max'>Max</option>
              </GoalSelect>
              <b>{attributes[name] ? attributes[name].value ? `${attributes[name].value}` : 'None' : 'None'}</b>
              <IconButton style={{margin: '10px', outline: 'none'}} onClick={() => setAttributes({...attributes, [name]: undefined})}>
                <ClearIcon style={{fill: 'white'}} size="0.5em"/>
              </IconButton>
            </ValueWrapper>
        </Parameter>
     </>
    )
}

export default Attribute;