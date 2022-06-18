import { FC } from 'react'
import { FiPlayCircle } from 'react-icons/fi'

interface Props {}

export const PlayButton: FC<Props> = (props) => {
  return (
    <button className="mx-2">
      <FiPlayCircle size={35} />
    </button>
  )
}
