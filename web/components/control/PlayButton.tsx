import axios from 'axios'
import { FC } from 'react'
import { HiPlay } from 'react-icons/hi'
import { CurrentSongWithFeatures } from '../../utils/spotify'

interface Props {
  authData: Spottydata.AuthData
  playback: CurrentSongWithFeatures
}

export const PlayButton: FC<Props> = (props) => {
  const { authData, playback } = props
  const startPlayback = () => {
    axios.put(
      `/api/start-playback?access-token=${authData.access_token}&device_id=${playback.device.id}`
    )
  }
  return (
    <button className="mx-2 hover:text-gray-800" onClick={startPlayback}>
      <HiPlay className="w-10 h-10 transition-all hover:w-11 hover:h-11" />
    </button>
  )
}
