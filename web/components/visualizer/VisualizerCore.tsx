import { FC, useState, useEffect } from 'react'
import { CurrentSongWithFeatures } from '../../utils/spotify'
import { findNearestSegment, Segment } from './_analyzer'

interface VisualizerCoreProps {
  playback: CurrentSongWithFeatures
  analysis: SpotifyApi.AudioAnalysisResponse | undefined
}

export const VisualizerCore: FC<VisualizerCoreProps> = (props) => {
  // const [currentSegment, setCurrentSegment] = useState<Segment | undefined>(() => {
  //     if(props.analysis) {
  //        return findNearestSegment(props.playback.progress_ms, props.analysis.segments
  //     }
  // }
  // )

  useEffect(() => {}, [props.playback])

  return (
    <div>
      {/* {
            JSON.stringify(
                {
                    playhead: props.playback.progress_ms,
                    nearestSegment: currentSegment
                }, null, 2
            )
        } */}
    </div>
  )
}
