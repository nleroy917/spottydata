import { useEffect, useState } from 'react';
import {useCookies} from 'react-cookie';
import { useRouter } from 'next/router'
import Link from "next/link";
import { currentPlayback, fetchAccessToken, fetchPlaylists, fetchProfile, fetchTopData, keyCodeToKey, modeKeyToMode, verifyTopData } from '../utils/spotify';
import { Loading } from '../components/loading';

// telemetry
import * as ga from '../utils/ga';

import {
  Error,
  Header,
  SEO
} from '../components/layout'

export default function Auth() {
    // create router object
    const router = useRouter()

    // access cookies
    const [cookies, setCookie, ] = useCookies(['spottydata-credentials']);
    
    // check for error code
    const params = router.query
    if (params.error === "access_denied") {
        if(process.browser) {
            // log cancelation
            ga.event({
              action: "cancel_authentication",
              params: null
            })
            // send user home
            router.push("/")
        }
    }

    // extract authorization code
    const authCode = params.code

    // state management
    const [authData, setAuthData] = useState(cookies['authData'] || undefined)
    const [profile, setProfile] = useState(undefined)
    const [playlists, setPlaylists] = useState(undefined)
    const [playback, setPlayback] = useState(undefined)
    const [top, setTop] = useState(undefined)
    const [artistTimeFrame, setArtistTimeFrame] = useState('short_term')
    const [trackTimeFrame, setTrackTimeFrame] = useState('short_term')
    const [loadingMessage, setLoadingMessage] = useState(undefined)
    const [error, setError] = useState(undefined)

    /**
     * Drive access token fetching
     */
    useEffect(() => {
        if(authCode !== undefined && authData === undefined) {
            setLoadingMessage("Authenting...")
            fetchAccessToken(
                authCode,
                process.env.NEXT_PUBLIC_CLIENT_ID,
                process.env.NEXT_PUBLIC_CLIENT_SECRET,
                process.env.NEXT_PUBLIC_REDIRECT_URI,
                setAuthData,
                setError,
                setCookie
            )
        }
    }, [authCode, authData])

    /**
     * Drive user data fetching
     */
    useEffect(() => {
        if(authData !== undefined) {
            setLoadingMessage("Fetching profile...")
            fetchProfile(
                authData,
                setProfile,
                setError,
                setCookie
            )
            fetchPlaylists(
                authData,
                setPlaylists,
                setError
            )
            fetchTopData(
                authData,
                setTop,
                setError
            )
        }
    }, [authData])

    /**
     * Playback watcher
     */
    useEffect(() => {
        if(authData !== undefined) {
            currentPlayback(authData, setPlayback, setError)
        }
        let playbackCycle = setInterval(() => {
            if(authData !== undefined) {
                currentPlayback(authData, setPlayback, setError)
            }
        }, 3000) // run every five seconds

        // cleanup
        return () => clearInterval(playbackCycle)
    }, [authData])

    if(error) {
        // render the error
        return (
            <div>
                <SEO title="Error!"/>
                <Error error={error} />
            </div>
        )
    } else if (playback === undefined || authData === undefined || profile === undefined || playlists === undefined || !verifyTopData(top) ) {
        // render a spinner
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <SEO title="Loading..."/>
                <Loading message={loadingMessage} />
            </div>
        )
    } else {
        // render profile page
        return (
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
            <SEO title={`${profile.display_name} | Profile`} />
              <div className="h-40 md:h-64 w-full bg-gradient border-b border-black">
                <div className="p-1 md:p-4 flex flex-row items-center justify-between">
                    <Link href="/">
                        <span className="cursor-pointer font-bold">← Home</span>
                    </Link>
                    <Header />
                </div>
                <p className="md:mt-4 md:ml-4 ml-1 mt-1 text-6xl md:text-9xl font-extrabold opacity-10 truncate overflow-clip">{profile.display_name}</p>
              </div>
              <div className="mx-4 p-4 rounded-lg shadow-xl border-2 border-black -translate-y-20 md:-translate-y-1/4 bg-white w-11/12 md:max-w-screen-lg">
               <div className="flex flex-row items-start justify-between mb-4 border-b border-gray-200 pb-4">
               <div className="flex flex-row items-center">
                <img 
                   className="rounded-lg border-2 border-black shadow-md mr-4"
                   height={75}
                   width={75}
                   src={profile.images[0].url}
                 />
                 <p className="font-extrabold text-2xl md:text-4xl">
                     Welcome,{' '}
                     <span className="text-green-500">{profile.display_name}</span>
                 </p>
               </div>
                  {
                    playback.is_playing ? 
                    <div className="text-center animate-pulse text-xs px-2 py-1 text-green-600 bg-green-200 border-2 border-green-600 rounded-full">
                        Listening
                    </div> : 
                    <span className="text-center text-xs px-2 py-1 bg-gray-200 border-2 border-black rounded-full">
                        Paused
                    </span>
                  }
               </div>
               <div className="flex flex-row flex-wrap items-start justify-start mb-4 border-b border-gray-200 pb-4 font-bold text-lg md:text-xl">
                  <p className="mr-4">Followers:{' '}<span className="text-purple-500">{profile.followers.total}</span></p>
                  <p className="mr-4">Playlists:{' '}<span className="text-red-500">{playlists.length}</span></p>
                  <p className="mr-4">Total tracks:{' '}
                    <span className="text-yellow-500">
                        {playlists.map(p => p.tracks.total).reduce((a,b) => a + b, 0)}
                    </span>
                  </p>
               </div>
                <div className="flex flex-col justify-start">
                  <p className="text-2xl font-bold md:text-3xl">Currently listening to: </p>
                  {
                    playback.is_playing ?
                      <>
                      <div className="flex flex-row items-center my-2">
                            <img
                                className="rounded-lg border-2 border-black shadow-md"
                                height={75}
                                width={75}
                                src={playback.item.album.images[0].url}
                            />
                           <div className="ml-2">
                            <p className="text-xl md:text-2xl font-semibold">{playback.item.name}</p>
                            <p className="text-base italic">{playback.item.artists[0].name}</p>
                           </div>
                          </div>
                          <div className="my-2 flex flex-col md:flex-row text-lg md:text-2xl">
                              <p>Song Key: <span className="mr-4 font-bold text-blue-500">{keyCodeToKey(playback.analysis.key)}</span></p>
                              <p>Tempo: <span className="mr-4 font-bold text-green-500">{Math.round(playback.analysis.tempo)} bpm</span></p>
                              <p>Mode: <span className="mr-4 font-bold text-red-500">{modeKeyToMode(playback.analysis.mode)}</span></p>
                          </div>
                      </>
                      :
                      <div className="flex flex-col items-center justify-center p-4 my-2 text-center">
                          <p className="text-2xl text-gray-300 font-semibold">
                              No music playing{' '}<span className="opacity-50">💤</span>
                          </p>
                          <p className="text-2xl text-gray-300 font-semibold">
                            ...play something to see some analysis!
                          </p>
                      </div>
                  }
                </div>
              </div>
              <div className="-translate-y-20 md:-translate-y-24 w-11/12 md:max-w-screen-lg">
                  <div
                    onClick={() => router.push("/analysis")}
                    className="w-full cursor-pointer my-4 p-3 rounded-lg shadow-xl border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all"
                  >
                    <p className="font-bold text-2xl md:text-3xl text-center">Run full analysis →</p>
                  </div>
                </div>
                <div className="-translate-y-20 md:-translate-y-24 w-11/12 md:max-w-screen-lg">
                  <div className="flex flex-col md:flex-row flex-wrap justify-start md:justify-between items-center md:items-stretch">
                    <div className="w-full p-4 md:flex-1 md:mr-2 my-2 md:my-0 rounded-lg border-2 border-black shadow-xl bg-white">
                      <div className="flex flex-row justify-between items-center border-b pb-2">
                        <p className="font-bold text-2xl md:text-3xl">Top artists</p>
                        <select
                            className="text-xl p-1 border-2 border-black rounded-lg cursor-pointer shadow-sm"
                            onChange={e => {
                                setArtistTimeFrame(e.target.value)
                            }}
                        >
                            <option value="short_term">4 weeks</option>
                            <option value="medium_term">6 months</option>
                            <option value="long_term">All time</option>
                        </select>
                      </div>
                      <table>
                          <tbody>
                          {
                            top.artists[artistTimeFrame].items.map((a, i) => {
                                return (
                                    <tr className="md:text-lg my-2">
                                      <td className="font-bold text-2xl p-1">
                                        {i+1}.
                                      </td>
                                      <td className="m-2 p-1">
                                        <img
                                           className="rounded-md border border-black"
                                           src={a.images[0].url}
                                           style={{
                                               objectFit: 'cover',
                                               height: '50px',
                                               width: '50px'
                                           }}
                                        />
                                      </td>
                                      <td className="p-1">
                                        <p>
                                          {a.name}
                                        </p>
                                      </td>
                                    </tr>
                                )
                            })
                          }
                          </tbody>
                        </table>
                    </div>
                    <div className="w-full p-4 md:flex-1 md:ml-2 my-2 md:my-0 rounded-lg border-2 border-black shadow-xl bg-white">
                      <div className="flex flex-row justify-between items-center border-b pb-2">
                        <p className="font-bold text-2xl md:text-3xl">Top Songs</p>
                        <select
                            className="text-xl p-1 border-2 border-black rounded-lg cursor-pointer shadow-sm"
                            onChange={e => {
                                setTrackTimeFrame(e.target.value)
                            }}
                        >
                            <option value="short_term">4 weeks</option>
                            <option value="medium_term">6 months</option>
                            <option value="long_term">All time</option>
                        </select>
                      </div>
                        <table>
                          <tbody>
                          {
                            top.tracks[trackTimeFrame].items.map((t, i) => {
                                return (
                                    <tr className="text-base md:text-lg">
                                      <td className="font-bold text-2xl p-1">
                                        {i+1}.
                                      </td>
                                      <td className="m-2 p-1" style={{
                                          minWidth: '50px'
                                      }}>
                                        <img
                                           className="rounded-md border border-black"
                                           src={t.album.images[0].url}
                                           style={{
                                               objectFit: 'cover',
                                               height: '50px',
                                               width: '50px'
                                           }}
                                        />
                                      </td>
                                      <td className="max-w-min p-1">
                                          <p className="mb-0 text-base">
                                            {t.name}
                                          </p>
                                          <p className="text-gray-500 italic text-xs md:text-base">
                                            {t.artists[0].name}
                                          </p>
                                      </td>
                                    </tr>
                                )
                            })
                          }
                          </tbody>
                        </table>
                    </div>
                  </div>
                </div>
            </div>   
        )   
    }
}