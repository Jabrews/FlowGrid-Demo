import {motion} from 'framer-motion'


type NoteToolBarProps = {
    parentId : string;
}

export default function NoteToolBar ({parentId} : NoteToolBarProps) {
    return (
        <motion.div 
        className='note-toolbar-container'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <p> one </p>
            <p> two </p>
            <p> three </p>
        </motion.div>
    )
}