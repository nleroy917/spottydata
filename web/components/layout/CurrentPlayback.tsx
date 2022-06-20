import { FC, useState } from 'react'
import { secondsToMinutesSeconds } from '../../utils/_helpers'
import { PlaybackController } from '../control/PlaybackController'

// helpers
import {
  keyCodeToKey,
  modeKeyToMode,
  CurrentSongWithFeatures,
} from '../../utils/spotify'
import GeniusInfo from '../genius/GeniusInfo'

interface Props {
  playback: CurrentSongWithFeatures
  songWriters: GeniusApi.Artist[]
  songProducers: GeniusApi.Artist[]
  songDescription: string
}

export const CurrentPlayback: FC<Props> = (props) => {
  const { playback, songDescription, songProducers, songWriters } = props

  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)

  return (
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
          <p className="text-base italic">{playback.item.artists[0].name}</p>
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
                    (playback.progress_ms / playback.item.duration_ms) * 100
                  }%`,
                }}
              ></div>
            </div>
            <span className="ml-2 text-base text-gray-400">
              {secondsToMinutesSeconds(playback.item.duration_ms / 1000)}
            </span>
          </div>
          <PlaybackController isPlaying={playback.is_playing} />
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
