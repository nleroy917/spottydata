import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import { Error } from '../components/error';
import { Loading } from '../components/loading';
import { fetchPlaylists } from '../utils/spotify';
import { Header } from '../components/header';
import SEO from '../components/seo';
import Link from 'next/link';

export default function Playlists() {
    const [cookies, setCookie, removeCookie] = useCookies(['spottydata-credentials'])

    // create router object
    const router = useRouter()

    // state management
    const [authData, setAuthData] = useState(cookies['authData'])
    const [playlists, setPlaylists] = useState(undefined)
    const [error, setError] = useState(undefined)
    
    if (!authData) {
        if(process.browser) {
            router.push("/")
        }
    }

    /**
     * Get playlists
     */
    useEffect(() => {
        fetchPlaylists(
            authData,
            setPlaylists,
            setError
        )
    }, [authData])

    if (error) {
        return (
            <div>
              <SEO title="Error!"/>
              <Error error={error} />
            </div>
        )
    } else if (playlists === undefined) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <SEO title="Playlists"/>
                <Loading />
            </div>
        )
    } else {
        return (
            <div>
              <SEO title="Playlists"/>
              <div className="bg-yellow-200 h-48">
                  <div className="p-4 flex flex-row justify-between items-center">
                    <Link href="/auth">
                        <span className="cursor-pointer">Back</span>
                    </Link>
                    <Header />
                  </div>
              </div>
              <div className="min-h-screen bg-gradient">
                <div className="w-11/12 md:max-w-6xl mx-auto -translate-y-24">
                    <div className="flex flex-col md:flex-row flex-wrap justify-center items-center md:items-stretch">
                    {
                        playlists.map((p, i) => {
                            return (
                                <div key={i} className="bg-white shadow-lg rounded-lg w-11/12 md:w-72 m-4 border-2 border-black hover:shadow-2xl     hover:border-blue-600 hover:text-blue-600">
                                  <img
                                    className="rounded-t-lg h-64 md:h-52 w-full object-cover" 
                                    src={p.images[0].url}
                                    alt={`Analyze playlist: ${p.name}`}
                                  />
                                  <div className="py-4 px-2 font-bold text-2xl text-center">
                                    {p.name}
                                  </div>
                                </div>
                            )
                        })
                    }
                </div>
              </div>
            </div>
          </div>
        )
    }
}