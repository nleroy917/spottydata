import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import { Loading } from '../components/loading';
import { Error } from '../components/error';
import { useRouter } from 'next/router';
import { Header } from '../components/header';
import { fetchProfile } from '../utils/spotify';
import SEO from '../components/seo';
import { 
    ArtistNetwork,
    GenrePieChart,
    KeyChart,
    SongCalendar,
    toolTips
} from '../components/charts';

import { test_data } from '../data/test_analysis_data'
import ToolTip from '../components/tooltip';

export default function Analysis() {
    const router = useRouter()
    const [cookies, setCookie, ] = useCookies(['spottydata-credentials']);

    const [authData, setAuthData] = useState(cookies['authData'])
    const [profile, setProfile] = useState(undefined)
    const [analysis, setAnalysis] = useState(undefined)
    const [error, setError] = useState(undefined)

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
                      <div className="bg-white border-2 border-black p-2 w-full my-2 md:w-1/3 rounded-lg shadow-xl md:mr-2">
                        <p className="font-extrabold text-3xl md:text-5xl mb-2">Artist network<span className="cursor-pointer"><ToolTip content={toolTips.artistNetwork}/></span></p>
                        <div className="h-80">
                          <ArtistNetwork
                            collaborationMatrix={analysis.collaboration_matrix}
                            artistNames={analysis.artist_map}
                          />
                        </div>
                      </div>
                      <div className="bg-white border-2 border-black p-2 w-full my-2 md:w-5/12 rounded-lg shadow-xl md:flex-1 md:ml-2">
                        <p className="font-extrabold text-3xl md:text-5xl mb-2">Song history</p>
                        <div className="h-80">
                          <SongCalendar
                            data={analysis.calendar_coordinates}
                          />
                        </div>
                      </div>
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
               </div>
             </div>
            </div>
        )
    }
}