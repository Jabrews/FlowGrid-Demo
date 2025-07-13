import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AlarmClock } from 'lucide-react';
import { Cable } from 'lucide-react';
import {NotepadText} from 'lucide-react'
import {TableProperties} from 'lucide-react'

export type DraggableItemProps = {
  id: string;
  type: string;
};

export default function DraggableItem({ id, type }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type: type }, // allows tracking type during drop
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="drop-list-child">
        <p>{id}</p>
        {/* Conditional rendering */}
      {type === 'Timer' ? (
        <AlarmClock size={80} />
      ) : type === 'Tracker' ? (
        <Cable size={80} />
      ) : type === 'Note-List' ? (
        <NotepadText size={80} />
      ) : type === 'Table-List' ? (
        <TableProperties size={80} />
      ) : (
        <div className="placeholder-image" />
      )}
      </div>
    </div>
  );
}
