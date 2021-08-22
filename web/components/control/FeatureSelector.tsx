// google analytics
import * as ga from '../../utils/ga'
import { Dispatch, SetStateAction, FC } from 'react';

// define props with type bindings
interface Props {
  setFeatureSelection: Dispatch<SetStateAction<string>>
}

export const FeatureSelector: FC<Props> = (props) => {
    return (
        <select 
          className="text-sm md:text-base px-1 py-2 mr-2 border border-black rounded-lg cursor-pointer hover:border-gray-300 shadow-sm"
          onChange={e => {
            // telemetry
            ga.event({
              category: 'analysis',
              action: 'click',
              label: 'FeatureSelector',
              value: e.target.value
            })
           props.setFeatureSelection(e.target.value) 
          }}
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