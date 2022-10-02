import { FC } from 'react'
import { CurrentSongWithFeatures } from '../../utils/spotify'
interface Props {
  profile: SpotifyApi.UserProfileResponse
  playback: CurrentSongWithFeatures | undefined
}
export const ProfileHeader: FC<Props> = (props) => {
  const { profile, playback } = props
  return (
    <div className="flex flex-row items-start justify-between pb-4 mb-4 border-b border-gray-200">
      <div className="flex flex-row items-center">
        <img
          className="mr-4 border-2 border-black rounded-lg shadow-md"
          height={75}
          width={75}
          src={profile.images ? profile.images[0].url : ''}
        />
        <p className="text-2xl font-extrabold md:text-4xl">
          Welcome,{' '}
          <span className="text-green-500">{profile.display_name}</span>
        </p>
      </div>
      {playback?.is_playing ? (
        <div className="px-2 py-1 text-xs text-center text-green-600 bg-green-200 border-2 border-green-600 rounded-full animate-pulse">
          Listening
        </div>
      ) : (
        <span className="px-2 py-1 text-xs text-center bg-gray-200 border-2 border-black rounded-full">
          Paused
        </span>
      )}
    </div>
  )
}
