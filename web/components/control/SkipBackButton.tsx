import { FC } from 'react'
import { HiRewind } from 'react-icons/hi'

interface Props {}

export const SkipBackButton: FC<Props> = (props) => {
  return (
    <button className="mx-2 transition-all hover:text-gray-800">
      <HiRewind className="w-10 h-10 transition-all hover:w-11 hover:h-11" />
    </button>
  )
}
