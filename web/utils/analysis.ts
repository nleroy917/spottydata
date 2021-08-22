import { ProfileAnalysis } from ".."

export interface PlaylistFeatureAnalysisDatapoint {
  id: string,
  volume: number,
  group: string,
  [featureSelection: string]: number | string
}

export const mapFeatureData = (
  analysis: ProfileAnalysis, 
  playlistSelection: string[], 
  featureSelection: string
) => {
    // start new array
    let data: PlaylistFeatureAnalysisDatapoint[] = []

    // loop through each playlist selected
    playlistSelection.forEach(p => {
        
      // append data to the new array
      // by mapping datapoints inside the
      // plalist to conform to the data strcuture
      // required by the nivo swarm plot.
      data = data.concat(analysis.feature_data[p].map(dp => {
        return {
          id: `${dp.track.name}`,
          [featureSelection]: dp[featureSelection],
          volume: 6,
          group: p
        }
      }))
    })
    return data
}