import { FC } from 'react'
import { CurrentSongWithFeatures } from '../../utils/spotify'
import { secondsToMinutesSeconds } from '../../utils/_helpers'
interface Props {
  playback: CurrentSongWithFeatures
}
export const SongProgress: FC<Props> = (props) => {
  const { playback } = props
  return (
    <div className="flex flex-row items-center ">
      {playback.progress_ms ? (
        <>
          <span className="mr-2 text-base text-gray-400">
            {secondsToMinutesSeconds(playback.progress_ms / 1000)}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-400 h-2.5 rounded-full"
              style={{
                width: `${
                  (playback.progress_ms / playback.item.duration_ms) * 100
                }%`,
              }}
            ></div>
          </div>
          <span className="ml-2 text-base text-gray-400">
            {secondsToMinutesSeconds(playback.item.duration_ms / 1000)}
          </span>
        </>
      ) : (
        <div></div>
      )}
    </div>
  )
}
