import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { CurrentSongWithFeatures } from './spotify'

const GENIUS_BASE = 'https://api.genius.com'

const _generateHeaders = () => {
  return {
    Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN,
  }
}

export const searchForSongId = (
  playback: CurrentSongWithFeatures,
  currentSongId: string | undefined,
  dataSetter: Dispatch<SetStateAction<string | undefined>>
) => {
  const query = `${playback.item.name} ${playback.item.artists[0].name}`
  axios
    .get(
      `${GENIUS_BASE}/search?q=${query}&access_token=${process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN}`
    )
    .then((res) => {
      // only set if the song id is not deinfed yet or unchanged
      if (res.data.response.hits.length > 0) {
        if (
          currentSongId === undefined ||
          currentSongId !== res.data.response.hits[0].result.id
        ) {
          dataSetter(res.data.response.hits[0].result.id)
        }
      }
    })
}

export const getSongData = (
  songId: string,
  dataSetter: Dispatch<SetStateAction<object>>
) => {
  axios
    .get(
      `${GENIUS_BASE}/songs/${songId}?text_format=html&access_token=${process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN}`
    )
    .then((res) => dataSetter(res.data))
}
