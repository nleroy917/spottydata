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
    <div className="flex flex-col items-start w-full p-2 my-2 overflow-scroll">
      <div className="flex flex-row items-center justify-between w-full mb-2">
        <div>
          <button
            className="underline transition-all hover:font-bold"
            onClick={() => setShowMoreInfo(false)}
          >
            Less Info
          </button>
        </div>
        <div className="italic ">
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
      <div className="w-full my-2 border-t border-gray-300"></div>
      <p className="text-xl font-bold text-green-500">Written by:</p>
      {songWriters.length > 0 ? (
        songWriters.map((a) => <p key={a.name}>{a.name}</p>)
      ) : (
        <p>No song writers found :(</p>
      )}
      <div className="w-full my-2 border-t border-gray-300"></div>
      <p className="text-xl font-bold text-blue-500">Produced by:</p>
      {songProducers.length > 0 ? (
        songProducers.map((p) => <p key={p.name}>{p.name}</p>)
      ) : (
        <p>No producers found :(</p>
      )}
      <div className="w-full my-2 border-t border-gray-300"></div>
      <p className="text-sm italic">
        *Some song annotations might occasionally be inaccurate due to
        limitations in the genius API.
      </p>
    </div>
  )
}

export default GeniusInfo
