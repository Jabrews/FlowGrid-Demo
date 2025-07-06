import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// components
import type { NoteObject } from '../../Context/ElementContext/NoteListContext';
import Note from './Note';

// Zustand store
import { useNoteListContext } from '../../Context/ElementContext/NoteListContext';

type NoteListProps = {
  id: string;
};

export default function NoteList({ id }: NoteListProps) {
  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [noteObjects, setNoteObjects] = useState<NoteObject[]>([]);

  const noteListStore = useNoteListContext();
  const addNoteListObject = noteListStore((state) => state.addNoteListObject);
  const getNoteObjects = noteListStore((state) => state.getNoteObjects);
  const addNoteObject = noteListStore((state) => state.addNoteObject);

  // Ensure note list exists on mount
  useEffect(() => {
    addNoteListObject(id);
  }, [id, addNoteListObject]);

  const refreshNoteObjects = () => {
    const notes = getNoteObjects(id);
    setNoteObjects(notes);
  };

  useEffect(() => {
    refreshNoteObjects();
    setActiveNoteIndex(0); // reset to first note on list change
  }, [id, getNoteObjects]);

  const handleAddNoteBtn = () => {
    console.log('DEBUG : adding note object');
    addNoteObject(id);
    refreshNoteObjects(); 
  };

    const navigateNoteList = (direction: 'next' | 'previous') => {
    let navigationValue = 0;
    if (direction === 'next') {
      navigationValue = 1;
    }
    else if (direction === 'previous') {
      navigationValue = -1; }
    
    setActiveNoteIndex((prevIndex) => {
      if (prevIndex + navigationValue> -1 && prevIndex + navigationValue < noteObjects.length  ) { 
        return prevIndex + navigationValue;
      }
      else {
        console.log('issue encounted cycling note index')
        return prevIndex;
      }
    })


  }

  return (
    <motion.div
      className="note-list-container"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Toolbar */}
      <motion.div
        className="note-toolbar-container"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <button className="add-note-btn" onClick={handleAddNoteBtn}>
          +
        </button>
        <div className="navigate-note-btn">
          <p className="navigate-left-btn" onClick={() => navigateNoteList('previous')}>{'<'}</p>
          <p>{activeNoteIndex + 1}/{noteObjects.length} </p>
          <p className="navigate-right-btn" onClick={() => navigateNoteList('next')}>{'>'}</p>
        </div>
      </motion.div>

      {/* Notes */}
    <div 
    className="note-list-item-container"
    style={{overflowY: isHovered ? 'scroll' : 'hidden'}}
    >
      
      {noteObjects[activeNoteIndex] && (
        <Note
          key={noteObjects[activeNoteIndex].id}
          noteListId={id}
          noteId={noteObjects[activeNoteIndex].id}
          isHovered={isHovered}
          title={noteObjects[activeNoteIndex].title}
        />
      )}
      {noteObjects.length === 0 && (<p> No Notes Yet</p>)}
    </div>
    </motion.div>
  );
}
