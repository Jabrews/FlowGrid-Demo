import {useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import { useNoteListContext } from '../../Context/ElementContext/NoteListContext';
import type { NoteAreaItemType} from '../../Context/ElementContext/NoteListContext';
import NoteAreaitem from './NoteAreaItem';

type NoteAreaProps = {
  noteListId: string;
  noteId: string;
  isHovered: boolean;
};

export default function NoteArea({ noteListId, noteId, isHovered }: NoteAreaProps) {
  const [noteAreaItems, setNoteAreaItems] = useState<NoteAreaItemType[]>([]);

  const noteListStore = useNoteListContext();
  const getNoteAreaItemsByNoteId = noteListStore((state) => state.getNoteAreaItemsByNoteId);
  const addNoteAreaItem = noteListStore((state) => state.addNoteAreaItem);
  const deleteNoteAreaItemByNoteId = noteListStore((state) => state.deleteNoteAreaItemByNoteId);
  const cycleItemType = noteListStore((state) => state.cycleItemType);

  const updateItems = () => {
    const noteItems = getNoteAreaItemsByNoteId(noteListId, noteId);
    if (noteItems) {
      setNoteAreaItems(noteItems);
    }
    else {
      console.log('No items found for this note.');
    }
  }  


  useEffect(() => {
    const noteItems = getNoteAreaItemsByNoteId(noteListId, noteId);
    if (noteItems) {
      setNoteAreaItems(noteItems);
    }
    else {
      console.log('No items found for this note.');
    }
  }, [noteListId, noteId, getNoteAreaItemsByNoteId]);

  const handleAddItem = () => {
    addNoteAreaItem(noteListId, noteId);
    updateItems();
  };

  const handleDeleteItem = (itemId : string) => {
      deleteNoteAreaItemByNoteId(noteListId, noteId, itemId);
      updateItems();
  }

  const handleCycleItemType = (itemId: string) => {
    cycleItemType(noteListId, noteId, itemId);
    updateItems();
  }
  



  

  return (



    <div className="note-area-container" key={`note-area-${noteListId}`}>
      <div className="note-area-item-container">
        {noteAreaItems.map((item) => (
          <NoteAreaitem
            key={item.id}
            item={item}
            noteListId={noteListId}
            noteId={noteId}
            onDelete={() => handleDeleteItem(item.id)}
            cycleItemType={() => handleCycleItemType(item.id)}
          />
        ))}
      </div>

      {isHovered && (
        <motion.button
          className="note-area-add-item-btn"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={handleAddItem}
          style={{marginLeft: noteAreaItems.length <= 0 ? '10em' : '0'}}
        >
          Add Item
        </motion.button>
      )}
    </div>
  );
}
