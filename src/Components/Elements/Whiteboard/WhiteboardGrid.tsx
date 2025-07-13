import { useEffect, useMemo, useRef, useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import Timer from '../Timer/Timer';
import Tracker from '../Tracker/Tracker';
import NoteList from '../Note/NoteList';
import TrackerOutput from '../Tracker/TrackerOutput';
import TrackerInput from '../Tracker/TrackerInput';
import TableList from '../Table/TableList';

import type { DroppedItem } from '../../../Context/ItemFactory/ItemFactoryContext';

import { useItemFactoryContext } from '../../../Context/ItemFactory/ItemFactoryContext';
import { useConnectionLinesContext } from '../../../Context/ConnectionLines/ConnectionLines';
import { useDeleteElementModalContext } from '../../../Context/Modals/DeleteElementModalContext';
import { TableContextProvider } from '../../../Context/ElementContext/TableContext';
import { NoteListContextProvider } from '../../../Context/ElementContext/NoteListContext';

import { shallow } from 'zustand/shallow';
import { useEdgeAutoScroll } from '../../../Util/WhiteboardUtils/useEdgeAutoScroll.ts';

type WhiteboardGridProps = {
  gridMargin: [number, number];
};

export default function WhiteboardGrid({ gridMargin }: WhiteboardGridProps) {
  const store = useItemFactoryContext();
  const droppedItems: Record<string, DroppedItem> = store((state) => state.droppedItems, shallow);
  const whiteboardRef = store((state) => state.whiteboardRef);
  const setWhiteboardGridRef = store((state) => state.setWhiteboardGridRef);
  const updateDroppedItemPosition = store((state) => state.updateDroppedItemPosition);

  const lineStore = useConnectionLinesContext();
  const elementRefs = lineStore((state) => state.elementRefs);
  const setPausedLineId = lineStore((state) => state.setPausedLineId);
  const pausedLineId = lineStore((state) => state.pausedLineId);
  const pauseLine = lineStore((state) => state.pauseLine);
  const resumeLine = lineStore((state) => state.resumeLine);

  const deleteElementModalStore = useDeleteElementModalContext();
  const { toggleShowModal, setTargetId } = deleteElementModalStore((state) => state);

  const [isDragging, toggleIsDragging] = useState(false);
  const localWhiteboardGridRef = useRef<HTMLDivElement | null>(null);

  useEdgeAutoScroll(isDragging, whiteboardRef);

  useEffect(() => {
    if (localWhiteboardGridRef.current) {
      setWhiteboardGridRef(localWhiteboardGridRef);
    }
  }, [setWhiteboardGridRef]);

  const layout = useMemo(() => {
    return Object.values(droppedItems).map((item) => {
      const defaultW = 3;
      const defaultH = 3;

      return {
        i: item.id,
        x: item.placementPos.x,
        y: item.placementPos.y,
        w: defaultW,
        h: defaultH,
      };
    });
  }, [droppedItems]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    newLayout.forEach(({ i, x, y }) => {
      const currentItem = droppedItems[i];
      if (!currentItem) return;

      if (currentItem.placementPos.x !== x || currentItem.placementPos.y !== y) {
        updateDroppedItemPosition(i, { x, y });
      }
    });
  };

  const handleDeleteHandle = (targetItemId: string) => {
    toggleShowModal(true);
    setTargetId(targetItemId);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        overflow: 'none',
        position: 'relative',
      }}
      className="grid-container-styling"
      ref={localWhiteboardGridRef}
    >
      <GridLayout
        layout={layout}
        compactType={null}
        cols={24}
        rowHeight={15}
        width={3000}
        margin={gridMargin}
        draggableHandle=".drag-handle"
        isResizable={false}
        useCSSTransforms={false}
        onLayoutChange={handleLayoutChange}
        onDragStart={() => {
          if (pausedLineId !== '') {
            pauseLine();
            toggleIsDragging(true);
          }
        }}
        onDragStop={() => {
          setTimeout(() => {
            resumeLine();
            toggleIsDragging(false);
          }, 200);
        }}
      >
        {Object.values(droppedItems).map((item: DroppedItem) => (
          <div key={item.id} className="whiteboard-item">
            <div className="item-header">
              <div className="drag-handle" onMouseDown={() => setPausedLineId(item.id)}>::</div>
              <div
                className="delete-handle"
                onClick={() => {
                  handleDeleteHandle(item.id);
                }}
              >
                X
              </div>
            </div>
            <div ref={(el) => { elementRefs.current[item.id] = el }}>
              {item.type === 'Timer' && <Timer id={item.id} />}
              {item.type === 'Tracker' && <Tracker id={item.id} />}
              {item.type === 'Note-List' && (
                <NoteListContextProvider>
                  <NoteList id={item.id} />
                </NoteListContextProvider>
              )}
              {item.type === 'Table-List' && (
                <TableContextProvider>
                  <TableList id={item.id} />
                </TableContextProvider>
              )}
              {!['Timer', 'Tracker', 'Chart', 'Note-List', 'Table-List'].includes(item.type) && <p>Unknown component</p>}

              {item.trackable && (
                <TrackerOutput parentElementId={item.id} id={`tracker-output-${item.id}`} type={'tracker-output'} />
              )}

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
