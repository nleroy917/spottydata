import { ResponsiveCalendar } from '@nivo/calendar'
import { chartColors } from './colors'

const SongCalendar = ({ data }) => {
    return (
      <ResponsiveCalendar
          data={data}
          from="2020-01-01"
          to="2021-09-09"
          emptyColor="#eeeeee"
          colors={chartColors}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          legends={[
              {
                  anchor: 'bottom-right',
                  direction: 'row',
                  translateY: 36,
                  itemCount: 4,
                  itemWidth: 42,
                  itemHeight: 36,
                  itemsSpacing: 14,
                  itemDirection: 'right-to-left'
              }
          ]}
      />
    )
}
export default SongCalendar
