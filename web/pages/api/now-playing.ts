import type { NextApiRequest, NextApiResponse } from 'next'
import { SpotifyApi } from './_connector'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    SpotifyApi.setAccessToken(req.query['access-token'] as string)
    return new Promise<void>((resolve) => {
      SpotifyApi.getMyCurrentPlayingTrack().then((qres) => {
        res.status(200).json(qres.body)
        res.end()
        return resolve()
      })
    })
  } else {
    res.status(405)
  }
}
