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

// dnd stuff
import { useDndContext } from '@dnd-kit/core'


// tracker context 
//import ConnectionFactoryContext from './components/Elements/TrackerContext/ConnectionFactoryContext';
import { useContext } from 'react';
import { ConnectionFactoryProvider } from './components/Elements/TrackerContext/ConnectionFactoryProvider';


import type { UniqueIdentifier } from '@dnd-kit/core';
import DragPreview from './components/Elements/SideDropper/DragPreview';

// components
import Whiteboard from "./components/Elements/Whiteboard/Whiteboard";
import type {DroppedItem} from "./components/Elements/Whiteboard/Whiteboard"; 
import SideDropper from "./components/Elements/SideDropper/SideDropper";

export default function App() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeType, setActiveType ] = useState<UniqueIdentifier | null>(null);
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);


  // enable touch and pointer support for mobile and desktop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
    useSensor(MouseSensor),
  );

  const context = useContext(ConnectionFactoryProvider)
  if (!context) {
      throw new Error("ConnectionFactoryAddElement context is undefined");
  }

  const { addConnectedElement, connectedElements } = context;
  const {active} = useDndContext()

  return (
  
  <DndContext
  sensors={sensors}
  onDragStart={(event) => {
    console.log('DRAG START:', event.active.id, event.active.data.current);
    setActiveId(event.active.id);
    setActiveType(event.active.data.current?.type);
    setActiveParentId(event.active.data.current?.parentElementId);
  }}
  onDragEnd={({ active: dragActive, over }) => {

    console.log('OVER:', over, 'ACTIVE:', dragActive);

    // droppable-1 → add to droppedItems
    if (over?.id === 'droppable-1') {
      const trackableItems = ['Timer'];

      // Prevent dropping tracker-input on whiteboard
      if (activeType === 'tracker-input') {
        setActiveId(null);
        setActiveType(null);
        setActiveParentId(null);
        return;
      }

      if (activeId && activeType) {
        setDroppedItems((prev) => [
          ...prev,
          {
            id: `${activeType}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,         
            type: String(activeType),
            trackable: trackableItems.includes(String(activeType)),
            tracker: activeType === 'Tracker' ? true : false
          }
        ]);
      }
    }

    // tracker-input dropped over tracker-output
    if (over?.data.current?.type === 'tracker-output') {
      if (addConnectedElement && activeParentId) {
        addConnectedElement({
          input: String(dragActive.id),
          output: String(over.id),
          inputParent: String(activeParentId), 
          outputParent: String(over.data.current.parentElementId),
        });
      }
    }

    // dropped over side dropper area
    else if (over?.id === 'droppable-2') {
      // just clear the active id (no item added)
      setActiveId(null);
      setActiveType(null);
      setActiveParentId(null);
    }

    // always clear active state
    setActiveId(null);
    setActiveType(null);
    setActiveParentId(null);
  }}

    onDragCancel={() => {
      setActiveId(null);
      setActiveType(null);
    }}
>
  <DeleteModalProvider>
    <ModalProvider>
      <>
        <DeleteElementModel />
        <TimeoutModel />
        <Whiteboard droppedItems={droppedItems} setDroppedItems={setDroppedItems} />
        <SideDropper />
        <DragOverlay>
          {activeId ? <DragPreview type={String(activeType)} /> : null}
        </DragOverlay>
      </>
    </ModalProvider>
  </DeleteModalProvider>
</DndContext>

  );
}
