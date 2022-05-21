import { ResponsivePie } from '@nivo/pie'
import { FC } from 'react'
import { TopGenre } from '../..'
import { chartColors } from './colors'

interface Props {
  data: TopGenre[]
}

const GenrePieChart: FC<Props> = (props) => {
  const { data } = props
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 30, right: 30, bottom: 20, left: 30 }}
      innerRadius={0.5}
      padAngle={1}
      cornerRadius={3}
      colors={chartColors}
      activeOuterRadiusOffset={8}
      borderWidth={2}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      arcLinkLabelsDiagonalLength={10}
      arcLinkLabelsStraightLength={5}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000',
              },
            },
          ],
        },
      ]}
    />
  )
}
export default GenrePieChart
