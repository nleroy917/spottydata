import { ResponsiveSwarmPlotCanvas } from '@nivo/swarmplot'
import { FC } from 'react'
import { PlaylistFeatureAnalysisDatapoint } from '../../utils/analysis'
import { chartColors } from './colors'

function _generateScale(feature: string) {
    let scale
    switch(feature) {
        case "tempo":
            scale = { 
                type: 'linear', 
                min: 0, 
                max: 200, 
                reverse: false 
            }
            break
        case "loudness":
            scale = { 
                type: 'linear', 
                min: 0, 
                max: 60, 
                reverse: false 
            }
            break
        default:
            scale = { 
                type: 'linear', 
                min: 0, 
                max: 200, 
                reverse: false 
            }
    }
    return scale
}

interface Props {
    data: PlaylistFeatureAnalysisDatapoint[],
    feature: string,
    playlists: string[]
}

const PlaylistFeatures: FC<Props> = (props) => {
    const { data, feature, playlists } = props
    return (
        <ResponsiveSwarmPlotCanvas
            data={data}
            groups={playlists}
            colors={chartColors}
            value={feature}
            valueFormat=".2f"
            size={{ key: 'volume', values: [ 4, 20 ], sizes: [ 6, 20 ] }}
            forceStrength={4}
            useMesh={true}
            enableGridX={true}
            enableGridY={true}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ],
                    [
                        'opacity',
                        0.5
                    ]
                ]
            }}
            margin={{ top: 30, right: 30, bottom: 90, left: 70 }}
            axisLeft={{
                tickSize: 10,
                tickPadding: 5,
                tickRotation: 0,
                legend: feature,
                legendPosition: 'middle',
                legendOffset: -50,
            }}
        />
    )
}
export default PlaylistFeatures