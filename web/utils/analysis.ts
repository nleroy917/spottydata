export interface PlaylistFeatureAnalysisDatapoint {
  id: string
  volume: number
  group: string
  [featureSelection: string]: number | string
}

export const mapFeatureData = (
  analysis: Spottydata.ProfileAnalysis,
  playlistSelection: string[],
  featureSelection: string
) => {
  // start new array
  let data: PlaylistFeatureAnalysisDatapoint[] = []

  // loop through each playlist selected
  playlistSelection.forEach((p) => {
    // append data to the new array
    // by mapping datapoints inside the
    // plalist to conform to the data strcuture
    // required by the nivo swarm plot.
    data = data.concat(
      analysis.feature_data[p].map((dp) => {
        return {
          id: `${dp.track.name}`,
          // we need to check for loudness which is
          // given as negative values... and the swarm plot
          // can't handle negative values
          [featureSelection]:
            featureSelection === 'loudness'
              ? Math.abs(dp[featureSelection])
              : dp[featureSelection],
          volume: 6,
          group: p,
        }
      })
    )
  })
  return data
}
