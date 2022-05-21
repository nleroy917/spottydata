import { FC } from 'react'
import { Dispatch, SetStateAction } from 'react'
import Select, { Theme } from 'react-select'

interface Props {
  defaultSelection: { value: string; label: string }[]
  setPlaylistSelection: Dispatch<SetStateAction<string[] | undefined>>
  options: { label: string; value: string }[]
}

export const PlaylistSelector: FC<Props> = (props) => {
  const { defaultSelection, setPlaylistSelection, options } = props

  return (
    <Select
      isMulti={true}
      // override styling of
      // multiselect component
      // to be in line with the
      // tailwind css styling
      theme={(theme: Theme): Theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: '#6EE7B7',
          neutral20: 'black',
          primary: 'black',
          dangerLight: '#6EE7B7',
          danger: '#059669',
        },
      })}
      className="w-full"
      defaultValue={defaultSelection}
      onChange={(s) => {
        if (s.length === 0) {
          // do nothing
        } else if (s.length > 5) {
          alert('Maximum number of playlists is 5')
        } else {
          setPlaylistSelection(s.map((s) => s.label))
        }
      }}
      options={options}
    />
  )
}
