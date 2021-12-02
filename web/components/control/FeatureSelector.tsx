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
          className="w-full px-1 py-2 my-1 text-sm border border-black rounded-lg shadow-sm cursor-pointer md:mr-2 md:w-min md:text-base hover:border-gray-300"
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