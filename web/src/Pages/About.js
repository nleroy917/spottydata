import React from 'react';
import styled from 'styled-components'

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import AboutSectionWrapper from '../Components/AboutSectionWrapper'
import AboutSectionItem from '../Components/AboutSectionItem'

const home = process.env.REACT_APP_BASE_URL

const ButtonWrapper = styled.a`
    color: inherit;
    height:100%;
    text-decoration: none !important;
    &:focus {
        text-decoration: none;
    }
    &:active {
        text-decoration: none;
	}
	&:hover {
        text-decoration: none;
    }
`

const NewButton = styled(Button)`
  && {
	@media (max-width: 768px) {
	margin:15px;
	width: 60vw;
	height: 60px;
  }
	margin: 30px;
	color: inherit;
	width: 150px;
	height: 50px;
	border-radius: 0px;
	border: solid 1px white;
	box-shadow: 4px 4px;
	&:hover {
		color: white;
		transform: translate(1px,1px);
		opacity: 0.7;
		text-decoration: none;
		box-shadow: 2px 2px;
    }
  }
`

const Container = styled.div`
    text-align: left;
    margin-top: 50px;
    padding:10px;
    margin-left: 100px;
    margin-right: 100px;
    @media (max-width: 768px) {
        text-align: center;
		margin: 10px;
  }
`

const SectionTitle = styled(Typography)`
    font-weight: 400 !important;
    color: inherit;
    text-align: left;
`


const About = () => {
    return(
    <Container>
    <ButtonWrapper href={home}>
      <NewButton variant="outlined">Home</NewButton>
    </ButtonWrapper>
    <SectionTitle variant="h2">
        What is SpottyData?
    </SectionTitle>
        <AboutSectionWrapper>
            <AboutSectionItem>
                One goes here
            </AboutSectionItem>
            <AboutSectionItem>
                Two goes here
            </AboutSectionItem>
        </AboutSectionWrapper>
    </Container>)
}

export default About;