import {useState} from 'react'
import {motion} from 'framer-motion'

// components
import NoteToolBar from './NoteToolBar';
import NoteArea from './NoteArea';

type NoteProps = {
    id : string
}

export default function Note({id} : NoteProps) {
    const [isHovered, setIsHovered] = useState(false); 

    return (
        <motion.div
        className='note-parent-container' 
        key={id}
        onHoverStart={() => setIsHovered(true)} 
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsHovered(true)}
        >
            {/* Note Header */}
            <h1> Title </h1>
            <div className='note-container'
            style={{gridTemplateColumns: isHovered ? '1fr' : '1fr 5fr'}} 
            > 
                {isHovered && (
                <NoteToolBar parentId={id}/>
                )}
                <NoteArea parentId={id} isHovered={isHovered} />
            </div>



        </motion.div>
    )

}