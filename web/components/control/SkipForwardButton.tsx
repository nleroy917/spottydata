import { FC } from 'react'
import { FiSkipForward } from 'react-icons/fi'

interface Props {}

export const SkipForwardButton: FC<Props> = (props) => {
  return (
    <button className="mx-2">
      <FiSkipForward size={35} />
    </button>
  )
}
