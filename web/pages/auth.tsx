import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'
import Link from 'next/link'

// helpers
import {
  currentPlayback,
  fetchAccessToken,
  fetchPlaylists,
  fetchProfile,
  fetchTopData,
  keyCodeToKey,
  modeKeyToMode,
  TopData,
  fetchingTopData,
  CurrentSongWithFeatures,
  currentPlaybackAnalysis,
} from '../utils/spotify'

import { Loading } from '../components/loading'

// telemetry
import * as ga from '../utils/ga'

import { Error, Header, SEO } from '../components/layout'
import { AuthData } from '..'
import { ErrorObject } from '../components/layout/Error'
import { useInterval } from '../utils/useInterval'
import { secondsToMinutesSeconds } from '../utils/_helpers'
import { VisualizerCore } from '../components/visualizer'

const Auth = () => {
  // create router object
  const router = useRouter()

  // access cookies
  const [cookies, setCookie] = useCookies(['spottydata-credentials'])

  // check for error code
  const params = router.query
  if (params.error === 'access_denied') {
    if (process.browser) {
      // log cancelation
      ga.event({
        category: 'auth',
        action: 'click',
        label: 'cancel_authentication',
      })
      // send user home
      router.push('/')
    }
  }

  // extract authorization code
  let authCode: string | undefined
  if (Array.isArray(params.code)) {
    authCode = params.code[0]
  } else {
    authCode = params.code
  }

  // state management
  const [authData, setAuthData] = useState<AuthData>(
    cookies['authData'] || undefined
  )
  const [profile, setProfile] = useState<
    SpotifyApi.UserObjectPublic | undefined
  >(undefined)
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectFull[] | undefined
  >(undefined)
  const [playback, setPlayback] = useState<CurrentSongWithFeatures | undefined>(
    undefined
  )
  const [playbackAnalysis, setPlaybackAnalysis] = useState<
    SpotifyApi.AudioAnalysisResponse | undefined
  >(undefined)
  const [top, setTop] = useState<TopData | undefined>(undefined)
  const [artistTimeFrame, setArtistTimeFrame] = useState<string>('short_term')
  const [trackTimeFrame, setTrackTimeFrame] = useState<string>('short_term')
  const [loadingMessage, setLoadingMessage] = useState<string>('')
  const [error, setError] = useState<ErrorObject | undefined>(undefined)

  /**
   * Interval for playback
   */
  useInterval(() => {
    // only fetch the playback when the
    // authData has been acquired
    if (authData !== undefined) {
      currentPlayback(authData, setPlayback, setError)
    }
    // fetch audio analysis when playback
    // is acheived and we are playing audio on Spotify.
    if (playback?.is_playing) {
      currentPlaybackAnalysis(authData, setPlaybackAnalysis, setError, playback)
    }
  }, 1000)

  /**
   * Drive access token fetching
   */
  useEffect(() => {
    if (authCode !== undefined && authData === undefined) {
      setLoadingMessage('Authenting...')
      fetchAccessToken(
        authCode || '',
        process.env.NEXT_PUBLIC_CLIENT_ID || '',
        process.env.NEXT_PUBLIC_CLIENT_SECRET || '',
        process.env.NEXT_PUBLIC_REDIRECT_URI || '',
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
    if (authData !== undefined) {
      setLoadingMessage('Fetching profile...')
      fetchProfile(authData, setProfile, setError, setCookie)
      fetchPlaylists(authData, setPlaylists, setError)
      fetchTopData(authData, setTop, setError)
    }
  }, [authData])

  /**
   * Playback watcher
   */
  useEffect(() => {
    if (authData !== undefined) {
      currentPlayback(authData, setPlayback, setError)
    }
  }, [authData])

  if (error) {
    // render the error
    return (
      <div>
        <SEO title="Error!" />
        <Error error={error} />
      </div>
    )
  } else if (
    authData === undefined ||
    profile === undefined ||
    playlists === undefined ||
    fetchingTopData(top) ||
    top === undefined
  ) {
    // render a spinner
    // console.log(fetchingTopData(top))
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SEO title="Loading..." />
        <Loading message={loadingMessage} />
      </div>
    )
  } else {
    // render profile page
    //console.log(fetchingTopData(top))
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-white">
        <SEO title={`${profile.display_name} | Profile`} />
        <div className="w-full h-40 border-b border-black md:h-64 bg-gradient">
          <div className="flex flex-row items-center justify-between p-1 md:p-4">
            <Link href="/">
              <span className="font-bold transition-all cursor-pointer hover:text-green-400">
                ← Home
              </span>
            </Link>
            <Header />
          </div>
          <p className="mt-1 ml-1 text-6xl font-extrabold truncate md:mt-4 md:ml-4 md:text-9xl opacity-10 overflow-clip">
            {profile.display_name}
          </p>
        </div>
        <div className="w-11/12 p-4 mx-4 -translate-y-20 bg-white border-2 border-black rounded-lg shadow-xl md:-translate-y-1/4 md:max-w-screen-lg">
          <div className="flex flex-row items-start justify-between pb-4 mb-4 border-b border-gray-200">
            <div className="flex flex-row items-center">
              <img
                className="mr-4 border-2 border-black rounded-lg shadow-md"
                height={75}
                width={75}
                src={profile.images ? profile.images[0].url : ''}
              />
              <p className="text-2xl font-extrabold md:text-4xl">
                Welcome,{' '}
                <span className="text-green-500">{profile.display_name}</span>
              </p>
            </div>
            {playback?.is_playing ? (
              <div className="px-2 py-1 text-xs text-center text-green-600 bg-green-200 border-2 border-green-600 rounded-full animate-pulse">
                Listening
              </div>
            ) : (
              <span className="px-2 py-1 text-xs text-center bg-gray-200 border-2 border-black rounded-full">
                Paused
              </span>
            )}
          </div>
          <div className="flex flex-row flex-wrap items-start justify-start pb-4 mb-4 text-lg font-bold border-b border-gray-200 md:text-xl">
            <p className="mr-4">
              Followers:{' '}
              <span className="text-purple-500">
                {profile.followers ? profile.followers.total : '0'}
              </span>
            </p>
            <p className="mr-4">
              Playlists:{' '}
              <span className="text-red-500">{playlists.length}</span>
            </p>
            <p className="mr-4">
              Total tracks:{' '}
              <span className="text-yellow-500">
                {playlists
                  .map((p) => p.tracks.total)
                  .reduce((a, b) => a + b, 0)}
              </span>
            </p>
          </div>
          <div className="flex flex-col justify-start">
            <p className="text-2xl font-bold md:text-3xl">
              Currently listening to:{' '}
            </p>
            {playback ? (
              <>
                <div className="flex flex-row items-center my-2">
                  <img
                    className="border-2 border-black rounded-lg shadow-md"
                    height={75}
                    width={75}
                    src={playback.item.album.images[0].url}
                  />
                  <div className="ml-2">
                    <p className="text-xl font-semibold md:text-2xl">
                      {playback.item.name}
                    </p>
                    <p className="text-base italic">
                      {playback.item.artists[0].name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-lg md:flex-row md:text-2xl">
                  <p>
                    Song Key:{' '}
                    <span className="mr-4 font-bold text-blue-500">
                      {keyCodeToKey(playback.features.key)}
                    </span>
                  </p>
                  <p>
                    Tempo:{' '}
                    <span className="mr-4 font-bold text-green-500">
                      {Math.round(playback.features.tempo)} bpm
                    </span>
                  </p>
                  <p>
                    Mode:{' '}
                    <span className="mr-4 font-bold text-red-500">
                      {modeKeyToMode(playback.features.mode)}
                    </span>
                  </p>
                </div>
                {playback.progress_ms ? (
                  <div>
                    <div className="flex flex-row items-center">
                      <span className="mr-2 text-base text-gray-400">
                        {secondsToMinutesSeconds(playback.progress_ms / 1000)}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-400 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (playback.progress_ms /
                                playback.item.duration_ms) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-base text-gray-400">
                        {secondsToMinutesSeconds(
                          playback.item.duration_ms / 1000
                        )}
                      </span>
                    </div>
                    {/* <VisualizerCore
                                playback={playback}
                                analysis={playbackAnalysis}
                              /> */}
                  </div>
                ) : (
                  <div></div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 my-6 text-center">
                <p className="text-2xl font-semibold text-gray-300">
                  No music playing <span className="opacity-50">💤</span>
                </p>
                <p className="text-2xl font-semibold text-gray-300">
                  ...play something to see some analysis!
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-11/12 -translate-y-20 md:-translate-y-24 md:max-w-screen-lg">
          <div
            onClick={() => router.push('/analysis')}
            className="w-full p-3 my-4 text-white transition-all bg-black border-2 border-black rounded-lg shadow-xl cursor-pointer hover:border-green-400 hover:bg-white hover:text-green-400"
          >
            <p className="text-2xl font-bold text-center md:text-3xl">
              Run full analysis →
            </p>
          </div>
        </div>
        <div className="w-11/12 -translate-y-20 md:-translate-y-24 md:max-w-screen-lg">
          <div className="flex flex-col flex-wrap items-center justify-start md:flex-row md:justify-between md:items-stretch">
            <div className="w-full p-4 my-2 bg-white border-2 border-black rounded-lg shadow-xl md:flex-1 md:mr-2 md:my-0">
              <div className="flex flex-row items-center justify-between pb-2 border-b">
                <p className="text-2xl font-bold md:text-3xl">Top artists</p>
                <select
                  className="p-1 text-xl border-2 border-black rounded-lg shadow-sm cursor-pointer"
                  onChange={(e) => {
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
                  {top.artists[artistTimeFrame]?.items.map((a, i) => {
                    return (
                      <tr className="my-2 md:text-lg" key={i}>
                        <td className="p-1 text-2xl font-bold">{i + 1}.</td>
                        <td className="p-1 m-2">
                          <img
                            className="border border-black rounded-md"
                            src={a.images[0].url}
                            style={{
                              objectFit: 'cover',
                              height: '50px',
                              width: '50px',
                            }}
                          />
                        </td>
                        <td className="p-1">
                          <p>{a.name}</p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="w-full p-4 my-2 bg-white border-2 border-black rounded-lg shadow-xl md:flex-1 md:ml-2 md:my-0">
              <div className="flex flex-row items-center justify-between pb-2 border-b">
                <p className="text-2xl font-bold md:text-3xl">Top Songs</p>
                <select
                  className="p-1 text-xl border-2 border-black rounded-lg shadow-sm cursor-pointer"
                  onChange={(e) => {
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
                  {top.tracks[trackTimeFrame]?.items.map((t, i) => {
                    return (
                      <tr className="text-base md:text-lg" key={i}>
                        <td className="p-1 text-2xl font-bold">{i + 1}.</td>
                        <td
                          className="p-1 m-2"
                          style={{
                            minWidth: '50px',
                          }}
                        >
                          <img
                            className="border border-black rounded-md"
                            src={t.album.images[0].url}
                            style={{
                              objectFit: 'cover',
                              height: '50px',
                              width: '50px',
                            }}
                          />
                        </td>
                        <td className="p-1 max-w-min">
                          <p className="mb-0 text-base">{t.name}</p>
                          <p className="text-xs italic text-gray-500 md:text-base">
                            {t.artists[0].name}
                          </p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Auth
