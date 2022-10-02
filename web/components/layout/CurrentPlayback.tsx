import { FC, useState } from 'react'
import { PlaybackController } from '../control/PlaybackController'

// helpers
import { CurrentSongWithFeatures } from '../../utils/spotify'
import GeniusInfo from '../genius/GeniusInfo'
import { SongAnalysis } from './SongAnalysis'
import { SongInfo } from './SongInfo'
import { SongProgress } from './SongProgress'

interface Props {
  playback: CurrentSongWithFeatures
  songWriters: GeniusApi.Artist[]
  songProducers: GeniusApi.Artist[]
  songDescription: string
  authData: Spottydata.AuthData
}

export const CurrentPlayback: FC<Props> = (props) => {
  const { playback, songDescription, songProducers, songWriters, authData } =
    props

  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)

  return (
    <>
      <SongInfo playback={playback} />
      <SongAnalysis playback={playback} />
      {playback.progress_ms ? (
        <div>
          <SongProgress playback={playback} />
          <PlaybackController
            playback={playback}
            isPlaying={playback.is_playing}
            authData={authData}
          />
          <div className="flex flex-col items-center mt-4">
            {!showMoreInfo ? (
              <button
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="underline transition-all hover:font-bold"
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
  )
}
