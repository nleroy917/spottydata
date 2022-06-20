import { FC } from 'react'
import { HiFastForward } from 'react-icons/hi'

interface Props {}

export const SkipForwardButton: FC<Props> = (props) => {
  return (
    <button className="mx-2 transition-all hover:text-gray-800">
      <HiFastForward className="w-10 h-10 transition-all hover:w-11 hover:h-11" />
    </button>
  )
}
