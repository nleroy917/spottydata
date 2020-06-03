import React from 'react';
import './css/Layout.css'
import styled from 'styled-components'

const Wrapper = styled.div`
	padding-left: 100px;
	padding-right: 100px;
	@media (max-width: 768px) {
		padding: 10px;
  }

`

const Layout = ({ children }) => {
    return(
    <Wrapper className="masthead home-background">
        {children}
    </Wrapper>
    )

}

export default Layout;