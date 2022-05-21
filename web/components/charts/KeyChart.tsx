import { ResponsiveBar } from '@nivo/bar'
import { FC } from 'react'
import { KeyCounts } from '../..'
import { chartColors } from './colors'

interface Props {
  data: {
    Key: string
    Major: number
    Minor: number
  }[]
}

const KeyChart: FC<Props> = (props) => {
  const { data } = props
  return (
    <ResponsiveBar
      data={data}
      indexBy="Key"
      keys={['Major', 'Minor']}
      margin={{ top: 30, right: 25, bottom: 75, left: 50 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={chartColors}
      borderWidth={2}
      borderRadius={2}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Key',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Count',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 30,
          translateY: 65,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  )
}
export default KeyChart
