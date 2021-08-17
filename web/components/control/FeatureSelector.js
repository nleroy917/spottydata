export const FeatureSelector = ({setFeatureSelection}) => {
    return (
        <select 
          className="text-sm md:text-base px-1 py-2 mr-2 border border-black rounded-lg cursor-pointer hover:border-gray-300 shadow-sm"
          onChange={e => setFeatureSelection(e.target.value)}
        >
          {
            [
              "Acousticness", "Danceability", "Energy", 
              "Instrumentalness", "Liveness", "Loudness", 
              "Speechiness", "Tempo", "Valence"
            ].map((f, i) => <option key={i} value={f.toLowerCase()}>{f}</option>)
          }
        </select>
    )
}