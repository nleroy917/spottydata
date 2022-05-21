import { Dispatch, FC, SetStateAction } from 'react'
import { TopData } from '../../utils/spotify'

interface PageProps {
  setArtistTimeFrame: Dispatch<SetStateAction<string>>
  setTrackTimeFrame: Dispatch<SetStateAction<string>>
  artistTimeFrame: string
  trackTimeFrame: string
  top: TopData
}

const TopArtistsAndTracks: FC<PageProps> = (props) => {
  const {
    setArtistTimeFrame,
    setTrackTimeFrame,
    top,
    artistTimeFrame,
    trackTimeFrame,
  } = props
  return (
    <div className="w-11/12 -translate-y-20 md:-translate-y-24 md:max-w-screen-lg">
      <div className="flex flex-col flex-wrap items-center justify-start md:flex-row md:justify-between md:items-stretch">
        <div className="w-full p-4 my-2 bg-white border-2 border-black rounded-lg shadow-xl md:flex-1 md:mr-2 md:my-0">
          <div className="flex flex-row items-center justify-between pb-2 border-b">
            <p className="text-2xl font-bold md:text-3xl">Top artists</p>
            <select
              className="p-1 text-xl border-2 border-black rounded-lg shadow-sm cursor-pointer"
              onChange={(e) => {
                setArtistTimeFrame(e.target.value)
              }}
            >
              <option value="short_term">4 weeks</option>
              <option value="medium_term">6 months</option>
              <option value="long_term">All time</option>
            </select>
          </div>
          <div className="flex flex-col">
            {top.artists[artistTimeFrame]?.items.map((a, i) => (
              <div
                className="flex flex-row items-center justify-start m-1"
                key={i}
              >
                <span className="w-12 p-1 text-2xl font-bold">{i + 1}.</span>
                <a href={a.external_urls.spotify}>
                  <img
                    src={a.images[0].url}
                    alt={`Picture of ${a.name}`}
                    className="border border-black rounded h-14 hover:border-green-500"
                  />
                </a>
                <div className="mx-2 overflow-hidden truncate">
                  <span className="text-lg">{a.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full p-4 my-2 bg-white border-2 border-black rounded-lg shadow-xl md:flex-1 md:ml-2 md:my-0">
          <div className="flex flex-row items-center justify-between pb-2 border-b">
            <p className="text-2xl font-bold md:text-3xl">Top Songs</p>
            <select
              className="p-1 text-xl border-2 border-black rounded-lg shadow-sm cursor-pointer"
              onChange={(e) => {
                setTrackTimeFrame(e.target.value)
              }}
            >
              <option value="short_term">4 weeks</option>
              <option value="medium_term">6 months</option>
              <option value="long_term">All time</option>
            </select>
          </div>
          <div className="flex flex-col">
            {top.tracks[trackTimeFrame]?.items.map((t, i) => (
              <div
                className="flex flex-row items-center justify-start m-1"
                key={i}
              >
                <span className="w-12 p-1 text-2xl font-bold">{i + 1}.</span>
                <a href={t.external_urls.spotify}>
                  <img
                    src={t.album.images[0].url}
                    alt={`Album art for ${t.name} by ${t.artists[0].name}`}
                    className="border border-black rounded h-14 hover:border-green-500"
                  />
                </a>
                <div className="flex flex-col items-start mx-2 overflow-hidden truncate">
                  <span className="text-lg">{t.name}</span>
                  <span className="italic text-gray-500">
                    {t.artists[0].name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default TopArtistsAndTracks
