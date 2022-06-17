import { Dispatch, SetStateAction } from 'react'
import { FC } from 'react'
import { Artist } from '../..'

interface Props {
  setShowMoreInfo: Dispatch<SetStateAction<boolean>>
  songDescription: string
  songWriters: Artist[]
  songProducers: Artist[]
}

const GeniusInfo: FC<Props> = (props) => {
  const { songDescription, songWriters, songProducers, setShowMoreInfo } = props
  return (
    <div className="flex flex-col items-start w-full p-4 my-2 overflow-scroll border border-black rounded-lg shadow-md align-start">
      <button className="mb-2 underline" onClick={() => setShowMoreInfo(false)}>
        Close
      </button>
      <div className="mb-4 italic">
        Powered by{' '}
        <span className="p-1 mx-1 not-italic font-bold bg-yellow-300 border-2 border-black rounded-md">
          Genius
        </span>
      </div>
      <p className="text-lg font-bold text-red-500">Song Description:</p>
      <div
        className="mb-1"
        dangerouslySetInnerHTML={{
          __html: songDescription,
        }}
      />
      <p className="text-lg font-bold text-green-500">Written by:</p>
      {songWriters.length > 0 ? (
        songWriters.map((a) => <p key={a.name}>{a.name}</p>)
      ) : (
        <p>No song writers found :(</p>
      )}
      <p className="text-lg font-bold text-blue-500">Produced by:</p>
      {songProducers.length > 0 ? (
        songProducers.map((p) => <p key={p.name}>{p.name}</p>)
      ) : (
        <p>No producers found :(</p>
      )}
    </div>
  )
}

export default GeniusInfo
