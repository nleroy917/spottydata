import { useState } from 'react'
import Link from 'next/link'

import {
  SEO,
  Header
} from '../components/layout'

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
const qs = Object.keys(payload)
          .map(key => `${key}=${payload[key]}`)
          .join('&');

const authorize_url = base_url + qs

export default function Home() {

  const [hoverGo, setHoverGo] = useState(false)
  const [hoverSource, setHoverSource] = useState(false)
  const [hoverSupport, setHoverSupport] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient">
        <div className="w-11/12 md:w-1/2 fixed top-0 rounded-lg p-4 my-8 border-2 border-black bg-yellow-200 shadow-lg">
          <span><span className="font-bold text-lg">Thank you for visiting Spottydata!</span> If you've been here before, things may look very different. The site is currently undergoing some major changes to provide an even better experience. Stay tuned for more and feel free to follow the progress or contribute by visitig the GitHub repository below!</span>
        </div>
      <SEO />
      <div className="flex flex-row justify-end fixed top-0 p-4 w-full">
        <Header />
      </div>
      <main>
        <div className="flex flex-col items-center justify-center">
          <div className="my-2">
            <p className="text-6xl font-bold text-center lg:text-7xl mb-4">
              Welcome to <span className="text-green-400">SpottyData</span>
            </p>
          </div>
          <div className="my-4 flex flex-col justify-center items-center md:flex-row w-11/12">
            <div
              onMouseEnter={() => setHoverGo(true)}
              onMouseLeave={() => setHoverGo(false)}
            >
              <Link href={authorize_url}>
                <button 
                  className="w-56 md:w-48 rounded-lg border-2 border-black hover:bg-black hover:text-white hover:shadow-sm my-2 mx-2 px-8 py-4 md:py-2 text-xl font-bold transition-all"
                >
                  Lets Go
                </button>
              </Link>
            </div>
            <div
              onMouseEnter={() => setHoverSource(true)}
              onMouseLeave={() => setHoverSource(false)}
            >
              <Link href="https://github.com/nleroy917/spottydata">
                <button 
                  className="w-56 md:w-48 rounded-lg border-2 border-black hover:bg-black hover:text-white hover:shadow-sm my-2 mx-2 px-8 py-4 md:py-2 text-xl font-bold transition-all"

                >
                  GitHub
                </button>
              </Link>
            </div>
            <div
              onMouseEnter={() => setHoverSupport(true)}
              onMouseLeave={() => setHoverSupport(false)}
            >
              <Link href="https://paypal.me/nathanleroy?locale.x=en_US">
                <button 
                  className="w-56 md:w-48 rounded-lg border-2 border-black hover:bg-black hover:text-white hover:shadow-sm my-2 mx-2 px-8 py-4 md:py-2 text-xl font-bold transition-all"
                >
                  Support
                </button>
              </Link>
            </div>
          </div>
          <div className="h-24 p-4 w-full flex items-center justify-center text-center text-2xl italic">
            <div style={{display: hoverGo ? 'block' : 'none'}}>
              Analyze a playlist ➡️
            </div>
            <div style={{display: hoverSource ? 'block' : 'none'}}>
              View source 🚀
            </div>
            <div style={{display: hoverSupport ? 'block' : 'none'}}>
              Support the project ☕
            </div>
          </div>   
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
