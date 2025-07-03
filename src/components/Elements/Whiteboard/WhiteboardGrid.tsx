import { useEffect, useState, useRef} from 'react';
import GridLayout from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import Timer from '../Timer/Timer';
import Tracker from '../Tracker/Tracker';
import TrackerOutput from '../Tracker/TrackerOutput';
import TrackerInput from '../Tracker/TrackerInput';

import type { DroppedItem } from '../../Context/ItemFactory/ItemFactoryContext'

// Item Factory
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';

// Connected Item Factory
import { usePairFactoryContext } from '../../Context/PairFactory/PairFactoryContext';

// Line Store
import { useConnectionLinesContext } from '../../Context/ConnectionLines/ConnectionLines';

// Delete Element Modal Context
import { useDeleteElementModalContext } from '../../Context/Modals/DeleteElementModalContext';

type WhiteboardGridProps = {
  gridMargin: [number, number];
};

export default function WhiteboardGrid({ gridMargin }: WhiteboardGridProps) {



  // Item factory context
  const store = useItemFactoryContext();
  const droppedItems = store((state) => state.droppedItems);
  const whiteboardRef = store((state) => state.whiteboardRef);
  const whiteboardGridRef = store((state) => state.whiteboardGridRef)
  const setWhiteboardGridRef = store((state) => state.setWhiteboardGridRef)

  // Connected Item factory Context
  const connectionStore = usePairFactoryContext()
  const connectedItems = connectionStore((state) => state.connectedItems)

  // connection Line Context
  const lineStore = useConnectionLinesContext()
  const elementRefs = lineStore((state) => state.elementRefs)
  const setPausedLineId = lineStore((state) => state.setPausedLineId)
  const pausedLineId = lineStore((state) => state.pausedLineId)
  const pauseLine = lineStore((state) => state.pauseLine)
  const resumeLine = lineStore((state) => state.resumeLine)


  // delete element modal context
  const deleteElementModalStore = useDeleteElementModalContext()
  const {toggleShowModal, setTargetId} = deleteElementModalStore((state) => state)

  // mouse postion
  const [isDragging, toggleIsDragging] = useState(false)

  // layout
  const [layout, setLayout] = useState<Layout[]>([]);

  const localWhiteboardGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  setLayout((prevLayout) => {
    const layoutMap = new Map(prevLayout.map((item) => [item.i, item]));

    return droppedItems.map((item, index) => {
      const existing = layoutMap.get(item.id);
      if (existing && !item.placementPos) {
        console.log('returning cus existing')
        return existing
      };

      const defaultW = 3;
      const defaultH = 2;

      // const gridX = item.placementPos?.x ?? (index % 6) * 4;
      // const gridY = item.placementPos?.y ?? Math.floor(index / 6) * 2;

      console.log('debug :  x : ', item.placementPos.x, ' y : ', item.placementPos.y)

      return {
        i: item.id,
        x: item.placementPos.x,
        y: item.placementPos.y,
        w: defaultW,
        h: defaultH,
      };
      });
    });
  }, [droppedItems]);


  useEffect(() => {
    
      
  if (isDragging && whiteboardRef?.current) {
    let animationFrameId: number;

    const SCROLL_SPEED = 30; // Adjust speed to taste
    const edge = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const mouse = {
        x: e.clientX,
        y: e.clientY,
      };

      const ref = whiteboardRef.current;
      if (!ref) return;

      const rect = ref.getBoundingClientRect();

      const nearEdge = {
        left: mouse.x - rect.left < edge,
        right: rect.right - mouse.x < edge,
        top: mouse.y - rect.top < edge,
        bottom: rect.bottom - mouse.y < edge,
      };

      handleScrollingWhiteboard(nearEdge);
    };

    const handleScrollingWhiteboard = (nearEdge) => {
      const ref = whiteboardRef.current;
      if (!ref) return;

      const scroll = () => {
        if (nearEdge.left) ref.scrollLeft -= SCROLL_SPEED;
        if (nearEdge.right) ref.scrollLeft += SCROLL_SPEED;
        if (nearEdge.top) ref.scrollTop -= SCROLL_SPEED;
        if (nearEdge.bottom) ref.scrollTop += SCROLL_SPEED;

        animationFrameId = requestAnimationFrame(scroll);
      };

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(scroll);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }
}, [isDragging, whiteboardRef]);

  useEffect(() => {
    if (localWhiteboardGridRef != null) {
      setWhiteboardGridRef(localWhiteboardGridRef);
    }
  }, [setWhiteboardGridRef, localWhiteboardGridRef]);

  const handleDeleteHandle = (targetItemId : string) => {

    toggleShowModal(true)
    setTargetId(targetItemId)
  } 

  return (
    <div style={{
    width: '100%',
    minHeight: '100%', // makes sure it's tall
    overflow: 'none',
    position: 'relative',
    background: 'grey',
    }}
    ref={localWhiteboardGridRef} 
    >
    <GridLayout
      layout={layout}
      compactType={null}
      cols={24}
      rowHeight={250}
      width={3000}
      margin={gridMargin}
      preventCollision={true}
      draggableHandle=".drag-handle"
      isResizable={false}
      useCSSTransforms={false}
      onLayoutChange={setLayout}

    onDragStart={() => {
      if (pausedLineId !== '') {
        pauseLine()
        toggleIsDragging(true)
      }
    }}

  onDragStop={() => {
    setTimeout(() => {
      resumeLine();
      toggleIsDragging(false)
    }, 200);
  }}
    >



      {droppedItems.map((item: DroppedItem) => (
        <div key={item.id} className="whiteboard-item">
          <div className="item-header">
            <div className="drag-handle" onMouseDown={() => setPausedLineId(item.id)}>::</div>
            <div
              className="delete-handle"
              onClick={() => {handleDeleteHandle(item.id)}}
            >
              X
            </div>
          </div>
          <div ref={(el) => { elementRefs.current[item.id] = el }}> 
            {/* Dynamically render components and pass item.id to Timer */}
            {item.type === 'Timer' && <Timer id={item.id} />}
            {item.type === 'Tracker' && <Tracker id={item.id} />}
            {item.type === 'Chart' && <div>Chart Component</div>}
            {item.type === 'Note' && <div>Note Component</div>}
            {!['Timer', 'Tracker', 'Chart', 'Note'].includes(item.type) && <p>Unknown component</p>}

            {/* Only trackable items get the Input/Output */}
            {item.trackable && (
              <TrackerOutput parentElementId={item.id} id={`tracker-output-${item.id}`} type={'tracker-output'} />
            )}

            {/* Only tracker gets tracker input */}
            {item.tracker && (
              <TrackerInput parentElementId={item.id} id={`tracker-input-${item.id}`} type={'tracker-input'} />
            )}
          </div>
        </div>

      ))}



    </GridLayout>
    </div>
  );
}