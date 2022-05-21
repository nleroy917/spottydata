import { FC } from 'react'
import Link from 'next/link'

const Footer: FC = () => {
  return (
    <footer className="fixed bottom-0 w-full p-4 text-xs md:text-base">
      <div className="flex flex-row items-center justify-between text-center md:justify-evenly">
        <div>Created by Nathan LeRoy</div>
        <div>© 2021</div>
        <div>
          <Link href="https://github.com/nleroy917/spottydata/issues">
            Report an Issue
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
