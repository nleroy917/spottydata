import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Link from "next/link";
import { currentPlayback, fetchAccessToken, fetchPlaylists, fetchProfile, keyCodeToKey, modeKeyToMode, playlistAnalysisBasic } from '../utils/spotify';
import { Error } from '../components/error';
import { Loading } from '../components/loading';
import Image from 'next/image';


export default function Auth() {
    // create router object
    const router = useRouter()
    
    // check for error code
    const params = router.query
    if (params.error === "access_denied") {
        // send home
        router.push("/")
    }

    // extract authorization code
    const authCode = params.code

    // state management
    const [authData, setAuthData] = useState(undefined)
    const [profile, setProfile] = useState(undefined)
    const [playback, setPlayback] = useState(undefined)
    const [playlists, setPlaylists] = useState(undefined)
    const [playlistAnalysis, setPlaylistAnalysis] = useState(undefined)
    const [error, setError] = useState(undefined)

    /**
     * Drive access token fetching
     */
    useEffect(() => {
        if(authCode !== undefined && authData === undefined) {
            fetchAccessToken(
                authCode,
                process.env.NEXT_PUBLIC_CLIENT_ID,
                process.env.NEXT_PUBLIC_CLIENT_SECRET,
                process.env.NEXT_PUBLIC_REDIRECT_URI,
                setAuthData,
                setError
            )
        }
    }, [authCode, authData])

    /**
     * Drive user data fetching
     */
    useEffect(() => {
        if(authData !== undefined) {
            fetchProfile(
                authData,
                setProfile,
                setError
            )
            fetchPlaylists(
                authData,
                setPlaylists,
                setError
            )
        }
        if (playlists !== undefined) {
            setPlaylistAnalysis(playlistAnalysisBasic(playlists.filter(p => p.owner.display_name === profile.display_name)))
        }
    }, [authData, playlists])

    /**
     * Playback watcher
     */
    useEffect(() => {
        let playbackCycle = setInterval(() => {
            if(authData !== undefined) {
                currentPlayback(authData, setPlayback, setError)
            }
        }, 5000) // run every five seconds

        // cleanup
        return () => clearInterval(playbackCycle)
    }, [authData])

    if(error) {
        // render the error
        return (
            <div>
                <Error error={error} />
            </div>
        )
    } else if (authData === undefined || profile === undefined || playback === undefined || playlists === undefined) {
        // render a spinner
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <Loading />
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center justify-start bg-gradient min-h-screen">
              <div className="h-40 w-full opacity-50 bg-no-repeat" style={{
                  backgroundImage: `url(${profile.images[0].url})`,
                  backgroundSize: 'cover'
              }}>
                <div className="p-4">
                    <Link href="/">
                        <span className="cursor-pointer opacity-100">Home</span>
                    </Link>
                </div>
              </div>
              <div className="mx-4 p-4 rounded-lg shadow-lg border-2 border-black -translate-y-20 md:-translate-y-1/4 bg-white w-11/12 md:w-1/2">
               <div className="flex flex-row items-start justify-between mb-2 border-b border-gray-200 pb-2">
               {/* <div className="my-auto">
                <Image
                    height={100}
                    width={100}
                    src={profile.images[0].url}
                />
               </div> */}
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
                  <div className="flex flex-row items-center justify-between text-base md:text-lg mb-2">
                    <div className="mr-2">
                        Followers: <span className="text-blue-400 font-bold">{profile.followers.total}</span>
                    </div>
                    <div className="mx-2">
                        Playlists: <span className="text-red-400 font-bold">{playlists.length}</span>
                    </div>
                    <div className="mx-2">
                        Total Tracks: <span className="text-purple-400 font-bold">{playlistAnalysis.totalTracks}</span>
                    </div>
                  </div>
                  <div className="flex flex-col text-base md:text-lg mb-2 md:flex-row justify-start border-b border-gray-200 pb-2 ">
                    <div className="flex flex-row my-1">
                        <Image
                            src={playlistAnalysis.longestPlaylist.images[0].url}
                            height={50}
                            width={50}
                        />
                        <div className="mx-2">
                            Longest Playlist: <br></br>
                            <span className="font-bold">{playlistAnalysis.longestPlaylist.name}</span>
                        </div>
                      </div>
                      <div className="flex flex-row my-1">
                        <Image
                            src={playlistAnalysis.shortestPlaylist.images[0].url}
                            height={50}
                            width={50}
                        />
                        <div className="mx-2">
                            Shortest Playlist: <br></br>
                            <span className="font-bold">{playlistAnalysis.shortestPlaylist.name}</span>
                        </div>
                      </div>
                  </div>
                  <div className="flex flex-col justify-start">
                    <p className="text-2xl font-bold md:text-4xl">Recently Played: </p>
                    <div className="flex flex-row items-center my-2 justify-center">
                    <Image 
                        height={75}
                        width={75}
                        src={playback.item.album.images[0].url}
                    />
                     <div className="ml-2">
                      <p className="text-xl md:text-2xl font-semibold">{playback.item.name}</p>
                      <p className="text-base italic">{playback.item.artists[0].name}</p>
                     </div>
                    </div>
                    <div className="my-2 flex flex-col md:flex-row text-lg md:justify-evenly md:text-2xl">
                        <p>Song Key: <span className="font-bold text-blue-500">{keyCodeToKey(playback.analysis.key)}</span></p>
                        <p>Tempo: <span className="font-bold text-green-500">{playback.analysis.tempo}</span></p>
                        <p>Mode: <span className="font-bold text-red-500">{modeKeyToMode(playback.analysis.mode)}</span></p>
                    </div>
                  </div>
              </div>
              <div className="-translate-y-16 md:max-w-screen-lg">
                <div className="flex flex-col justify-center items-center md:flex-row flex-wrap text-center text-3xl font-bold md:text-4xl">
                  <div className="w-11/12 md:w-96 cursor-pointer m-4 p-8 rounded-lg shadow-lg border-2 border-black hover:shadow-sm hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-500 transition-all">
                    Analyze Playlists
                  </div>
                  <div className="w-11/12 md:w-96 cursor-pointer m-4 p-8 rounded-lg shadow-lg border-2 border-black hover:shadow-sm hover:-translate-y-0.5 hover:border-green-500 hover:text-green-500 transition-all">
                    Search for music
                  </div>
                  <div className="w-11/12 md:w-96 cursor-pointer m-4 p-8 rounded-lg shadow-lg border-2 border-black hover:shadow-sm hover:-translate-y-0.5 hover:border-green-500 hover:text-green-500 transition-all">
                    Another thing
                  </div>
                  <div className="w-11/12 md:w-96 cursor-pointer m-4 p-8 rounded-lg shadow-lg border-2 border-black hover:shadow-sm hover:-translate-y-0.5 hover:border-green-500 hover:text-green-500 transition-all">
                    Another thing
                  </div>
                </div>
              </div>
            </div>   
        )   
    }
}