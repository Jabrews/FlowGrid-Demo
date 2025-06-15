import { useEffect, useState } from 'react';
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
import { useConnectionLinesContext } from '../../Context/ConnectionLines';

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
  const connectionLines = lineStore((state) => state.connectionLines)

  const { open } = useDeleteModal();

  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {
    const newLayout = droppedItems.map((item: DroppedItem, index: number) => ({
      i: item.id,
      x: (index % 6) * 4,
      y: Math.floor(index / 6) * 2,
      w: 3,
      h: 2,
    }));
    setLayout(newLayout);
  }, [droppedItems]);

  return (
    <GridLayout
      layout={layout}
      compactType={null}
      cols={24}
      rowHeight={50}
      width={2000}
      margin={gridMargin}
      preventCollision={true}
      draggableHandle=".drag-handle"
      isResizable={false}
      useCSSTransforms={false}
      onLayoutChange={setLayout}
    >

      <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
  {connectionLines.map(({ startId, endId }) => {
    const startEl = document.getElementById(startId);
    const endEl = document.getElementById(endId);

    if (!startEl || !endEl) return null;

    const startBox = startEl.getBoundingClientRect();
    const endBox = endEl.getBoundingClientRect();

    const startX = startBox.left + startBox.width / 2;
    const startY = startBox.top + startBox.height / 2;
    const endX = endBox.left + endBox.width / 2;
    const endY = endBox.top + endBox.height / 2;

    return <line key={startId + '-' + endId} x1={startX} y1={startY} x2={endX} y2={endY} stroke="black" />;
  })}
</svg>


      {droppedItems.map((item: DroppedItem) => (
        <div key={item.id} className="whiteboard-item">
          <div className="item-header">
            <div className="drag-handle">::</div>
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
          {/* Dynamically render components and pass item.id to Timer */}
          {item.type === 'Timer' && <Timer id={item.id} />}
          {item.type === 'Tracker' && <Tracker id={item.id} />}
          {item.type === 'Chart' && <div>Chart Component</div>}
          {item.type === 'Note' && <div>Note Component</div>}
          {!['Timer', 'Tracker', 'Chart', 'Note'].includes(item.type) && <p>Unknown component</p>}

          {/* Only trackable items get the Input/Output */}
          {item.trackable && (
            <TrackerOutput parentElementId={item.id} id={`tracker-output-${Date.now()}`} type={'tracker-output'} />
          )}

          {/* Only tracker gets tracker input */}
          {item.tracker && (
            <TrackerInput parentElementId={item.id} id={`tracker-input-${item.id}`} type={'tracker-input'} />
          )}
        </div>
      ))}
    </GridLayout>
  );
}