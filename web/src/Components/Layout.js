import React, {useState, useEffect} from 'react';
import Cookies from 'universal-cookie';
import './css/Layout.css'
import styled from 'styled-components'

const cookies = new Cookies();

const Wrapper = styled.div`
	padding-left: 100px;
	padding-right: 100px;
	@media (max-width: 768px) {
		padding: 10px;
  }

`

const Header = styled.header`
  min-height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 50px;
  padding-right: 50px;
  font-size: 12px;
  text-align: right;
  @media (max-width: 768px) {
		text-align: center;
  }

`

const A = styled.a`

    color: blue;

`

const Layout = ({ children }) => {

    const [authed, setAuthed] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkCookies()
    }, [children])

    const checkCookies = () => {
        if (cookies.get('accessToken')) {
            setAuthed(true);
            setUser(cookies.get('userName'))
        }
    }

    const clearCookies = () => {
        cookies.remove('accessToken')
        cookies.remove('refreshToken')
        cookies.remove('userName')
    }

    return(
    <Wrapper className="masthead home-background">
     {authed ? 
        <Header>
          Logged in as {cookies.get('userName')}. <A onClick={() => clearCookies()} href={`${process.env.REACT_APP_BASE_URL}`}>
                      Logout?
                    </A>
        </Header> 
        : 
        <Header>
            
        </Header>}
        {children}
    </Wrapper>
    )

}

export default Layout;