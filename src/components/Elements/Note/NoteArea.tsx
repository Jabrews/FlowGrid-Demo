import {motion} from 'framer-motion'

type NoteAreaProps = {
    parentId : string;
    isHovered : boolean
}

export default function NoteArea({parentId, isHovered} : NoteAreaProps) {

   return (
    <div className='note-area-container' style={{overflowY : isHovered ? 'scroll' : 'hidden'}}>
    {/* PLACEHOLDER STYLING */}
        <div className="note-area-item">
            <p> []</p>
            <p> blah blah blah </p>
        </div>
        <div className="note-area-item">
            <p> []</p>
            <p> blah blah blah </p>
        </div>
        <div className="note-area-item">
            <p> []</p>
            <p> blah blah blah </p>
        </div>
        {isHovered && (
            <motion.button 
            className="note-area-add-item-btn"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                Add Item
            </motion.button>
        )}

            </div>
   )


}