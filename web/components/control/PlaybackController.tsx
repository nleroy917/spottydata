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
    <div className="flex flex-row items-center justify-center mt-3">
      <SkipBackButton />
      {isPlaying ? <PauseButton /> : <PlayButton />}
      <SkipForwardButton />
    </div>
  )
}
