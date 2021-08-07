import axios from 'axios'
import { useCookies } from 'react-cookie'
import { ResponsiveChord } from '@nivo/chord'
import { useEffect, useState } from 'react'
import { Loading } from '../components/loading';
import { Error } from '../components/error';

export default function Analysis() {

    const [cookies, setCookie, ] = useCookies(['spottydata-credentials']);

    const [authData, setAuthData] = useState(cookies['authData'])
    const [collaborationMatrix, setCollaborationMatrix] = useState([[]])
    const [artistNames, setArtistNames] = useState([])
    const [error, setError] = useState(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(authData !== undefined) {
            let hdrs = {
                access_token: authData['access_token']
            }
            axios.get("http://192.168.1.164:8080",{headers: hdrs})
            .then(res => {
                setLoading(false)
                setCollaborationMatrix(res.data.collaboration_matrix)
                setArtistNames(res.data.artist_map)
            })
            .catch(err => {
                setLoading(false)
                setError(err)
            })
        }
    }, [authData])
    return (
        <div>
            {
                loading ?
                <div className="min-h-screen flex flex-col items-center justify-center"><Loading message="Analyzing profile..." /></div>
                : error ? <Error error={error} /> : 
                <div className="h-screen p-4">
                <ResponsiveChord
                    matrix={collaborationMatrix}
                    keys={artistNames}
                    margin={{ top: 60, right: 60, bottom: 90, left: 60 }}
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