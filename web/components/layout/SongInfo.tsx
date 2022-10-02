import { FC } from 'react'
import { CurrentSongWithFeatures } from '../../utils/spotify'

interface Props {
  playback: CurrentSongWithFeatures
}
export const SongInfo: FC<Props> = (props) => {
  const { playback } = props
  return (
    <div className="flex flex-row items-center my-2">
      <img
        className="border-2 border-black rounded-lg shadow-md"
        height={75}
        width={75}
        src={playback.item.album.images[0].url}
      />
      <div className="ml-2">
        <p className="text-xl font-semibold md:text-2xl">
          {playback.item.name}
        </p>
        <p className="text-base italic">{playback.item.artists[0].name}</p>
      </div>
    </div>
  )
}
