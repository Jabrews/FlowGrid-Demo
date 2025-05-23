import { useState } from 'react';

// modal system
import { ModalProvider } from "./components/Elements/TimeoutModel/TimeoutModelContext";
import TimeoutModel from "./components/Elements/TimeoutModel/TimeoutModel";
import { DeleteModalProvider } from "./components/Elements/DeleteElementModel/DeleteElementModelContext";
import DeleteElementModel from './components/Elements/DeleteElementModel/DeleteElementModel'
import './styles/main.css';


// drag and drop core
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import type { UniqueIdentifier } from '@dnd-kit/core';
import DragPreview from './components/Elements/SideDropper/DragPreview';

// components
import Whiteboard from "./components/Elements/Whiteboard/Whiteboard";
import type {DroppedItem} from "./components/Elements/Whiteboard/Whiteboard"; 
import SideDropper from "./components/Elements/SideDropper/SideDropper";

export default function App() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);

  // enable touch and pointer support for mobile and desktop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
    useSensor(MouseSensor),
  );

  return (
    <DeleteModalProvider>
    <ModalProvider>
      <>
        <DeleteElementModel/>
        <TimeoutModel />

        <DndContext
          sensors={sensors}
          // called when dragging begins
          onDragStart={(event) => {
            console.log('started drag : ', event.active.id);
            setActiveId(event.active.id);
          }}

          // called when dragging ends (drop or cancel)
          onDragEnd={({ over, active }) => {
            console.log('ended drag : ', active.id);
            if (over?.id === 'droppable-1') {
              const type = active.data?.current?.type || String(active.id);
              const uniqueId = `${type}-${Date.now()}`;

              setDroppedItems((prev) => [
                ...prev,
                {
                  id: uniqueId,
                  type: type,
                  content: `Dropped: ${type}`,
                }
              ]);
            }
            console.log('app dropped items :', droppedItems)
            setActiveId(null);
          }}

          onDragCancel={() => setActiveId(null)}
        >
          <Whiteboard droppedItems={droppedItems} setDroppedItems={setDroppedItems} />
          <SideDropper />
          <DragOverlay>
            {activeId ? <DragPreview id={String(activeId)} /> : null}
          </DragOverlay>
        </DndContext>
      </>
    </ModalProvider>
    </DeleteModalProvider>
  );
}
