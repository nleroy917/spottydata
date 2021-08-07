import axios from 'axios'
import { useCookies } from 'react-cookie'
import { ResponsiveChord } from '@nivo/chord'
import { useEffect, useState } from 'react'

export default function Analysis() {

    const [cookies, setCookie, ] = useCookies(['spottydata-credentials']);

    const [authData, setAuthData] = useState(cookies['authData'])
    const [featureMatrix, setFeatureMatrix] = useState([[]])
    const [artistNames, setArtistNames] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(authData !== undefined) {
            let hdrs = {
                access_token: authData['access_token']
            }
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/analysis/profile`,{headers: hdrs})
            .then(res => {
                setLoading(false)
                console.log(res.data)
                setFeatureMatrix(res.data.feature_matrix)
                setArtistNames(res.data.artist_map)
            })
        }
    }, [authData])
    return (
        <div>
            {
                loading ? `Laoding...` :
            <div className="h-screen p-4">
            <ResponsiveChord
                matrix={featureMatrix}
                keys={artistNames}
                margin={{ top: 60, right: 60, bottom: 90, left: 60 }}
                valueFormat=".2f"
                padAngle={0.02}
                innerRadiusRatio={0.96}
                innerRadiusOffset={0.02}
                arcOpacity={1}
                arcBorderWidth={1}
                arcBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
                ribbonOpacity={0.5}
                ribbonBorderWidth={1}
                ribbonBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
                enableLabel={true}
                label="id"
                labelOffset={12}
                labelRotation={-90}
                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
                colors={{ scheme: 'nivo' }}
                isInteractive={true}
                arcHoverOpacity={1}
                arcHoverOthersOpacity={0.25}
                ribbonHoverOpacity={0.75}
                ribbonHoverOthersOpacity={0.25}
                animate={true}
                motionStiffness={90}
                motionDamping={7}
            />
            </div>
            }
        </div>
    )
}