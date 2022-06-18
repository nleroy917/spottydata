import { FC } from 'react'
import { FiSkipBack } from 'react-icons/fi'

interface Props {}

export const SkipBackButton: FC<Props> = (props) => {
  return (
    <button className="mx-2">
      <FiSkipBack size={35} />
    </button>
  )
}
