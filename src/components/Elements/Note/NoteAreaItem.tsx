import { useState, useEffect, useRef } from "react";
import type { NoteAreaItemType } from "../../../Context/ElementContext/NoteListContext";
import { useNoteListContext } from "../../../Context/ElementContext/NoteListContext";
import { FaXmark } from "react-icons/fa6";

type Props = {
  item: NoteAreaItemType;
  noteListId: string;
  noteId: string;
  onDelete: (itemId: string) => void;
  cycleItemType?: (itemId: string, noteListId: string, noteId: string) => void;
};

export default function NoteAreaitem({ item, noteListId, noteId, onDelete, cycleItemType}: Props) {
  const NoteListStore = useNoteListContext();
  const changeNoteAreaItemText = NoteListStore((state) => state.changeNoteAreaItemText);

  const [displayDeleteIcon, setDisplayDeleteIcon] = useState(false);
  const [placeholderValue, setPlaceHolderValue] = useState("");

  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPlaceHolderValue(item.text);
  }, [item.text]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setDisplayDeleteIcon(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setPlaceHolderValue(newText);
    changeNoteAreaItemText(newText, noteListId, noteId, item.id);

    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };
  
  

  return (
    <div className="note-area-item" ref={itemRef}>
      {/* DELETE ICON */}
      <div
        className="note-area-item-delete-icon"
        style={{ display: displayDeleteIcon ? "block" : "none" }}
      >
        <button className="delete-note-item-btn" onClick={() => onDelete(item.id)}>
          <FaXmark className="delete-icon" />
        </button>
      </div>

      {/* ITEM SYMBOL */}
 
      <div onClick={cycleItemType ? () => cycleItemType(item.id, noteListId, noteId) : undefined} >
        {item.type === "checkbox" && (
            <input type="checkbox" checked={item.checkboxStatus} readOnly />
        )}
        {item.type === "bullet" && <p>&#x2022;</p>}
        {item.type === "text" && displayDeleteIcon && <p>-</p>}

      </div>

      {/* TEXTAREA */}
      <textarea
        placeholder="type here"
        value={placeholderValue}
        onChange={handleTextAreaChange}
        onClick={() => setDisplayDeleteIcon(true)}
        style={{ overflow: "hidden", resize: "none" }}
      />
    </div>
  );
}
