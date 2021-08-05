import Image from 'next/image';
import music_note from '../public/music_note.png'

export const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center h-48">
            <Image 
                src={music_note} width={50} height={70} 
                className="animate-bounce"    
            />
            <p className="text-2xl italic text-gray-700">
                Loading...
            </p>
        </div>
    )
}