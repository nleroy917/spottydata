import { useState, useEffect } from 'react'
import Link from 'next/link'

import {
  SEO,
  Header
} from '../components/layout'
import axios, { AxiosResponse } from 'axios'

import landing_card from '../public/landing_card.png'

// construct log in link
const base_url =  'https://accounts.spotify.com/authorize?'

const payload = {
	client_id: '0ca7dd0007fd4ff2a34c3aab07379970',
	response_type: 'code',
	scope: 'playlist-read-private playlist-read-collaborative user-top-read user-library-read user-read-playback-state user-read-recently-played',
	redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
	show_dialog: true
}

// convert payload to query string
const qs = `client_id=${payload.client_id}&response_type=${payload.response_type}&scope=${payload.scope}&redirect_uri=${payload.redirect_uri}&show_dialog=${payload.show_dialog}`

const authorize_url = base_url + qs

export default function Home() {

  const [showNotice, setShowNotice] = useState<boolean>(true)
  const [starCount, setStartCount] = useState<number>(0)

  useEffect(() => {
    axios.get('https://api.github.com/repos/nleroy917/spottydata')
    .then((res: AxiosResponse) => {
      setStartCount(res.data.stargazers_count)
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div 
          className="w-11/12 md:w-1/2 fixed top-0 rounded-lg p-4 my-8 border-2 border-black bg-yellow-200 shadow-lg"
          style={{
            display: showNotice ? '' : 'none'
          }}
        >
          <span><span className="font-bold text-lg">Thank you for visiting Spottydata!</span> If you've been here before, things may look very different. The site is currently undergoing some major changes to provide an even better experience. Stay tuned for more and feel free to follow the progress or contribute by visitig the GitHub repository below!</span>
          <br></br>
          <button
            onClick={() => {
              setShowNotice(false)
            }}
            className="px-2 py-1 border-2 border-black rounded-md mt-2 text-white bg-black font-bold hover:bg-transparent hover:text-black transition-all"
          >
              Close
          </button>
        </div>
      <SEO />
      <div className="flex flex-row justify-between items-center fixed top-0 py-4 px-4 xs:px-0 w-full md:max-w-screen-xl">
        <div className="flex flex-row items-center">
          <div>
            <Link href="https://github.com/nleroy917/spottydata">
              <button 
                className="px-2 py-1 rounded-l-lg font-bold text-sm border-2 border-black bg-black text-white hover:bg-transparent hover:text-black transition-all"
              >
                ★ Star
              </button>
              </Link>
              <Link href="https://github.com/nleroy917/spottydata/stargazers">
              <button 
                className="px-2 md:px-6 py-1 mr-2 rounded-r-lg font-bold text-sm border-2 border-l-0 border-black hover:bg-black hover:text-white transition-all"
              >
                {' '}{starCount}
              </button>
            </Link>
          </div>
          </div>
        <Header />
      </div>
      <main className="w-11/12 md:max-w-screen-xl">
        <div className="flex flex-col items-start justify-center mb-12">
          <div className="mb-1">
            <p className="text-6xl font-bold text-center lg:text-7xl mb-4">
              Welcome to <span className="text-green-400">SpottyData</span>
            </p>
          </div>
          <div className="w-11/12 my-4 flex flex-col justify-center items-center md:items-start">
            <p className="md:w-7/12 mb-2 text-sm md:text-base text-center md:text-left">
              Spottydata is a <span className="font-bold text-green-500">Spotify profile analysis tool.</span> Spotty will analyze all of the music, artists, and albums across all playlists on your Spotify profile and give you rich insights into the genres you listen to, how frequently your facorits artsits collaborate, and the audio features of your music. Click below to get started!
            </p>
            <div>
              <Link href={authorize_url}>
                <button
                  className="w-48 rounded-lg border-2 border-black hover:bg-black hover:text-white hover:shadow-sm mt-4 mb-2 mr-2 px-8 py-2 text-xl font-bold transition-all"
                >
                  Lets Go
                </button>
              </Link>
            </div>
            <div className="my-2 md:flex md:flex-row md:items-center">
              <Link href="https://paypal.me/nathanleroy?locale.x=en_US">
                <button 
                  className="mr-4 font-bold hover:underline transition-all"
                >
                  ☕ Support
                </button>
              </Link>
              <Link href="https://github.com/nleroy917/spottydata">
                <button 
                  className="ml-4 mr-2 font-bold hover:underline transition-all"
                >
                  ⓘ Learn more
                </button>
              </Link>
            </div>
          </div>  
        </div>
        <div className="hidden lg:block fixed lg:top-48 lg:right-12 mr-4 pb-14" style={{zIndex: -1}}>
            <img
              width="700"
              className="transform skew-y-12 shadow-xl z-0 opacity-40"
              src={landing_card.src}
            />
        </div>
      </main>
      <footer className="fixed bottom-0 w-full p-4 text-xs md:text-base">
        <div className="flex flex-row items-center justify-between md:justify-evenly">
          <div>Created by Nathan LeRoy</div>
          <div>© 2021</div>
          <div><Link href="https://github.com/nleroy917/spottydata/issues">Report an Issue</Link></div>
        </div>
      </footer>
    </div>
  )
}
