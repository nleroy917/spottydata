import { ResponsiveSwarmPlotCanvas } from '@nivo/swarmplot'
import { chartColors } from './colors'

const PlaylistFeatures = ({ data, feature, playlists }) => {
    return (
        <ResponsiveSwarmPlotCanvas
            data={data}
            groups={playlists}
            colors={chartColors}
            identity="id"
            value={feature}
            valueFormat=".2f"
            valueScale={{ 
                type: 'linear', 
                min: 0, 
                max: feature === "tempo" ? 200 : 1, 
                reverse: false 
            }}
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
            margin={{ top: 30, right: 30, bottom: 50, left: 70 }}
            axisLeft={{
                orient: 'left',
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