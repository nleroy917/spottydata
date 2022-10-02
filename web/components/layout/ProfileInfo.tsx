import { FC } from 'react'

interface Props {
  profile: SpotifyApi.UserObjectPublic
  playlists: SpotifyApi.PlaylistObjectFull[]
}

export const ProfileInfo: FC<Props> = (props) => {
  const { profile, playlists } = props
  return (
    <div className="flex flex-row flex-wrap items-start justify-start pb-4 mb-4 text-lg font-bold border-b border-gray-200 md:text-xl">
      <p className="mr-4">
        Followers:{' '}
        <span className="text-purple-500">
          {profile.followers ? profile.followers.total : '0'}
        </span>
      </p>
      <p className="mr-4">
        Playlists: <span className="text-red-500">{playlists.length}</span>
      </p>
      <p className="mr-4">
        Total tracks:{' '}
        <span className="text-yellow-500">
          {playlists.map((p) => p.tracks.total).reduce((a, b) => a + b, 0)}
        </span>
      </p>
    </div>
  )
}
