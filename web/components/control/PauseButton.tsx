import { FC } from 'react'
import { FiPauseCircle } from 'react-icons/fi'

interface Props {}

export const PauseButton: FC<Props> = (props) => {
  return (
    <button className="mx-2">
      <FiPauseCircle size={35} />
    </button>
  )
}
