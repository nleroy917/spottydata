import { ResponsiveChord } from '@nivo/chord'
const ArtistNetwork = ({collaborationMatrix, artistNames}) => {
    return (
        <ResponsiveChord
            matrix={collaborationMatrix}
            keys={artistNames}
            margin={{ top: 30, right: 10, bottom: 45, left: 10 }}
            padAngle={0.02}
            innerRadiusRatio={0.96}
            innerRadiusOffset={0.02}
            arcOpacity={1}
            arcBorderWidth={1}
            arcBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
            ribbonOpacity={0.5}
            ribbonBorderWidth={1}
            ribbonBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
            enableLabel={false}
            label="id"
            labelOffset={12}
            labelRotation={-120}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
            colors={{ scheme: 'nivo' }}
            isInteractive={true}
            arcHoverOpacity={1}
            arcHoverOthersOpacity={0.25}
            ribbonHoverOpacity={0.75}
            ribbonHoverOthersOpacity={0.25}
            animate={true}
            motionStiffness={90}
            motionDamping={7}
        />
    )
}

export default ArtistNetwork