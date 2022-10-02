import { FC } from 'react'
import { CurrentSongWithFeatures } from '../../utils/spotify'
import { PauseButton } from './PauseButton'
import { PlayButton } from './PlayButton'
import { SkipBackButton } from './SkipBackButton'
import { SkipForwardButton } from './SkipForwardButton'

interface Props {
  isPlaying: boolean
  authData: Spottydata.AuthData
  playback: CurrentSongWithFeatures
}

export const PlaybackController: FC<Props> = (props) => {
  const { isPlaying, authData, playback } = props
  return (
    <div className="flex flex-row items-center justify-center h-12 mt-3">
      <div className="flex flex-row items-center justify-center w-16">
        <SkipBackButton authData={authData} playback={playback} />
      </div>
      <div className="flex flex-row items-center justify-center w-16">
        {isPlaying ? (
          <PauseButton authData={authData} playback={playback} />
        ) : (
          <PlayButton authData={authData} playback={playback} />
        )}
      </div>
      <div className="flex flex-row items-center justify-center w-16">
        <SkipForwardButton authData={authData} playback={playback} />
      </div>
    </div>
  )
}
