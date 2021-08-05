import { useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from "next/link";
import { fetchAccessToken } from '../utils/spotify';


export default function Auth() {
    // create router object
    const router = useRouter()
    
    // check for error code
    const params = router.query
    if (params.error === "access_denied") {
        // send home
        router.push("/")
    }

    // extract authorization code
    const authCode = params.code

    useEffect(() => {
        if(authCode !== undefined) {
            fetchAccessToken(
                authCode,
                process.env.NEXT_PUBLIC_CLIENT_ID,
                process.env.NEXT_PUBLIC_CLIENT_SECRET,
                process.env.NEXT_PUBLIC_REDIRECT_URI,
            )}
    }, [authCode])

    return (
        <div className="flex flex-col items-center justify-start py-2">
            <Link href="/">Back</Link>
        </div>
    )
}