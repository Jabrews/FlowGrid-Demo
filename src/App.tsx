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


// tracker context 
//import ConnectionFactoryContext from './components/Elements/TrackerContext/ConnectionFactoryContext';
import { useContext } from 'react';
import { TrackablePairContext } from './components/Elements/TrackerContext/TrackablePairContext';


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

  const addConnectedElement = useContext(TrackablePairContext);


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
          if (over?.data.current?.type == 'tracker-output') {
              
            if (addConnectedElement) {

                addConnectedElement(
                  {
                  input: String(active.id),
                  output: String(over.id),
                  inputParent: String(active),
                  outputParent: String(over?.data.current?.parentElementId),
                  }
              )
            }
            }      

          

          

          // if dropped over side dropper area
          else if (over?.id === 'droppable-2') {
            // just clear the active id (no item added)
            setActiveId(null);
            setActiveType(null)
          }


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
