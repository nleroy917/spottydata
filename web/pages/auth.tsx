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
  isFetchingTopData,
  CurrentSongWithFeatures,
  currentPlaybackAnalysis,
} from '../utils/spotify'

import { Loading } from '../components/loading'

// telemetry
import * as ga from '../utils/ga'

import { Error, Header, SEO } from '../components/layout'
import { ErrorObject } from '../components/layout/Error'
import { useInterval } from '../utils/useInterval'
import { secondsToMinutesSeconds } from '../utils/_helpers'
import TopArtistsAndTracks from '../components/charts/TopArtistsAndTracks'
import { getSongData, searchForSongId } from '../utils/genius'
import GeniusInfo from '../components/genius/GeniusInfo'

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
  const [authData, setAuthData] = useState<Spottydata.AuthData>(
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
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)
  const [geniusSongId, setGeniusSongId] = useState<number | undefined>(
    undefined
  )
  const [geniusSongData, setGeniusSongData] = useState<
    GeniusApi.SongResponse | undefined
  >(undefined)
  const [songDescription, setSongDescription] = useState<string>('')
  const [songWriters, setSongWriters] = useState<GeniusApi.Artist[]>([])
  const [songProducers, setSongProducers] = useState<GeniusApi.Artist[]>([])

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

    // if we have playback, search for a genius song id
    if (playback) {
      searchForSongId(playback, geniusSongId, setGeniusSongId)
    }
  }, 1000)

  /**
   * Drive access token fetching
   */
  useEffect(() => {
    if (authCode !== undefined && authData === undefined) {
      setLoadingMessage('Authenticating...')
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

  /**
   * Song ID watcher
   */
  useEffect(() => {
    if (geniusSongId) {
      getSongData(geniusSongId, setGeniusSongData)
    }
  }, [geniusSongId])

  /**
   * Change genius annotations when the id changes
   */
  useEffect(() => {
    if (
      geniusSongData !== undefined &&
      Object.keys(geniusSongData).length > 0
    ) {
      const desc = geniusSongData.response.song.description.html
      if (desc === '<p>?</p>') {
        setSongDescription(
          "<p className='font-italic'>No Genius information found :(</p>"
        )
      } else {
        setSongDescription(desc)
      }

      const writers = geniusSongData.response.song.writer_artists
      setSongWriters(writers)

      const producers = geniusSongData.response.song.producer_artists
      setSongProducers(producers)
    }
  }, [geniusSongData])

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
    isFetchingTopData(top) ||
    top === undefined
  ) {
    // render a spinner
    // console.log(isFetchingTopData(top))
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SEO title="Loading..." />
        <Loading message={loadingMessage} />
      </div>
    )
  } else {
    // render profile page
    //console.log(isFetchingTopData(top))
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
        <div className="w-11/12 p-4 mx-4 -translate-y-20 bg-white border-2 border-black rounded-lg shadow-xl md:-translate-y-26 md:max-w-screen-lg md:mb-4">
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
                    <div className="flex flex-row items-center ">
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
                    <div className="flex flex-col items-center mt-4">
                      {!showMoreInfo ? (
                        <button
                          onClick={() => setShowMoreInfo(!showMoreInfo)}
                          className="bg-black text-white shadow-sm hover:shadow-md w-24 px-2 py-1 border-2 border-black rounded-lg hover:-translate-y-0.5 transition-all"
                        >
                          More Info
                        </button>
                      ) : (
                        <div></div>
                      )}

                      {showMoreInfo ? (
                        <GeniusInfo
                          setShowMoreInfo={setShowMoreInfo}
                          songWriters={songWriters}
                          songProducers={songProducers}
                          songDescription={songDescription}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
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
        <TopArtistsAndTracks
          setArtistTimeFrame={setArtistTimeFrame}
          setTrackTimeFrame={setTrackTimeFrame}
          artistTimeFrame={artistTimeFrame}
          trackTimeFrame={trackTimeFrame}
          top={top}
        />
      </div>
    )
  }
}

export default Auth
