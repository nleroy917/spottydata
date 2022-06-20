import { FC } from 'react'
import { PauseButton } from './PauseButton'
import { PlayButton } from './PlayButton'
import { SkipBackButton } from './SkipBackButton'
import { SkipForwardButton } from './SkipForwardButton'

interface Props {
  isPlaying: boolean
}

export const PlaybackController: FC<Props> = (props) => {
  const { isPlaying } = props
  return (
    <div className="flex flex-row items-center justify-center h-12 mt-3">
      <div className="flex flex-row items-center justify-center w-16">
        <SkipBackButton />
      </div>
      <div className="flex flex-row items-center justify-center w-16">
        {isPlaying ? <PauseButton /> : <PlayButton />}
      </div>
      <div className="flex flex-row items-center justify-center w-16">
        <SkipForwardButton />
      </div>
    </div>
  )
}
