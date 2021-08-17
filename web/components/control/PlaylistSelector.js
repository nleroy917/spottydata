import Select from 'react-select';

export const PlaylistSelector = ({defaultSelection, setPlaylistSelection, options}) => {
    return (
        <Select
          isMulti={true}
          // override styling of
          // multiselect component
          // to be in line with the
          // tailwind css styling
          theme={theme => ({
            ...theme,
            borderRadius: '0.5rem',
            borderColor: 'black',
            colors: {
              ...theme.colors,
              primary25: '#6EE7B7',
              neutral20: 'black',
              primary: 'black',
              dangerLight: '#6EE7B7',
              danger: '#059669'
            },
            multiValueLabel: (styles) => ({
              ...styles,
              maxWidth: '10px'
            })
          })}
          className="w-full"
          defaultValue={defaultSelection}
          onChange={(s) => {
            if(s.length === 0) {
              // do nothing
            } else if(s.length > 5) {
              alert('Maximum number of playlists is 5')
            }
            else {
              setPlaylistSelection(s.map(s => s.label))
            }
          }}
          options={options}
        />
    )
}