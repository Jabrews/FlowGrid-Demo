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
  const [activeType, setActiveType ] = useState<UniqueIdentifier | null>(null);
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


          // get dragged objects id
            // create unique id
            const id = event.active.id
            const uniqueId = `${id}-${Date.now()}`;
            // set id 
            setActiveId(uniqueId)
          // get dragged objects type
            const type = event.active.data.current?.type
            // set type          
            setActiveType(type)  
          }}

          // called when dragging ends (drop or cancel)
          onDragEnd={({ over, active }) => {

            console.log('over : ', over)


            if (over?.id === 'droppable-1') {
              const trackableItems = ['Timer'];

              // Prevent dropping tracker-input on whiteboard
              if (activeType === 'tracker-input') {
                setActiveId(null);
                setActiveType(null);
                return;
              }

              if (activeId && activeType) {
                setDroppedItems((prev) => [
                  ...prev,
                  {
                    id: String(activeId),
                    type: String(activeType),
                    trackable: trackableItems.includes(String(activeType)),
                    tracker : activeType == 'Tracker' ? true : false
                  }
                ]);
              }
            }


          // if tracker inout dropped over tracker output 
          else if (over?.data.current?.type == 'tracker-output') {

            // get tracker-input and its parent object (both should have special ids)
            console.log('DEBUG trackerInput id : ', active.id)
            console.log('DEBUG parentInput id : ', active)
            // get tracker-output and its parent object (both should have special ids)
            console.log('DEBUG trackerOutput id : ', over.id)
            console.log('DEBUG parentOutput id : ', over.data.current.parentElementId)
            

            console.log('DEBUG Dropped Items : ', droppedItems)
          
          }

          

          // if dropped over side dropper area
          else if (over?.id === 'droppable-2') {
            // just clear the active id (no item added)
            setActiveId(null);
            setActiveType(null)
          }


          // log current state of dropped items (note: may show stale data due to async state)
          console.log('app dropped items :', droppedItems);

          // clear the active id to end drag preview
          setActiveId(null);
        }}

          onDragCancel={() => {
            setActiveId(null);
            setActiveType(null);
          }}        
          >


          <Whiteboard droppedItems={droppedItems} setDroppedItems={setDroppedItems} />
          <SideDropper />
          <DragOverlay>
            {activeId ? <DragPreview type={String(activeType)} /> : null}
          </DragOverlay>
        </DndContext>
      </>
    </ModalProvider>
    </DeleteModalProvider>
  );
}
