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
                      <div className="w-full md:w-1/3 md:mr-2">
                        <ChartCard title="Artist Network" tooltip={toolTips.artistNetwork}>
                            <ArtistNetwork
                              collaborationMatrix={analysis.collaboration_matrix}
                              artistNames={analysis.artist_map}
                            />
                        </ChartCard>
                      </div>
                      <div className="w-full md:w-5/12 md:ml-2 md:flex-1">
                        <ChartCard title="Track history" tooltip={toolTips.artistNetwork}>
                            <SongCalendar
                              data={analysis.calendar_coordinates}
                            />
                        </ChartCard>
                      </div> 
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between flex-wrap">
                      <div className="w-full my-2 md:w-5/12 md:flex-1 md:mr-2">
                          <ChartCard title="Key Chart">
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
                        <div className="w-full my-2 md:w-5/12 md:ml-2">
                          <ChartCard title="Top Genres">
                            <GenrePieChart
                              data={analysis.top_genres}
                            />
                          </ChartCard>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between flex-wrap">
                      <div className="w-full my-2">
                          <ChartCard title="Playlist Features">
                              <div className="flex flex-row justify-start items-center mb-4">
                                <FeatureSelector setFeatureSelection={setFeatureSelection} />
                                <PlaylistSelector
                                  defaultSelection={
                                    Object.keys(analysis.feature_data).slice(0,3).map(p => {
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
                                  mapFeatureData(analysis, Object.keys(analysis.feature_data).slice(0,3), featureSelection)
                                }
                                playlists={
                                  playlistSelection || 
                                  Object.keys(analysis.feature_data).slice(0,3)
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