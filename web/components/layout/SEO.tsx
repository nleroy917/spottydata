import Head from 'next/head'
import { FC } from 'react'

interface Props {
  title?: string,
  desc?: string
}

const SEO: FC<Props> = (props) => {
    return (
            <Head>
              <title>{props.title || "Spottydata.com"}</title>
              <link rel="icon" href="/favicon.ico" />
              <meta
                name="description"
                content={
                  props.desc || "A spotify profile analyzer. Analyze your profile, playlists, albums, and more!"
                }
              />
              <link rel="apple-touch-icon" href="/favicon.ico" />
              {/* <!--
                OG meta-tags for social media use and general SEO. Shows pictures and description when
                sharing on social media's like Facebook and Twitter.
              --> */}
              <meta property='og:title' content='Spottydata'/>
              <meta property='og:image' content='/landing.png'/>
              <meta property='og:description' content='A spotify profile analyzer. Analyze your profile, playlists, albums, and more!'/>
              <meta property='og:url' content='https://spottydata.vercel.app' />
              <meta property="og:type" content="Web Application" />
            </Head>
    )
}
export default SEO