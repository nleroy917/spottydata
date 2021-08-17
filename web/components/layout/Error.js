import Link from "next/link"

const ErrorHeader = () => {
    return (
        <p className="text-center text-5xl font-bold my-8">
            Oops! An error occured.
        </p>
    )
}

const ErrorMessage = ({error}) => {
    if(error.response) {
        return (
            <div>
                {
                    error.response ?
                    <div className="p-4 border-2 border-green-500 rounded-md bg-green-200 shadow-md mx-6">
                        <p className="text-3xl font-bold mb-4 text-center md:text-left">
                            Error Code: {error.response.status}
                        </p>
                        <code className="mx-auto">
                          {
                              JSON.stringify(error.response.data, null, 2)
                          }
                        </code>
                        <div className="flex flex-row justify-center md:justify-start mt-4">
                          <Link href="https://github.com/nleroy917/spottydata/issues">
                            <button className="border-2 border-black rounded-lg text-white bg-black mr-1 px-6 py-2 font-bold transition-all hover:bg-transparent hover:text-black">
                                Report Issue
                            </button>
                          </Link>
                          <Link href="/">
                            <button className="border-2 border-black rounded-lg text-white bg-black mx-1 px-6 py-2 font-bold transition-all hover:bg-transparent hover:text-black">
                                Home
                            </button>
                          </Link>                            
                        </div>
                    </div>
                  : <div></div>
                }
            </div>
        )
    } else {
        console.log(error)
        return (
            <div className="p-4 border-2 border-green-500 rounded-md bg-green-200 shadow-md mx-6 font-bold">
                <code>
                    {
                        error.toString()
                    }
                </code>
                <div className="flex flex-row justify-center mt-4">
                  <Link href="https://github.com/nleroy917/spottydata/issues">
                    <button className="border-2 border-black rounded-lg text-white bg-black mr-1 px-6 py-2 font-bold transition-all hover:bg-transparent hover:text-black">
                        Report Issue
                    </button>
                  </Link>
                  <Link href="/">
                    <button className="border-2 border-black rounded-lg text-white bg-black mx-1 px-6 py-2 font-bold transition-all hover:bg-transparent hover:text-black">
                        Home
                    </button>
                  </Link>                            
                </div>
            </div>
        )
    }
}

export const Error = ({error}) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <ErrorHeader />
            <ErrorMessage error={error} />
        </div>
    )
}