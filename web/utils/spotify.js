import axios from 'axios'

export const fetchAccessToken = (authCode, clientID, clientSecret, redirectURI, dataSetter, setError) => {
    
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
        dataSetter(res.data)
    })
    .catch(err => {
        setError(err)
    })

}

export const fetchProfile = (authData, dataSetter, setError) => {
    const hdrs = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authData.access_token
    }
    axios.get('https://api.spotify.com/v1/me', {headers: hdrs})
    .then(res => {
        dataSetter(res.data)
    })
    .catch(err => {
        setError(err)
    })
}

export const currentPlayback = (authData, dataSetter, setError) => {
    const hdrs = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authData.access_token
    }
    axios.get('https://api.spotify.com/v1/me/player/currently-playing', {headers: hdrs})
    .then(res => {
        if (res.data === "") {
            dataSetter({})
        } else {
            let current = res.data
            axios.get(`https://api.spotify.com/v1/audio-features/${current.item.id}`, {headers: hdrs})
            .then(res => {
                dataSetter({
                    ...current,
                    analysis: res.data
                })
            })
            .catch(err => {
                setError(err)
            })
        }
    })
    .catch(err => {
        setError(err)
    })
}

export const fetchPlaylists = (authData, dataSetter, setError) => {
    let playlists = []
    const hdrs = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authData.access_token
    }
    const getPlaylists = (url) => {
        axios.get(url, {headers: hdrs})
        .then(res => {
            if (res.data.next) {
                playlists.concat(res.data.items)
                getPlaylists(res.data.next)
            } else {
                dataSetter(playlists.concat(res.data.items))
            }
        })
        .catch(err => {
            setError(err)
        })     
    }

    getPlaylists('https://api.spotify.com/v1/me/playlists?limit=50')
}

export const playlistAnalysisBasic = (playlists) => {

    let analysis = {
        longestPlaylist: playlists[0],
        shortestPlaylist: playlists[0],
        totalTracks: 0,
    }

    playlists.forEach(playlist => {
        // update total tracks
        analysis.totalTracks += playlist.tracks.total
        
        // update longest and shortest playlist
        if (playlist.tracks.total > analysis.longestPlaylist.tracks.total) {
            analysis.longestPlaylist = playlist
        }
        if (playlist.tracks.total < analysis.shortestPlaylist.tracks.total) {
            analysis.shortestPlaylist = playlist
        }
    })

    return analysis
}

export const keyCodeToKey = (keyCode) => {
    let key = ""
    switch(keyCode) {
        case 0:
            key = 'C'
            break
        case 1:
            key = 'C#'
            break
        case 2:
            key = 'D'
            break
        case 3:
            key = 'D#'
            break
        case 4:
            key = 'E'
            break
        case 5:
            key = 'F'
            break
        case 6:
            key = 'F#'
            break
        case 7:
            key = 'G'
            break
        case 8:
            key = 'G#'
            break
        case 9:
            key = 'A'
            break
        case 10:
            key = 'A#'
            break
        case 11:
            key = 'B'
            break
        default:
            key = 'no_key'
    }
    return key
}

export const modeKeyToMode = (modeKey) => {
    let mode = ""
    switch(modeKey) {
        case 0:
            mode = "Minor"
            break
        case 1:
            mode = "Major"
            break
        default:
            mode = "Unknwon"
    }
    return mode
}