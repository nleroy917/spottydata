import { Dispatch, SetStateAction } from 'react'
import { FC } from 'react'

interface Props {
  setShowMoreInfo: Dispatch<SetStateAction<boolean>>
  songDescription: string
  songWriters: GeniusApi.Artist[]
  songProducers: GeniusApi.Artist[]
}

const GeniusInfo: FC<Props> = (props) => {
  const { songDescription, songWriters, songProducers, setShowMoreInfo } = props
  return (
    <div className="flex flex-col items-start w-full p-4 my-2 overflow-scroll border-t border-b border-gray-300">
      <div className="flex flex-row items-center justify-between w-full">
        <div>
          <button
            className="px-2 mb-2 text-white bg-black border-2 border-black rounded-md hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
            onClick={() => setShowMoreInfo(false)}
          >
            Less Info
          </button>
        </div>
        <div className="mb-4 italic">
          Powered by{' '}
          <span className="px-1 mx-1 not-italic font-bold bg-yellow-300 border-2 border-black rounded-md">
            Genius*
          </span>
        </div>
      </div>
      <p className="text-xl font-bold text-red-500">Song Description:</p>
      <div
        className="mb-1"
        dangerouslySetInnerHTML={{
          __html: songDescription,
        }}
      />
      <p className="text-xl font-bold text-green-500">Written by:</p>
      {songWriters.length > 0 ? (
        songWriters.map((a) => <p key={a.name}>{a.name}</p>)
      ) : (
        <p>No song writers found :(</p>
      )}
      <p className="text-xl font-bold text-blue-500">Produced by:</p>
      {songProducers.length > 0 ? (
        songProducers.map((p) => <p key={p.name}>{p.name}</p>)
      ) : (
        <p>No producers found :(</p>
      )}
      <div className="mt-2 text-sm font-bold border-t border-gray-300">
        *Song annotations might occasionally be wrong or nonsensicle due to the
        way that spottydata finds and pulls the information.
      </div>
    </div>
  )
}

export default GeniusInfo
