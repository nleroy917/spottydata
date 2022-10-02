import type { NextApiRequest, NextApiResponse } from 'next'
import { SpotifyApi } from './_connector'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    SpotifyApi.setAccessToken(req.query['access-token'] as string)
    const device_id = req.query['device_id']
    return new Promise<void>((resolve) => {
      SpotifyApi.pause({
        device_id: device_id,
      }).then((qres) => {
        res.status(200).json(qres.body)
        res.end()
        return resolve()
      })
    })
  } else {
    res.status(405)
  }
}
