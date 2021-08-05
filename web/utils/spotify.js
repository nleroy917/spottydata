import axios from 'axios'
import { encodeValue } from './encoding'

export const fetchAccessToken = (authCode, clientID, clientSecret, redirectURI) => {
    
    const hdrs = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
    }

    const body = {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectURI
    }
    
    // convert payload to query string
    const qs = Object.keys(body)
                .map(key => `${key}=${body[key]}`)
                .join('&');

    axios.post('https://accounts.spotify.com/api/token', qs, {headers: hdrs})
    .then(res => {
        alert(JSON.stringify(res.data, null, 2))
    })

}