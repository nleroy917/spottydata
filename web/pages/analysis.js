import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import { Loading } from '../components/loading';
import { Error } from '../components/error';
import { useRouter } from 'next/router';
import { useUserAgent as parseUserAgent } from "next-useragent";
import { Header } from '../components/header';
import { fetchProfile } from '../utils/spotify';
import SEO from '../components/seo';

// import layouts
import {
  ChartCard
} from '../components/layout'

// import charts
import { 
    ArtistNetwork,
    GenrePieChart,
    KeyChart,
    PlaylistFeatures,
    SongCalendar,
    toolTips
} from '../components/charts';

import { test_data } from '../data/test_analysis_data'
import ToolTip from '../components/tooltip';
import Select from 'react-select';;

export default function Analysis(props) {

    // let ua;
    // if (props.uaString) {
    //   ua = parseUserAgent(props.uaString)
    // } else {
    //   ua = useUserAgent(window.navigator.userAgent)
    // }

    //console.log(ua)

    const router = useRouter()
    const [cookies, setCookie, ] = useCookies(['spottydata-credentials']);

    const [authData, setAuthData] = useState(cookies['authData'])
    const [profile, setProfile] = useState(undefined)
    const [analysis, setAnalysis] = useState(undefined)
    const [error, setError] = useState(undefined)

    // state for playlist feature plot
    const [playlistSelection, setPlaylistSelection] = useState(undefined)
    const [featureSelection, setFeatureSelection] = useState("valence")

    const mapFeatureData = (playlistSelection) => {
      let data = []
      playlistSelection.forEach(p => {
        data = data.concat(analysis.feature_data[p].map((dp, i) => {
          return {
            id: `${dp.track.name}`,
            [featureSelection]: dp[featureSelection],
            volume: 6,
            group: p
          }
        }))
      })
      return data
    }

    useEffect(() => {
        if(authData !== undefined && process.env.NODE_ENV !== 'development') {
            let hdrs = {
                access_token: authData['access_token']
            }
            axios.get(`${process.env.NEXT_PUBLIC_FUNCTIONS_BASE}/analyze_profile`, {headers: hdrs})
            .then(res => {
                setAnalysis(res.data)
            })
            .catch(err => {
                setError(err)
            })
        } else {
            setAnalysis(test_data)
        }
        if(authData !== undefined) {
            fetchProfile(
                authData,
                setProfile,
                setError,
                setCookie
            )
        }
    }, [authData])
    
    if(error) {
        return <Error error={error} />
    } else if (authData === undefined || analysis === undefined || profile === undefined) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
              <Loading message="Analyzing profile..." />
            </div>
        )
    } else {
        return (
            <div className="bg-white min-h-screen ">
            <SEO title={`${profile.display_name} | Analysis`} />
             <div className="w-full bg-gradient flex flex-col items-center justify-start border-b border-black h-56">
              <div className="w-11/12 md:max-w-screen-xl">
                <div className="flex flex-row justify-between items-start w-full py-2">
                    <button
                        className="rounded-lg bg-black font-bold text-white text-bold text-sm md:text-base py-1 md:py-2 px-2 md:px-4 hover:bg-white hover:text-black border-2 border-black transition-all"
                        onClick={() => router.push("/auth")}
                    >
                        Back
                    </button>
                    <Header />
                </div>
                <div className="w-full my-2">
                  <p className="font-extrabold text-4xl md:text-7xl">
                    A look at{' '}<span className="text-green-500">{profile.display_name}'s</span>{' '}profile.
                  </p>
                </div>
              </div>
             </div>
             <div className="w-full flex flex-col items-center justify-start">
               <div className="w-11/12 md:max-w-screen-xl -translate-y-8 md:-translate-y-12">
                    <div className="flex flex-col md:flex-row md:justify-between flex-wrap">
                      <ChartCard size="sm" title="Artist Network" tooltip={toolTips.artistNetwork}>
                          <ArtistNetwork
                            collaborationMatrix={analysis.collaboration_matrix}
                            artistNames={analysis.artist_map}
                          />
                      </ChartCard>
                      <ChartCard size="md" title="Track history" tooltip={toolTips.artistNetwork}>
                          <SongCalendar
                            data={analysis.calendar_coordinates}
                          />
                      </ChartCard>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between flex-wrap">
                      <div className="bg-white border-2 border-black p-2 w-full my-2 md:w-5/12 md:flex-1 rounded-lg shadow-xl md:mr-2">
                          <p className="font-extrabold text-3xl md:text-5xl flex flex-row items-center mb-2">Key Chart<span className="cursor-pointer"><ToolTip content={toolTips.artistNetwork}/></span></p>
                          <div className="h-80">
                            <KeyChart
                              data={Object.keys(analysis.key_counts).map(key => {
                                return {
                                  Key: key,
                                  Major: analysis.key_counts[key].Major,
                                  Minor: analysis.key_counts[key].Minor
                                }
                              })}
                              keys={Object.keys(analysis.key_counts).map(key => key)}
                            />
                          </div>
                        </div>
                        <div className="bg-white border-2 border-black p-2 w-full my-2 md:w-1/3 rounded-lg shadow-xl md:ml-2">
                          <p className="font-extrabold text-3xl md:text-5xl flex flex-row items-center mb-2">Top Genres<span className="cursor-pointer"><ToolTip content={toolTips.artistNetwork}/></span></p>
                          <div className="h-80">
                            <GenrePieChart
                              data={analysis.top_genres}
                            />
                          </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between flex-wrap">
                      <div className="bg-white border-2 border-black px-2 pt-2 pb-10 w-full my-2 md:w-5/12 md:flex-1 rounded-lg shadow-xl">
                          <p className="font-extrabold text-3xl md:text-5xl flex flex-row items-center mb-2">Playlist Features<span className="cursor-pointer"><ToolTip content={toolTips.artistNetwork}/></span></p>
                          <div className="h-80">
                              <div className="flex flex-row justify-start items-center mb-4">
                              <select 
                                  className="text-sm md:text-base px-1 py-2 mr-2 border border-black rounded-lg cursor-pointer hover:border-gray-300 shadow-sm"
                                  onChange={e => setFeatureSelection(e.target.value)}
                                >
                                  {
                                    [
                                      "Acousticness", "Danceability", "Energy", 
                                      "Instrumentalness", "Liveness", "Loudness", 
                                      "Speechiness", "Tempo", "Valence"
                                    ].map((f, i) => <option key={i} value={f.toLowerCase()}>{f}</option>)
                                  }
                                </select>
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
                                  defaultValue={Object.keys(analysis.feature_data).slice(0,3).map(p => {
                                    return {
                                      label: p,
                                      value: p
                                    }
                                  })}
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
                                  options={Object.keys(analysis.feature_data).map(p => {
                                    return {
                                      value: p,
                                      label: p
                                    }
                                  })}
                                />
                              </div>
                              <PlaylistFeatures
                                data={
                                  playlistSelection ?
                                  mapFeatureData(playlistSelection) :
                                  mapFeatureData(Object.keys(analysis.feature_data).slice(0,3))
                                }
                                playlists={
                                  playlistSelection || 
                                  Object.keys(analysis.feature_data).slice(0,3)
                                }
                                feature={featureSelection}
                              />
                          </div>
                        </div>
                    </div>
               </div>
             </div>
            </div>
        )
    }
}