import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import { Loading } from '../components/loading';
import { useRouter } from 'next/router';
import { fetchProfile } from '../utils/spotify';

// import analysis helper
// functions
import { mapFeatureData } from '../utils/analysis';

// import layouts
import {
  ChartCard,
  Error,
  Header,
  SEO
} from '../components/layout'

// import control structures
import { 
  FeatureSelector, 
  PlaylistSelector 
} from '../components/control';

// import charts
import { 
    ArtistNetwork,
    GenrePieChart,
    KeyChart,
    PlaylistFeatures,
    SongCalendar,
    toolTips
} from '../components/charts';
import { AuthData, ProfileAnalysis } from '..';
import { ErrorObject } from '../components/layout/Error';

// import { test_data } from '../data/test_analysis_data'

export default function Analysis() {

    const router = useRouter()
    const [cookies, setCookie, ] = useCookies(['spottydata-credentials']);

    const [authData, setAuthData] = useState<AuthData>(cookies['authData'])
    const [profile, setProfile] = useState<SpotifyApi.UserObjectPublic | undefined>(undefined)
    const [analysis, setAnalysis] = useState<ProfileAnalysis | undefined>(undefined)
    const [error, setError] = useState<ErrorObject | undefined>(undefined)

    // state for playlist feature plot
    const [playlistSelection, setPlaylistSelection] = useState<string[] | undefined>(undefined)
    const [featureSelection, setFeatureSelection] = useState<string>("valence")

    useEffect(() => {
        if(authData !== undefined) {
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
            <div className="flex flex-col items-center justify-center min-h-screen">
              <Loading message="Analyzing profile..." />
            </div>
        )
    } else {
        return (
            <div className="min-h-screen bg-white ">
            <SEO title={`${profile.display_name} | Analysis`} />
             <div className="flex flex-col items-center justify-start w-full h-56 border-b border-black bg-gradient">
              <div className="w-11/12 md:max-w-screen-xl">
                <div className="flex flex-row items-start justify-between w-full py-2">
                    <button
                        className="px-2 py-1 text-sm font-bold text-white transition-all bg-black border-2 border-black rounded-lg text-bold md:text-base md:py-2 md:px-4 hover:bg-white hover:text-black"
                        onClick={() => router.push("/auth")}
                    >
                        Back
                    </button>
                    <Header />
                </div>
                <div className="w-full my-2">
                  <p className="text-4xl font-extrabold md:text-7xl">
                    A look at{' '}<span className="text-green-500">{profile.display_name}'s</span>{' '}profile.
                  </p>
                </div>
              </div>
             </div>
             <div className="flex flex-col items-center justify-start w-full">
               <div className="w-11/12 -translate-y-8 md:max-w-screen-xl md:-translate-y-12">
                    <div className="flex flex-col flex-wrap lg:flex-row lg:justify-between">
                      <div className="w-full lg:w-1/3 lg:mr-2">
                        <ChartCard title="Artist Network" tooltip={toolTips.artistNetwork}>
                            <ArtistNetwork
                              collaborationMatrix={analysis.collaboration_matrix}
                              artistNames={analysis.artist_map}
                            />
                        </ChartCard>
                      </div>
                      <div className="w-full lg:w-5/12 lg:ml-2 lg:flex-1">
                        <ChartCard title="Track history" tooltip={toolTips.songCalendar}>
                            <SongCalendar
                              data={analysis.calendar_coordinates}
                            />
                        </ChartCard>
                      </div> 
                    </div>
                    <div className="flex flex-col flex-wrap lg:flex-row lg:justify-between">
                      <div className="w-full my-2 lg:w-5/12 lg:flex-1 lg:mr-2">
                          <ChartCard title="Key Chart" tooltip={toolTips.keyChart}>
                            <KeyChart
                              data={Object.keys(analysis.key_counts).map(key => {
                                return {
                                  Key: key,
                                  Major: analysis.key_counts[key].Major,
                                  Minor: analysis.key_counts[key].Minor
                                }
                              })}
                            />
                          </ChartCard>
                        </div>
                        <div className="w-full my-2 lg:w-5/12 lg:ml-2">
                          <ChartCard title="Top Genres" tooltip={toolTips.genreChart}>
                            <GenrePieChart
                              data={analysis.top_genres}
                            />
                          </ChartCard>
                        </div>
                    </div>
                    <div className="flex flex-col flex-wrap md:flex-row md:justify-between">
                      <div className="w-full my-2">
                          <ChartCard title="Playlist Features" tooltip={toolTips.featureChart}>
                              <div className="flex flex-col items-center justify-start mb-4 md:flex-row">
                                <FeatureSelector setFeatureSelection={setFeatureSelection} />
                                <PlaylistSelector
                                  defaultSelection={
                                    Object.keys(analysis.feature_data).slice(0,2).map(p => {
                                      return {
                                        label: p,
                                        value: p
                                      }
                                    })
                                  }
                                  setPlaylistSelection={setPlaylistSelection}
                                  options={
                                    Object.keys(analysis.feature_data).map(p => {
                                      return {
                                        value: p,
                                        label: p
                                      }
                                    })
                                  }
                                />
                              </div>
                              <PlaylistFeatures
                                data={
                                  playlistSelection ?
                                  mapFeatureData(analysis, playlistSelection, featureSelection) :
                                  mapFeatureData(analysis, Object.keys(analysis.feature_data).slice(0,2), featureSelection)
                                }
                                playlists={
                                  playlistSelection || 
                                  Object.keys(analysis.feature_data).slice(0,2)
                                }
                                feature={featureSelection}
                              />
                          </ChartCard>
                        </div>
                    </div>
               </div>
             </div>
            </div>
        )
    }
}