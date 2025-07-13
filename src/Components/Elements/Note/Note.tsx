import {useState} from 'react';
import { useNoteListContext } from '../../../Context/ElementContext/NoteListContext';

// components
import NoteArea from './NoteArea';

type NoteProps = {
    noteId : string
    isHovered : boolean
    noteListId : string
    title : string
}

export default function Note({noteListId, noteId, isHovered, title} : NoteProps) {
    const [placeholderTitle , setPlaceholderTitle] = useState<string>(title);
    const noteListStore = useNoteListContext();
    const changeNoteObjectTitle = noteListStore((state) => state.changeNoteObjectTitle);
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceholderTitle(e.target.value);
        changeNoteObjectTitle(noteListId, noteId, e.target.value);
    }


    return (
        <div
        className='note-parent-container' 
        key={noteId}
        >
            {/* Note Header */}
            <input placeholder={placeholderTitle} value={placeholderTitle} className='title' onChange={(e) => handleTitleChange(e)}/>

            <div className='note-container'
            style={{gridTemplateColumns: isHovered ? '1fr' : '1fr 5fr'}} 
            > 
                <NoteArea noteListId={noteListId} noteId={noteId} isHovered={isHovered} />
            </div>



        </div>
    )

}