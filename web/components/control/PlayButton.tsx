import { FC } from 'react'
import { HiPlay } from 'react-icons/hi'

interface Props {}

export const PlayButton: FC<Props> = (props) => {
  return (
    <button className="mx-2 hover:text-gray-800">
      <HiPlay className="w-10 h-10 transition-all hover:w-11 hover:h-11" />
    </button>
  )
}
