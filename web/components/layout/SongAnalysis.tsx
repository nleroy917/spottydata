import { FC } from 'react'
import {
  CurrentSongWithFeatures,
  keyCodeToKey,
  modeKeyToMode,
} from '../../utils/spotify'

interface Props {
  playback: CurrentSongWithFeatures
}

export const SongAnalysis: FC<Props> = (props) => {
  const { playback } = props
  return (
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
  )
}
