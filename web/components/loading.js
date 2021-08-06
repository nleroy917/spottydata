import Image from 'next/image';
import music_note from '../public/music_note.png'

export const Loading = ({message}) => {
    return (
        <div className="flex flex-col justify-center items-center h-48">
          <div className="animate-bounce">
            <Image 
                src={music_note} width={50} height={70}    
            />
          </div>
            <p className="text-2xl italic text-gray-700">
                {
                    message ? message : "Loading..."
                }
            </p>
        </div>
    )
}