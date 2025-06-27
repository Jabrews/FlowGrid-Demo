import { useEffect, useState, useRef } from 'react';
import { JSX } from 'react';
import GridLayout from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import Timer from '../Timer/Timer';
import Tracker from '../Tracker/Tracker';
import TrackerOutput from '../Tracker/TrackerOutput';
import TrackerInput from '../Tracker/TrackerInput';

import { useDeleteModal } from '../DeleteElementModel/DeleteElementModelContext';

import type { DroppedItem } from '../../Context/ItemFactory/ItemFactoryContext'

// Item Factory
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';

// Connected Item Factory
import { usePairFactoryContext } from '../../Context/PairFactory/PairFactoryContext';

// Tracker Menu Context
import { useTimerMenuContext } from '../../Context/TrackerMenusContext/TimerMenuContext';

// Line Store
import { useConnectionLinesContext } from '../../Context/ConnectionLines/ConnectionLines';
import { line } from 'framer-motion/client';


type WhiteboardGridProps = {
  gridMargin: [number, number];
};

export default function WhiteboardGrid({ gridMargin }: WhiteboardGridProps) {



  // Item factory context
  const store = useItemFactoryContext();
  const droppedItems = store((state) => state.droppedItems);
  const setDroppedItems = store((state) => state.setDroppedItems);
  const removeDroppedItem = store((state) => state.removeDroppedItem);

  // Connected Item factory Context
  const connectionStore = usePairFactoryContext()
  const connectedItems = connectionStore((state) => state.connectedItems)
  const removeConnectedItem = connectionStore((state) => state.removeConnectedItem)

  // Tracker Timer Menu Context
  const timerMenuStore = useTimerMenuContext();
  const timerTrackerItems = timerMenuStore((state) => state.timerTrackerItems);
  const removeTimerTrackerItem = timerMenuStore((state) => state.removeTimerTrackerItem)
  const removeTimerTracker = timerMenuStore((state) => state.removeTimerTracker)


  // connection Line Context
  const lineStore = useConnectionLinesContext()
  const elementRefs = lineStore((state) => state.elementRefs)
  const setPausedLineId = lineStore((state) => state.setPausedLineId)
  const pausedLineId = lineStore((state) => state.pausedLineId)
  const pauseLine = lineStore((state) => state.pauseLine)
  const resumeLine = lineStore((state) => state.resumeLine)

  const { open } = useDeleteModal();

  // layout
  const [layout, setLayout] = useState<Layout[]>([]);


  useEffect(() => {
    setLayout((prevLayout) => {
      // map existing layout by item id
      const layoutMap = new Map(prevLayout.map((item) => [item.i, item]));

      // build new layout, preserving old positions
      return droppedItems.map((item, index) => {
        const existing = layoutMap.get(item.id);
        if (existing) return existing;

        // new item → give it a default position
        return {
          i: item.id,
          x: (index % 6) * 4,
          y: Math.floor(index / 6) * 2,
          w: 3,
          h: 2,
        };
      });
    });
  }, [droppedItems]);




  return (
    <div style={{
    width: '100%',
    minHeight: '100%', // makes sure it's tall
    overflow: 'none',
    position: 'relative',
    background: 'grey',
    margin: '5%',
    }}>
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
      }
    }}

  onDragStop={() => {
    setTimeout(() => {
      resumeLine();
    }, 200);
  }}



    >

    

  <svg
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      pointerEvents: 'none',
    }}
  >
    {connectedItems.map((pair, idx) => {
      const trackerEl = elementRefs.current[pair.tracker.id];
      const itemEl = elementRefs.current[pair.item.id];

      if (itemEl && trackerEl) {
        const trackerInput = trackerEl.querySelector('.tracker-input');
        const itemOutput = itemEl.querySelector('.tracker-output');
        const inputSvg = trackerInput?.querySelector('svg');
        const outputSvg = itemOutput?.querySelector('svg');
        const inputRect = inputSvg?.getBoundingClientRect();
        const outputRect = outputSvg?.getBoundingClientRect();

        if (inputRect && outputRect) {
          const x1 = outputRect.left + outputRect.width / 2;
          const y1 = outputRect.top + outputRect.height / 2;
          const x2 = inputRect.left + inputRect.width / 2;
          const y2 = inputRect.top + inputRect.height / 2;

          return (
            <line
              key={pair.tracker.id + '-' + pair.item.id + '-' + idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="black"
              strokeWidth={2}
            />
          );
        }
      }

      return null;
    })}
  </svg>



      {droppedItems.map((item: DroppedItem) => (
        <div key={item.id} className="whiteboard-item">
          <div className="item-header">
            <div className="drag-handle" onMouseDown={() => setPausedLineId(item.id)}>::</div>
            <div
              className="delete-handle"
              onClick={() =>
                open(item.id, () => {
                  removeDroppedItem(item.id);
                  removeConnectedItem(item.id);
                  if (item.type == 'Timer' && item.connected == true) {
                    removeTimerTrackerItem(item.id)
                  }
                  else if (item.type  == 'Tracker' && item.connected == true) {
                    removeTimerTracker(item.id)
                  }
                })
              }
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