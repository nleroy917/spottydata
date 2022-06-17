import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { CurrentSongWithFeatures } from './spotify'

const GENIUS_BASE = 'https://api.genius.com'

const _generateHeaders = () => {
  return {
    Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN,
  }
}

/**
 * Given the spotify playback object, we can search for
 * a song id on genius.
 * @param playback playback object from spotify
 * @param currentSongId current genius song id
 * @param dataSetter setter for song id
 */
export const searchForSongId = (
  playback: CurrentSongWithFeatures,
  currentSongId: number | undefined,
  dataSetter: Dispatch<SetStateAction<number | undefined>>
) => {
  interface GeniusResponse {
    data: GeniusApi.SearchResponse
  }
  const query = `${playback.item.name} ${playback.item.artists[0].name}`
  axios
    .get(
      `${GENIUS_BASE}/search?q=${query}&access_token=${process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN}`
    )
    .then((res: GeniusResponse) => {
      // only set if the song id is not defifed yet or unchanged
      if (res.data.response.hits.length > 0) {
        const songId = res.data.response.hits[0].result.id
        if (currentSongId === undefined || currentSongId !== songId) {
          dataSetter(songId)
        }
      }
    })
}

/**
 * Once we have searched for and obtained a song id, we
 * can use it to get genius annotations about the song.
 * @param songId the id of the song
 * @param dataSetter state setter
 */
export const getSongData = (
  songId: number,
  dataSetter: Dispatch<SetStateAction<GeniusApi.SongResponse | undefined>>
) => {
  interface GeniusResponse {
    data: GeniusApi.SongResponse
  }
  axios
    .get(
      `${GENIUS_BASE}/songs/${songId}?text_format=html&access_token=${process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN}`
    )
    .then((res: GeniusResponse) => dataSetter(res.data))
}
