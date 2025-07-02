import {useState, useEffect, useRef} from 'react'


import '../../../styles/main.css';

// modal : element connection toggle 
import { ConnectionToggleModalContextProvider } from '../../Context/Modals/ConnectionToggleModalContext';
// modal : timer timeout
import { TimeoutModalContextProvider } from '../../Context/Modals/TimeoutModalContext';
// modal : Delete Element
import { DeleteElementModalContextProvider } from '../../Context/Modals/DeleteElementModalContext';

// white board utlil contexts
import { ViewportPanContextProvider} from '../../Context/ViewportPan/ViewportPanContext';

// Item Factory
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';
import type { DroppedMousePos } from '../../Context/ItemFactory/ItemFactoryContext';

// Pair Factory
import { usePairFactoryContext } from '../../Context/PairFactory/PairFactoryContext';

// Connection Line Context
import { useConnectionLinesContext } from '../../Context/ConnectionLines/ConnectionLines';


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
  const toggleUserAddingItem = store((state) => state.toggleUserAddingItem)
  const userAddingItem = store((state) => state.userAddingItem)
  const setItemDroppedMousePos = store((state) => state.setItemDroppedMousePos)
  const calcRelativeMousePos = store((state) => state.calcRelativeMousePos)

  //ItemPair Store 
  const pairStore = usePairFactoryContext()
  const connectedTracker = pairStore((state) => state.connectedTracker)
  const addConnectedTracker = pairStore((state) => state.addConnectedTracker)
  const connectedItem = pairStore((state) => state.connectedItem)
  const addConnectedItem = pairStore((state) => state.addConnectedItem)
  const createPair = pairStore((state) => state.createPair);
  const connectedItems = pairStore((state) => state.connectedItems);

  //Connection Line Store (moving objects)
  const lineStore = useConnectionLinesContext()
  const setLineElems = lineStore((state) => state.setLineElems)
  const setPausedLineId = lineStore((state) => state.setPausedLineId)
  const pauseLine = lineStore((state) => state.pauseLine)
  const resumeLine = lineStore((state) => state.resumeLine)

  // useEffect for tracking where mouse ends, set when adding
  // --dropped item
 
  useEffect(() => {

    const handleMouseUp = (e: MouseEvent) => {
      if (userAddingItem === true) {
        console.log('mouse got up after dragging item : ', e);
        const newDroppedPos : DroppedMousePos = {
          x : e.clientX,
          y : e.clientY
        }
        setItemDroppedMousePos(newDroppedPos)
        toggleUserAddingItem(false)
        calcRelativeMousePos()
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [userAddingItem]);



  return (

    <ConnectionToggleModalContextProvider>
    <TimeoutModalContextProvider>
    <DeleteElementModalContextProvider>
      <>
      
        <DndContext

          sensors={sensors}
          // called when dragging begins

          onDragStart={(event) => {

            console.log('drag true')
            toggleUserAddingItem(true)

          // get dragged objects id
            const id = event.active.id
            if (String(id).includes('tracker-input')) {
              setPausedLineId(event.active?.data.current?.parentElementId)
              pauseLine()
            }
            const uniqueId = `${id}-${Date.now()}`;
            setActiveId(uniqueId)
            const type = event.active.data.current?.type
            setActiveType(type)  

          }}

          // called when dragging ends (drop or cancel)
          onDragEnd={({ over, active }) => {          

            resumeLine()
                
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



          else if (over?.data.current?.type === 'tracker-output') {
            if (activeType === 'tracker-input') {
            const overParentId = over.data.current?.parentElementId;
            const activeParentId = active.data.current?.parentElementId
            addConnectedTracker(activeParentId)
            addConnectedItem(overParentId)
            createPair();
            setLineElems(activeParentId, overParentId)
          }
        }


          // clear the active id to end drag preview
          setActiveId(null);

            console.log('drag end')

        }}

          onDragCancel={() => {
            setActiveId(null);
            setActiveType(null);

            console.log('drag end')
            toggleUserAddingItem(false)             

          }}        
          >

          <ViewportPanContextProvider>
            <Whiteboard/>
          </ViewportPanContextProvider>
          <SideDropper />
          <DragOverlay>
            {activeId ? <DragPreview type={String(activeType)} /> : null}
          </DragOverlay>
        </DndContext>
      </>
    </DeleteElementModalContextProvider>
    </TimeoutModalContextProvider>
    </ConnectionToggleModalContextProvider>
  );
}
