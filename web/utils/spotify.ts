import { Dispatch, SetStateAction } from 'react';
import axios, { AxiosAdapter, AxiosResponse } from 'axios'
import { AuthData, AuthPayload } from '..';
import { ErrorObject } from '../components/layout/Error';

export const fetchAccessToken = (
    authCode: string,
    clientID: string,
    clientSecret: string,
    redirectURI: string,
    dataSetter: Dispatch<SetStateAction<AuthData>>, 
    setError: Dispatch<SetStateAction<ErrorObject | undefined>>, 
    setCookie: Function
) => {
    
    const hdrs = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
    }

    const body: AuthPayload = {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectURI
    }
    
    // convert payload to query string
    const qs = `grant_type=${body.grant_type}&code=${body.code}&redirect_uri=${body.redirect_uri}`

    axios.post('https://accounts.spotify.com/api/token', qs, {headers: hdrs})
    .then(res => {
        dataSetter(res.data)
        setCookie(
            'authData',
            res.data,
            {
                path: '/',
                maxAge: 60*60 // 60 minutes
            }
        )
    })
    .catch(err => {
        setError(err)
    })

}

export const fetchProfile = (
    authData: AuthData, 
    dataSetter: Dispatch<SetStateAction<SpotifyApi.UserObjectPublic | undefined>>, 
    setError: Dispatch<SetStateAction<ErrorObject | undefined>>, 
    setCookie: Function
) => {
    const hdrs = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authData.access_token
    }

    axios.get('https://api.spotify.com/v1/me', {headers: hdrs})
    .then(res => {
        setCookie(
        'profile',
        res.data,
        {
            path: '/',
            maxAge: 60*60 // 60 minutes
        }
        )
        dataSetter(res.data)
    })
    .catch(err => {
        setError(err)
    })
}

export interface CurrentSongWithAnalysis extends SpotifyApi.CurrentlyPlayingObject{
    item: SpotifyApi.TrackObjectFull
    analysis: SpotifyApi.AudioFeaturesObject
}

export const currentPlayback = (
    authData: AuthData, 
    dataSetter: Dispatch<SetStateAction<CurrentSongWithAnalysis | undefined>>, 
    setError: Function
) => {
    const hdrs = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authData.access_token
    }
    axios.get('https://api.spotify.com/v1/me/player/currently-playing', {headers: hdrs})
    .then((res: AxiosResponse) => {
        let data: SpotifyApi.CurrentlyPlayingObject | string = res.data
        if (typeof(data) === "string") {
            dataSetter(undefined)
        } else if (data.currently_playing_type !== "track") {
            dataSetter(undefined)
        } else {
            // dataSetter(undefined)
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

export const fetchPlaylists = (
    authData: AuthData, 
    dataSetter: Dispatch<SetStateAction<SpotifyApi.PlaylistObjectFull[] | undefined>>, 
    setError: Dispatch<SetStateAction<ErrorObject | undefined>>
) => {

    let playlists: SpotifyApi.PlaylistObjectFull[] = []

    const hdrs = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authData.access_token
    }

    const getPlaylists = (url: string) => {
        axios.get(url, {headers: hdrs})
        .then(res => {
            if (res.data.next) {
                playlists = playlists.concat(res.data.items)
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

export const playlistAnalysisBasic = (playlists: SpotifyApi.PlaylistObjectFull[]) => {
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

export const keyCodeToKey = (keyCode: number) => {
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

export const modeKeyToMode = (modeKey: number) => {
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

export interface TopData  {
    artists: {
        [term: string]: SpotifyApi.UsersTopArtistsResponse
    },
    tracks: {
        [term: string]: SpotifyApi.UsersTopTracksResponse
    }
}

export const fetchTopData = (
    authData: AuthData, 
    setTop: Dispatch<SetStateAction<TopData | undefined>>, 
    setError: Dispatch<SetStateAction<ErrorObject | undefined>>
) => {

    let topData: TopData = {
        artists: {},
        tracks: {}
    }

    const hdrs = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authData.access_token
    }

    // get top artist data
    axios.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10', {headers: hdrs})
    .then(res => {
        topData.artists.short_term = res.data
        setTop(topData)
    })
    .catch(err => {
        setError(err)
    })
    axios.get('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10', {headers: hdrs})
    .then(res => {
        topData.artists.medium_term = res.data
        setTop(topData)
    })
    .catch(err => {
        setError(err)
    })
    axios.get('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10', {headers: hdrs})
    .then(res => {
        topData.artists.long_term = res.data
        setTop(topData)
    })
    .catch(err => {
        setError(err)
    })

    // get top tracks data
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {headers: hdrs})
    .then(res => {
        topData.tracks.short_term = res.data
        setTop(topData)
    })
    .catch(err => {
        setError(err)
    })
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10', {headers: hdrs})
    .then(res => {
        topData.tracks.medium_term = res.data
        setTop(topData)
    })
    .catch(err => {
        setError(err)
    })
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10', {headers: hdrs})
    .then(res => {
        topData.tracks.long_term = res.data
        setTop(topData)
    })
    .catch(err => {
        setError(err)
    })
}

export const fetchingTopData = (topData: TopData | undefined) => {
    if(topData === undefined) {
        return true
    }
}