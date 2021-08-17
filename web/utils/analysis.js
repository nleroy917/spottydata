export const mapFeatureData = (analysis, playlistSelection, featureSelection) => {
    // start new array
    let data = []

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