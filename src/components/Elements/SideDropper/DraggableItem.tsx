import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export type DraggableItemProps = {
  id: string;
};

export default function DraggableItem({ id }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type: id }, // allows tracking type during drop
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="drop-list-child">
        <div className="drag-handle" 
        {...listeners} {...attributes}
        onPointerDown={(e) => {
        console.log('🖱 Pointer down', e);
  }}
        >
          ::
        </div>
        <p>{id}</p>
        <div className="placeholder-image"></div>
      </div>
    </div>
  );
}
