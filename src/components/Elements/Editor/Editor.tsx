import {useState} from 'react';


// modal system
import { ModalProvider } from "../TimeoutModel/TimeoutModelContext";
import TimeoutModel from "../TimeoutModel/TimeoutModel";
import { DeleteModalProvider } from "../DeleteElementModel/DeleteElementModelContext";
import DeleteElementModel from '../DeleteElementModel/DeleteElementModel'
import '../../../styles/main.css';

// Item Factory
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';

// Pair Factory
import { usePairFactoryContext } from '../../Context/PairFactory/PairFactoryContext';

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
import DragPreview from '../SideDropper/DragPreview';

// components
import Whiteboard from "../Whiteboard/Whiteboard";
import type { DroppedItem } from '../../Context/ItemFactory/ItemFactoryContext';
import SideDropper from "../SideDropper/SideDropper";

export default function Editor() {

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeType, setActiveType ] = useState<UniqueIdentifier | null>(null);
  //const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);

  // enable touch and pointer support for mobile and desktop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
    useSensor(MouseSensor),
  );

  //ItemFactory Store 
  const store = useItemFactoryContext()
  const droppedItems = store((state) => state.droppedItems)
  const addDroppedItem = store((state) => state.addDroppedItem)

  //ItemPair Store 
  const pairStore = usePairFactoryContext()
  const connectedTracker = pairStore((state) => state.connectedTracker)
  const addConnectedTracker = pairStore((state) => state.addConnectedTracker)
  const connectedItem = pairStore((state) => state.connectedItem)
  const addConnectedItem = pairStore((state) => state.addConnectedItem)
  const createPair = pairStore((state) => state.createPair);
  const connectedItems = pairStore((state) => state.connectedItems);


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
            const id = event.active.id
            const uniqueId = `${id}-${Date.now()}`;
            setActiveId(uniqueId)
            const type = event.active.data.current?.type
            setActiveType(type)  
          }}

          // called when dragging ends (drop or cancel)
          onDragEnd={({ over, active }) => {

            // console.log('over : ', over)
            // console.log('active : ', active)


            if (over?.id === 'droppable-1') {
              const trackableItems = ['Timer'];

              // Prevent dropping tracker-input on whiteboard
              if (activeType === 'tracker-input') {
                setActiveId(null);
                setActiveType(null);
                return;
              }

              if (activeId && activeType) {
                addDroppedItem({
                    id: String(activeId),
                    type: String(activeType),
                    trackable: trackableItems.includes(String(activeType)),
                    tracker : activeType == 'Tracker' ? true : false,
                    connected: false,
                    parentConnectionId: '',
                  })
                  setActiveId(null);
                  setActiveType(null);
              }
            }

          // if dropped over side dropper area
          else if (over?.id === 'droppable-2') {
            // just clear the active id (no item added)
            setActiveId(null);
            setActiveType(null)
          }

          else if (over?.data.current?.type === 'tracker-output') {;
            if (activeType === 'tracker-input') {
            const overParentId = over.data.current?.parentElementId;
            const activeParentId = active.data.current?.parentElementId
            addConnectedTracker(activeParentId)
            addConnectedItem(overParentId)
            createPair();
            
          }
        }


          // clear the active id to end drag preview
          setActiveId(null);
        }}

          onDragCancel={() => {
            setActiveId(null);
            setActiveType(null);
          }}        
          >


          <Whiteboard/>
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
