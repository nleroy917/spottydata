import { useEffect, useState } from 'react';
import {useCookies} from 'react-cookie';
import { useRouter } from 'next/router'
import Link from "next/link";
import { currentPlayback, fetchAccessToken, fetchPlaylists, fetchProfile, keyCodeToKey, modeKeyToMode, playlistAnalysisBasic } from '../utils/spotify';
import { Error } from '../components/error';
import { Loading } from '../components/loading';
import { Header } from '../components/header';
import SEO from '../components/seo';

export default function Auth() {
    // create router object
    const router = useRouter()

    // access cookies
    const [cookies, setCookie, ] = useCookies(['spottydata-credentials']);
    
    // check for error code
    const params = router.query
    if (params.error === "access_denied") {
        if(process.browser) {
            router.push("/")
        }
    }

    // extract authorization code
    const authCode = params.code

    // state management
    const [authData, setAuthData] = useState(cookies['authData'] || undefined)
    const [profile, setProfile] = useState(undefined)
    const [playback, setPlayback] = useState(undefined)
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
    } else if (playback === undefined || authData === undefined || profile === undefined ) {
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
              <div className="h-40 md:h-64 w-full bg-gradient">
                <div className="p-4 flex flex-row items-center justify-between">
                    <Link href="/">
                        <span className="cursor-pointer">Home</span>
                    </Link>
                    <Header />
                </div>
              </div>
              <div className="mx-4 p-4 rounded-lg shadow-lg border-2 border-black -translate-y-20 md:-translate-y-1/4 bg-white w-11/12 md:max-w-screen-lg">
               <div className="flex flex-row items-start justify-between mb-4 border-b border-gray-200 pb-4">
                <p className="font-extrabold text-2xl md:text-4xl">
                    Welcome,{' '}
                    <span className="text-green-500">{profile.display_name}</span>
                </p>
                  {
                    playback.is_playing ? 
                    <div className="text-center animate-pulse text-xs px-2 py-1 text-green-600 bg-green-200 border-2 border-green-600 rounded-full">
                        Listening
                    </div> : 
                    <span className="text-center text-xs px-2 py-1 bg-gray-200 border-2 border-black rounded-full">
                        Not playing
                    </span>
                  }
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
                      <div className="flex flex-col items-center justify-center p-4 my-2">
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
              <div className="-translate-y-16 w-11/12 md:max-w-screen-lg">
                  <div
                    onClick={() => router.push("/analysis")}
                    className="w-full cursor-pointer my-4 p-3 rounded-lg shadow-lg border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all"
                  >
                    <p className="font-bold text-2xl md:text-3xl text-center">Run full analysis →</p>
                  </div>
                </div>
            </div>   
        )   
    }
}