import { useRouter } from "next/router";
import { useState, FC } from "react";
import { useCookies } from "react-cookie"

export const Header: FC = () => {
    // access cookies
    const [cookies, , removeCookie] = useCookies(['spottydata-credentials']);
    const [profile, setProfile] = useState(cookies['profile'])

    // router
    const router = useRouter()

    const clearCookies = () => {
        removeCookie('authData')
        removeCookie('profile')
        setProfile(undefined)
        router.push("/")
    }

    return (
        <header className="h-8 items-center">
            {
                profile ?
                <p className="mb-0">Logged in as{' '}<span className="font-bold">{profile.display_name}</span>{' | '}
                    <span className="text-blue-600 cursor-pointer" onClick={clearCookies}>Logout</span>
                </p>
                : <div></div>
            }
        </header>
    )
}